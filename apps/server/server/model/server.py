from dataclasses import dataclass

from server.model.database import Database
from server.repository.repository import Repository


@dataclass
class Context:
    repository: Repository = None
    database_model: Database = None
