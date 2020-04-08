import psycopg2

from server.model.database import Tables
from server.model.repository import Column, Table, TableMetadata
from server.repository.repository import Repository


def get_postgres_connection():
    connection = None
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="testpass",
                                      host="localhost",
                                      port="5431"
                                      )
        return connection

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
        if connection is not None:
            connection.close()

def get_db_type_from_type(obj):
    if obj is int:
        return "INTEGER"
    if obj is str:
        return "VARCHAR"
    if obj is float:
        return "NUMERIC"
    return None

# Convert a model to a table
def convert_model_to_struct(name: str, cls):
    columns = []
    for key in cls.__annotations__:
        t = get_db_type_from_type(cls.__annotations__[key])
        if key in cls.metadata.foreign_keys:
            columns.append(Column(key, "VARCHAR", foreign_key=cls.metadata.foreign_keys[key]))
        elif t is not None:
            columns.append(Column(key, t, key == cls.metadata.primary_key,
                                  key not in cls.metadata.non_nullable_fields and key != cls.metadata.primary_key))
        elif cls.__annotations__[key] is not TableMetadata:
            print("Found unrecognized field: %s" % cls.__annotations__[key])
    return Table(name, columns)

def create_model_class_as_table_in_db(class_name: str, repo: Repository):
    tables = repo.get_tables()
    table_names = [t for t in tables.keys()]
    if class_name not in table_names:
        cls = Tables.__annotations__[class_name]
        for key in cls.metadata.foreign_keys:
            table_names = [t for t in repo.get_tables().keys()]
            if cls.metadata.foreign_keys[key].reference_table not in table_names:
                create_model_class_as_table_in_db(cls.metadata.foreign_keys[key].reference_table, repo)
        table = convert_model_to_struct(class_name, cls)
        repo.add_table(table)
    else:
        db_table: Table = tables[class_name]
        program_table: Table = convert_model_to_struct(class_name, Tables.__annotations__[class_name])
        for column in db_table.columns:
            if column.name not in [i.name for i in program_table.columns]:
                repo.remove_col(class_name, column.name)
        for column in program_table.columns:
            if column.name not in [i.name for i in db_table.columns]:
                repo.add_col(column, class_name)

# Fit schema of db to our db model
def fit_db_to_model(repo: Repository):
    for key in Tables.__annotations__:
        create_model_class_as_table_in_db(key, repo)
    db_tables = repo.get_tables().keys()
    for table_name in db_tables:
        if table_name not in Tables.__annotations__:
            repo.remove_table(table_name)
