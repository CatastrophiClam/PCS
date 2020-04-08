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
            columns.append(Column(key, t, key == cls.metadata.primary_key, key not in cls.metadata.non_nullable_fields))
        elif cls.__annotations__[key] is not TableMetadata:
            print("Found unrecognized field: %s" % cls.__annotations__[key])
    return Table(name, columns)

def create_model_class_as_table_in_db(class_name: str, repo: Repository):
    tables = repo.get_tables()
    print(tables)
    table_names = [t.name for t in tables]
    if class_name not in table_names:
        cls = Tables.__annotations__[class_name]
        for key in cls.metadata.foreign_keys:
            table_names = [t.name for t in repo.get_tables()]
            if cls.metadata.foreign_keys[key].reference_table not in table_names:
                create_model_class_as_table_in_db(cls.metadata.foreign_keys[key].reference_table, repo)
        table = convert_model_to_struct(class_name, cls)
        repo.add_table(table)

# Fit schema of db to our db model
def fit_db_to_model(repo: Repository):
    print("Updating db to match model")
    for key in Tables.__annotations__:
        create_model_class_as_table_in_db(key, repo)

