from typing import Dict

from flask import Flask, request, jsonify, make_response, Response

from server.model.constants import CONVERGENCE_CATEGORY_TABLES, EXCLUDE_FROM_COLUMN_FIELDS, EXCLUDE_FROM_CATEGORY_FIELDS
from server.model.projects.convergence import Results as Convergence_Results
from server.model.query_syntax import WhereClause, Statement, Comp, Value, LogOp, Clause
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
    whereClause = build_where_clause_from_request_items(request.args.items())
    data = context.repository.get_data_for_table("conv_results", ["*"], whereClause)
    return _corsify_actual_response(jsonify([d.to_json() for d in data]))

@app.route('/categories', methods=['GET'])
def categories_out():
    whereClause = build_where_clause_from_request_items(request.args.items())

    columns = ["{0}.{1}".format(table_name, col) for table_name in CONVERGENCE_CATEGORY_TABLES
               for col in context.database_model.get_table_class(table_name).__annotations__
               if col not in EXCLUDE_FROM_COLUMN_FIELDS and col not in EXCLUDE_FROM_CATEGORY_FIELDS]
    data = context.repository.get_raw_data_for_table("conv_results", columns, whereClause)
    if len(data) == 0:
        return jsonify({})
    data_with_unique_options: Dict[str, set] = {col: set() for col in data[0]}
    for entry in data:
        for col in entry:
            if entry[col] is not None:
                data_with_unique_options[col].add(entry[col])

    output = {display_name: {col: list(data_with_unique_options["{0}.{1}".format(table_name, col)])
                             for col in context.database_model.get_table_class(table_name).__annotations__
                             if col not in EXCLUDE_FROM_COLUMN_FIELDS and col not in EXCLUDE_FROM_CATEGORY_FIELDS}
              for table_name, display_name in CONVERGENCE_CATEGORY_TABLES.items()}
    return _corsify_actual_response(jsonify(output))

@app.route('/data/convergence', methods=['POST', 'OPTIONS'])
def data_in():
    if request.method == "OPTIONS":
        return _build_cors_prelight_response()
    data = request.json
    for row in data:
        if context.repository.check_table_accepts_data_recursive(row, Convergence_Results.metadata.name):
            context.repository.add_row_to_table_recursive(row, Convergence_Results.metadata.name)
    return jsonify(success=True)

# Assume query contains any number of clauses as parameters, each clause has a bunch of key-value pairs separated by semicolons
# Values are a comma separated list of values
# Eg. c1=category=ABC,DEF;name=GHI,JKL&c2=....
def build_where_clause_from_request_items(items):
    clauseList = []
    for item in items:
        options = item[1].split(";")
        options_with_kv = [a.split("=") for a in options]
        statementList = []
        for o in options_with_kv:
            statementList.append(Statement(o[0], Comp.IN, Value(o[1].split(","))))
            statementList.append(LogOp.AND)
        statementList = statementList[:-1]
        clauseList.append(Clause(statementList))
        clauseList.append(LogOp.OR)
    clauseList = clauseList[:-1]
    return WhereClause(clauseList) if len(clauseList) > 0 else None

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
