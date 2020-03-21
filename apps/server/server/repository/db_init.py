import psycopg2


def get_postgres_connection():
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="testpass",
                                      host="localhost",
                                      port="5431"
                                      )

        cursor = connection.cursor()
        # Print PostgreSQL Connection properties
        print(connection.get_dsn_parameters(), "\n")

        # Print PostgreSQL version
        cursor.execute("SELECT version();")
        record = cursor.fetchone()
        print("You are connected to - ", record, "\n")
        return connection

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
        if (connection):
            cursor.close()
            connection.close()
