from flask import Flask, request, jsonify, make_response, Response
from server.model.projects.convergence import Results as Convergence_Results
from server.model.query_syntax import WhereClause, Statement, Comp, Value
from server.repository.database import Database as Repo_Database
from server.model.database import Database as Struct_Database
from server.repository.repository import Repository
from server.model.server import Context
from server.repository.db_init import fit_db_to_model

app = Flask(__name__)

context: Context = Context()
context.database_model = Struct_Database()
context.repository = Repository(Repo_Database(), context.database_model)
fit_db_to_model(context)

@app.route('/')
def hello_world():
    return 'Hello Flask!!'

@app.route('/data', methods=['GET'])
def data_out():
    whereClause = WhereClause(Statement)
    data = context.repository.get_data_for_table("conv_results", ["*"], None)
    return _corsify_actual_response(jsonify([d.to_json() for d in data]))

@app.route('/data/convergence', methods=['POST'])
def data_in():
    data = request.json
    for row in data:
        if context.repository.check_table_accepts_data_recursive(row, Convergence_Results.metadata.name):
            context.repository.add_row_to_table_recursive(row, Convergence_Results.metadata.name)
    return jsonify(success=True)

def _build_cors_prelight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
