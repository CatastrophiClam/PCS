from uuid import uuid1

from server.model.database import Tables, EXCLUDE_FROM_HASH_FIELDS
from server.model.repository import Table, Column, Row
from server.repository.results import ResultsRepo


class Repository:

    def __init__(self, connection):
        self.connection = connection
        self.results = ResultsRepo(self)

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
        cursor = self.connection.cursor()
        cursor.execute(s)
        cursor.close()
        self.connection.commit()

    def get_tables(self):
        s = "SELECT * FROM information_schema.tables WHERE table_schema = 'public'"
        cursor = self.connection.cursor()
        cursor.execute(s)
        tables = [res[2] for res in cursor.fetchall()]
        cursor.close()
        return tables

    def add_col_to_table(self, column: Column, table_name: str):
        pass

    def add_row_to_table(self, row: Row, table_name: str):
        row_id = str(uuid1())
        cols = "id"
        vals = "'" + row_id + "'"
        if 'hash' in Tables.__annotations__[table_name].__annotations__:
            cols += ", hash"
            vals += ", '{0}'".format(self.hash_fields_for_table(row, table_name))

        for key in row:
            if key in Tables.__annotations__[table_name].__annotations__:
                cols += (", " + key)
                val_to_insert = row[key]
                if Tables.__annotations__[table_name].__annotations__[key] is str:
                    val_to_insert = "'" + val_to_insert + "'"
                vals += (", " + val_to_insert)
        s = "INSERT INTO {0} ({1}) VALUES ({2})".format(table_name, cols, vals)
        cursor = self.connection.cursor()
        cursor.execute(s)
        cursor.close()
        self.connection.commit()
        return row_id

    @staticmethod
    def hash_fields_for_table(fields: Row, table_name: str):
        return hash(str([key + fields[key] for key in fields if key not in EXCLUDE_FROM_HASH_FIELDS and
                         key in Tables.__annotations__[table_name].__annotations__].sort()))

    # Check if the row contains any data that can be put into the table
    def check_table_accepts_data_recursive(self, row: Row, table_name: str):
        # If the table contains a field that the row provides, then return true
        table_cls = Tables.__annotations__[table_name]
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
        table_cls = Tables.__annotations__[table_name]
        row_for_curr_table = row.copy()

        for foreign_key in table_cls.metadata.foreign_keys:
            foreign_table_name = table_cls.metadata.foreign_keys[foreign_key].reference_table
            if not self.check_table_contains_data(row, foreign_table_name) and \
                    self.check_table_accepts_data_recursive(row, foreign_table_name):
                entry_id = self.add_row_to_table_recursive(row, foreign_table_name)
                row_for_curr_table[foreign_key] = entry_id
        return self.add_row_to_table(row_for_curr_table, table_name)
