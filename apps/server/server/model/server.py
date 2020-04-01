from dataclasses import dataclass

from server.repository.repository import Repository


@dataclass
class Context:
    db_connection = None
    repository: Repository = None
