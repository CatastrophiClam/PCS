import inspect
from typing import Dict
import server.model.projects
from server.model.base_model_table import BaseModelTable

TableList = Dict[str, BaseModelTable]

class Database:

    def __init__(self):
        self.projects: Dict[str, TableList] = {}  # Map projects to their tables
        self.tables: TableList = {}               # All tables from all projects in db

        # look through model/projects directory for classes
        for project_name, project_module in inspect.getmembers(server.model.projects, inspect.ismodule):
            self.projects[project_name] = {}
            for cname, cls in inspect.getmembers(project_module, inspect.isclass):
                if cls.__module__ == project_module.__name__:
                    table_name = cls.metadata.name
                    self.projects[project_name][table_name] = cls
                    self.tables[table_name] = cls

    def get_table_class(self, table_name: str) -> BaseModelTable:
        return self.tables[table_name] if table_name in self.tables else {}

    def get_project_tables(self, project_name: str) -> TableList:
        return self.projects[project_name] if project_name in self.projects else {}
