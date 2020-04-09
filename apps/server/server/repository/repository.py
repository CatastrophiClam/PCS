from uuid import uuid1

from server.model.constants import EXCLUDE_FROM_HASH_FIELDS
from server.model.database import Database as Database_Model
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
        cols = "id"
        vals = "'" + row_id + "'"
        if 'hash' in self.db_model.get_table_class(table_name).__annotations__:
            cols += ", hash"
            vals += ", '{0}'".format(self.hash_fields_for_table(row, table_name))

        for key in row:
            if key in self.db_model.get_table_class(table_name).__annotations__:
                cols += (", " + key)
                val_to_insert = row[key]
                if self.db_model.get_table_class(table_name).__annotations__[key] is str:
                    val_to_insert = "'" + val_to_insert + "'"
                vals += (", " + val_to_insert)
        s = "INSERT INTO {0} ({1}) VALUES ({2})".format(table_name, cols, vals)
        self.db_repo.execute(s)
        return row_id

    def hash_fields_for_table(self, fields: Row, table_name: str):
        return hash(str([key + fields[key] for key in fields if key not in EXCLUDE_FROM_HASH_FIELDS and
                         key in self.db_model.get_table_class(table_name).__annotations__].sort()))

    # Check if the row contains any data that can be put into the table
    def check_table_accepts_data_recursive(self, row: Row, table_name: str):
        # If the table contains a field that the row provides, then return true
        table_cls = self.db_model.get_table_class(table_name)
        for field in table_cls.__annotations__:
            if field in row:
                return True
        for foreign_key in table_cls.metadata.foreign_keys:
            if self.check_table_accepts_data_recursive(row, table_cls.metadata.foreign_keys[foreign_key].reference_table):
                return True
        return False

    # Check if table already contains the relevant data in the row
    @staticmethod
    def check_table_contains_data(row: Row, table_name: str):
        return False

    # For when tables have foreign keys to other tables that should have data filled
    def add_row_to_table_recursive(self, row: Row, table_name: str):
        table_cls = self.db_model.get_table_class(table_name)
        row_for_curr_table = row.copy()

        for foreign_key in table_cls.metadata.foreign_keys:
            foreign_table_name = table_cls.metadata.foreign_keys[foreign_key].reference_table
            if not self.check_table_contains_data(row, foreign_table_name) and \
                    self.check_table_accepts_data_recursive(row, foreign_table_name):
                entry_id = self.add_row_to_table_recursive(row, foreign_table_name)
                row_for_curr_table[foreign_key] = entry_id
        return self.add_row_to_table(row_for_curr_table, table_name)

    def get_results(self):
        pass

    def get_categories(self):
        pass

    def get_category_fields(self):
        pass
