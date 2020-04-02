from typing import TYPE_CHECKING

from server.model.database import Results
from server.model.repository import Row
if TYPE_CHECKING:
    from server.repository.repository import Repository


class ResultsRepo:

    def __init__(self, repo: 'Repository'):
        self.repo = repo

    def add_row(self, row: Row):
        self.repo.add_row_to_table(row, Results.metadata.name)
