from flask import Flask, request, jsonify
import requests
from server.model.database import Results
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

@app.route('/data/in', methods=['POST'])
def data_in():
    row = request.json
    if context.repository.check_table_accepts_data_recursive(row, Results.metadata.name):
        context.repository.add_row_to_table_recursive(row, Results.metadata.name)
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
