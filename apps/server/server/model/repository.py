from dataclasses import dataclass
from typing import List, Dict, Set

@dataclass
class ForeignKey:
    reference_table: str
    reference_col: str

@dataclass
class Column:
    name: str
    type: str
    is_primary_key: bool = False
    nullable: bool = False
    foreign_key: ForeignKey = None

@dataclass
class Table:
    name: str
    columns: List[Column]

@dataclass
class TableMetadata:
    primary_keys: Set[str]
    nullable_fields: Set[str]
    foreign_keys: Dict[str, ForeignKey] = None

Row = Dict[str, str]
