from dataclasses import dataclass, field
from typing import List, Dict, Set

TableName = str
FieldName = str

@dataclass(frozen=True)
class ForeignKey:
    reference_table: TableName
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

@dataclass(frozen=True)
class TableMetadata:
    name: TableName
    primary_key: str = "id"
    non_nullable_fields: Set[str] = field(default_factory=set)
    foreign_keys: Dict[FieldName, ForeignKey] = field(default_factory=dict)

Row = Dict[str, str]
