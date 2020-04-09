from flask import Flask, request, jsonify
from server.model.projects.convergence import Results as Convergence_Results
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

@app.route('/data/convergence', methods=['POST'])
def data_in():
    row = request.json
    if context.repository.check_table_accepts_data_recursive(row, Convergence_Results.metadata.name):
        context.repository.add_row_to_table_recursive(row, Convergence_Results.metadata.name)
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
