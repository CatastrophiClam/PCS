from server.model.repository import Table, Column, Row


class Repository:

    def __init__(self, connection):
        self.connection = connection

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
        pass
