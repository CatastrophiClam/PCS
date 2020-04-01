import psycopg2

from server.model.database import Tables
from server.model.repository import Column, Table, TableMetadata
from server.repository.repository import Repository


def get_postgres_connection():
    connection = None
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="testpass",
                                      host="0.0.0.0",
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
        return "numeric"
    return None

# Convert a model to a table
def convert_model_to_struct(name: str, cls):
    columns = []
    for key in cls.__annotations__:
        t = get_db_type_from_type(cls.__annotations__[key])
        if t is not None:
            columns.append(Column(key, t, key in cls.metadata.primary_keys, key in cls.metadata.nullable_fields))
        elif cls.__annotations__[key] is not TableMetadata and key in cls.metatdata.foreign_keys:
            columns.append(Column(key, "VARCHAR", foreign_key=cls.metadata.foreign_keys[key]))
    return Table(name, columns)

# Fit schema of db to our db model
def fit_db_to_model(repo: Repository):
    tables = repo.get_tables()
    for key in Tables.__annotations__:
        if key not in tables:
            cls = Tables.__annotations__[key]
            table = convert_model_to_struct(key, cls)
            repo.add_table(table)
