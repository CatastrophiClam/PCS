from typing import List, Union, Tuple, Dict
from uuid import uuid1

from server.model.base_model_table import BaseModelTable
from server.model.constants import EXCLUDE_FROM_HASH_FIELDS, EXCLUDE_FROM_COLUMN_FIELDS
from server.model.database import Database as Database_Model
from server.model.query_syntax import WhereClause, Statement, LogOp, Comp, Value, Clause
from server.model.repository import Table, Column, Row, ForeignKey
from server.repository.contants import DB_TYPE_TO_DECLARE_TYPE
from server.repository.database import Database as Database_Repo


class Repository:

    def __init__(self, db: Database_Repo, db_model: Database_Model):
        self.db_repo = db
        self.db_model = db_model

    def get_table_fkeys(self, table_name: str):
        s = """SELECT
            kcu.column_name, 
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name 
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='{0}';""".format(table_name)
        data = self.db_repo.fetch(s)
        foreign_keys = {}
        for k in data:
            foreign_keys[k[0]] = ForeignKey(k[1], k[2])
        return foreign_keys

    # Returns column name of table pkey
    def get_table_pkey(self, table_name: str):
        s = """SELECT kcu.column_name as key_column
        FROM information_schema.table_constraints tco
        JOIN information_schema.key_column_usage kcu 
             on kcu.constraint_name = tco.constraint_name
             and kcu.constraint_schema = tco.constraint_schema
             and kcu.constraint_name = tco.constraint_name
        WHERE tco.constraint_type = 'PRIMARY KEY' AND kcu.table_name = '{0}'""".format(table_name)
        data = self.db_repo.fetch(s)
        pkeys = [i[0] for i in data]
        return pkeys

    def get_table_columns(self, table_name: str):
        s = "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM information_schema.COLUMNS WHERE TABLE_NAME = '{0}'".format(table_name)
        data = self.db_repo.fetch(s)
        columns = [Column(i[0], DB_TYPE_TO_DECLARE_TYPE[i[1]], nullable=(i[2] == 'YES')) for i in data]

        fkeys = self.get_table_fkeys(table_name)
        pkeys = self.get_table_pkey(table_name)
        for col in columns:
            if col.name in fkeys:
                col.foreign_key = fkeys[col.name]
            if col.name in pkeys:
                col.is_primary_key = True
        return columns

    def add_table(self, table: Table):
        s = "CREATE TABLE {0} (".format(table.name)
        primary_key = ""
        for c in table.columns:
            if c.is_primary_key:
                primary_key = c.name
        for c in table.columns:
            s += "{0} {1}".format(c.name, c.type)
            if not c.nullable:
                s += " NOT NULL"
            if c.foreign_key is not None:
                s += " REFERENCES {0}({1})".format(c.foreign_key.reference_table, c.foreign_key.reference_col)
            s += ","
        s += "PRIMARY KEY ({0}));".format(primary_key)
        print("Adding table with string: ")
        print(s)
        self.db_repo.execute(s)

    def get_tables(self):
        s = "SELECT * FROM information_schema.tables WHERE table_schema = 'public'"
        table_names = self.db_repo.fetch(s)
        tables = {res[2]: Table(res[2], self.get_table_columns(res[2])) for res in table_names}
        return tables

    def remove_table(self, table_name: str):
        s = "DROP TABLE {0};".format(table_name)
        self.db_repo.execute(s)

    def remove_col(self, table_name: str, col_name: str):
        s = "ALTER TABLE {0} DROP COLUMN {1};".format(table_name, col_name)
        self.db_repo.execute(s)

    def add_col(self, column: Column, table_name: str):
        s = "ALTER TABLE {0} ADD COLUMN {1} {2}".format(table_name, column.name, column.type)
        if not column.nullable:
            s += " NOT NULL"
        if column.foreign_key is not None:
            s += " REFERENCES {0}({1})".format(column.foreign_key.reference_table, column.foreign_key.reference_col)
        s += ";"
        self.db_repo.execute(s)

    def add_row_to_table(self, row: Row, table_name: str):
        row_id = str(uuid1())
        cols = "id, hash"
        vals = "'" + row_id + "', '{0}'".format(self.hash_fields_for_table(row, table_name))

        for key in row:
            if key in self.db_model.get_table_class(table_name).__annotations__ and row[key] is not None:
                cols += (", " + key)
                val_to_insert = row[key]
                if self.db_model.get_table_class(table_name).__annotations__[key] is str:
                    val_to_insert = "'" + val_to_insert + "'"
                vals += (", " + val_to_insert)
        s = "INSERT INTO {0} ({1}) VALUES ({2})".format(table_name, cols, vals)
        self.db_repo.execute(s)
        return row_id

    def hash_fields_for_table(self, fields: Row, table_name: str) -> int:
        hashable_list = [key + str(fields[key]) for key in fields if key in self.db_model.get_table_class(table_name).__annotations__]
        hashable_list.sort()
        return hash(str(hashable_list))

    # Check if the row contains any data that can be put into the table
    def check_table_accepts_data_recursive(self, row: Row, table_name: str):
        # If the table contains a field that the row provides, then return true
        table_cls = self.db_model.get_table_class(table_name)
        for field in table_cls.__annotations__:
            if field in row and row[field] is not None:
                return True
        for foreign_key in table_cls.metadata.foreign_keys:
            if self.check_table_accepts_data_recursive(row, table_cls.metadata.foreign_keys[foreign_key].reference_table):
                return True
        return False

    # For when tables have foreign keys to other tables that should have data filled
    def add_row_to_table_recursive(self, row: Row, table_name: str):
        table_cls = self.db_model.get_table_class(table_name)
        row_for_curr_table = row.copy()

        for foreign_key in table_cls.metadata.foreign_keys:
            foreign_table_name = table_cls.metadata.foreign_keys[foreign_key].reference_table

            data_hash = str(self.hash_fields_for_table(row, foreign_table_name))
            foreign_table_data_id = self.get_data_for_table(foreign_table_name, ["{0}.id".format(foreign_table_name)],
                                                            WhereClause([Clause([Statement("{0}.hash".format(foreign_table_name),
                                                                        Comp.EQ, Value(data_hash))])]))
            if self.check_table_accepts_data_recursive(row, foreign_table_name):
                if len(foreign_table_data_id) == 0:
                    entry_id = self.add_row_to_table_recursive(row, foreign_table_name)
                    row_for_curr_table[foreign_key] = entry_id
                else:
                    row_for_curr_table[foreign_key] = foreign_table_data_id[0].id
        return self.add_row_to_table(row_for_curr_table, table_name)

    def get_all_subtables(self, table_name: str) -> List[str]:
        table_cls = self.db_model.get_table_class(table_name)
        l = [foreignKey.reference_table for _, foreignKey in table_cls.metadata.foreign_keys.items()]
        answer = l.copy()
        for table in l:
            answer += self.get_all_subtables(table)
        return answer

    # Data keys must be in form table_name.field_name
    def create_object_from_data_recursive(self, table_name: str, data: Dict[str, str]) -> BaseModelTable:
        curr_table_cols = [key for key in vars(self.db_model.get_table_class(table_name)())]
        curr_table_data = {key: data["{0}.{1}".format(table_name, key)]
                           if "{0}.{1}".format(table_name, key) in data else None for key in curr_table_cols}
        curr_table_cls = self.db_model.get_table_class(table_name)
        for foreignkey_field, foreignKey in curr_table_cls.metadata.foreign_keys.items():
            curr_table_data[foreignkey_field] = self.create_object_from_data_recursive(foreignKey.reference_table, data)

        curr_table_is_none = True
        for k, v in curr_table_data.items():
            if v is not None:
                curr_table_is_none = False
        if curr_table_is_none:
            return None
        else:
            return curr_table_cls(**{key: curr_table_data[key] for key in curr_table_cols})

    def get_all_subtable_joins(self, table_name: str):
        s = ""
        table_cls = self.db_model.get_table_class(table_name)
        for field_name, foreignKey in table_cls.metadata.foreign_keys.items():
            s += "LEFT JOIN {0} ON {1}.{2} = {0}.id ".format(foreignKey.reference_table, table_name, field_name)
            s += self.get_all_subtable_joins(foreignKey.reference_table)
        return s

    # Get data in the form of a list of flat dicts
    def get_raw_data_for_table(self, table_name: str, fields: List[str], whereClause: WhereClause, limit: str = None, offset: int = 0) -> List[Dict[str, str]]:
        all_tables = [table_name] + self.get_all_subtables(table_name)
        subtables_join_str = self.get_all_subtable_joins(table_name)
        if fields[0] == "*":
            fields = ["{0}.{1}".format(t_name, col) for t_name in all_tables for col in
                      vars(self.db_model.get_table_class(t_name)()) if col not in EXCLUDE_FROM_COLUMN_FIELDS]
        fieldStr = ""
        for i in range(len(fields)):
            if i > 0:
                fieldStr += ", "
            fieldStr += fields[i]

        s = "SELECT {0} FROM {1} {2}".format(fieldStr, table_name, subtables_join_str)
        if whereClause is not None:
            s += " WHERE {0}".format(str(whereClause))
        s += " LIMIT {0} OFFSET {1}".format("NULL" if limit is None else limit, offset)
        print(s)
        data = self.db_repo.fetch(s)
        formatted_data = [{fields[j]: d[j] for j in range(len(fields))} for d in data]
        return formatted_data

    # Get data in the form of a list of objects
    def get_data_for_table(self, table_name: str, fields: List[str], whereClause: WhereClause, limit: str = None, offset: int = 0) -> List[BaseModelTable]:
        raw_data = self.get_raw_data_for_table(table_name, fields, whereClause, limit, offset)
        answers = [self.create_object_from_data_recursive(table_name, d) for d in raw_data]
        return answers

    # Count number of rows returned from certain query
    # We use lazy counting way for now
    def count_data_for_table(self, table_name: str, fields: List[str], whereClause: WhereClause) -> int:
        raw_data = self.get_raw_data_for_table(table_name, fields, whereClause)
        return len(raw_data)

    def get_categories(self):
        pass

    def get_category_fields(self):
        pass
