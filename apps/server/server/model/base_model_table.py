from dataclasses import dataclass
import json

from server.model.repository import TableMetadata


class JSONable:
    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)

@dataclass
class BaseModelTable(JSONable):
    id: str = None
    hash: str = None
    metadata: TableMetadata = None
