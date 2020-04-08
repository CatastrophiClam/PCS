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
    nullable: bool = True
    foreign_key: ForeignKey = None

    def __str__(self):
        pkey_str = " PKEY" if self.is_primary_key else ""
        nullable_str = " NULLABLE" if self.nullable else " NON NULLABLE"
        fkey_str = " FOREIGN KEY TO TABLE {0} COL {1}".format(
            self.foreign_key.reference_table, self.foreign_key.reference_col) if self.foreign_key is not None else ""
        return "{0}: {1}{2}{3}{4}".format(self.name, self.type, pkey_str, nullable_str, fkey_str)

    def __repr__(self):
        return self.__str__()

@dataclass
class Table:
    name: str
    columns: List[Column]

    def __str__(self):
        s = "TABLE {0}\n".format(self.name)
        for col in self.columns:
            s += "    {0}\n".format(str(col))
        s += "\n"
        return s

    def __repr__(self):
        return self.__str__()

@dataclass(frozen=True)
class TableMetadata:
    name: TableName
    primary_key: str = "id"
    non_nullable_fields: Set[str] = field(default_factory=set)
    foreign_keys: Dict[FieldName, ForeignKey] = field(default_factory=dict)

Row = Dict[str, str]
