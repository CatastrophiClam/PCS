from dataclasses import dataclass
import json
from decimal import Decimal

from server.model.repository import TableMetadata


def process(o):
    print(o)
    print(type(o))
    return float(o) if type(o) is Decimal or type(o) is float else o.__dict__

class JSONable:
    def to_json(self):
        return json.dumps(self, default=process, sort_keys=True, indent=4)

@dataclass
class BaseModelTable(JSONable):
    id: str = None
    hash: str = None
    metadata: TableMetadata = None
