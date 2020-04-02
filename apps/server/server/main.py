from flask import Flask, request
import requests

from server.model.repository import Column, Table
from server.repository.repository import Repository
from server.model.server import Context
from server.repository.db_init import get_postgres_connection, fit_db_to_model

app = Flask(__name__)

context: Context = Context()
context.db_connection = get_postgres_connection()
context.repository = Repository(context.db_connection)
fit_db_to_model(context.repository)

@app.route('/')
def hello_world():
    return 'Hello Flask!!'

@app.route('/data/in')
def data_in():
    qs = request.query_string
    js = request.json
    print(qs)
    return "Nice"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
