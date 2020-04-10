import psycopg2

class Database:

    def __init__(self, password: str = "testpass", user: str = "postgres", host: str = "localhost", port: str = "5431"):
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.connection = self.get_postgres_connection()

    def get_postgres_connection(self):
        connection = None
        try:
            connection = psycopg2.connect(user=self.user,
                                          password=self.password,
                                          host=self.host,
                                          port=self.port
                                          )
            return connection

        except (Exception, psycopg2.Error) as error:
            print("Error while connecting to PostgreSQL", error)
            if connection is not None:
                connection.close()

    def execute(self, mutation: str):
        cursor = self.connection.cursor()
        cursor.execute(mutation)
        self.connection.commit()
        cursor.close()

    def fetch(self, query: str):
        cursor = self.connection.cursor()
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        self.connection.commit()
        return data
