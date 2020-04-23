from dataclasses import dataclass

from server.model.repository import TableMetadata


@dataclass
class BaseModelTable:
    id: str = None
    hash: str = None
    metadata: TableMetadata = None
