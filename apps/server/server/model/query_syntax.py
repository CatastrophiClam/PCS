from dataclasses import dataclass
from enum import IntEnum
from typing import List, Union


class Comp(IntEnum):
    EQ = 0
    NEQ = 1
    IN = 2

    def __str__(self):
        return ["=", "!=", "IN"][self.value]

class LogOp(IntEnum):
    AND = 0
    NOT = 1
    OR = 2

    def __str__(self):
        return ["AND", "NOT", "OR"][self.value]

@dataclass
class Value:
    value: Union[str, List[str]]

    def __str__(self):
        s: str
        if type(self.value) is list:
            s = "("
            for i in range(len(self.value)):
                if i != 0:
                    s += ", "
                s += "'{0}'".format(self.value[i])
            s += ")"
        else:
            s = "'{0}'".format(self.value)
        return s

@dataclass
class Statement:
    variable: str
    comp: Comp
    value: Value

    def __str__(self):
        return "{0} {1} {2}".format(self.variable, str(self.comp), str(self.value))

@dataclass
class Clause:
    clause: List[Union[Statement, LogOp]]

    def __str__(self):
        s = "("
        for i in range(len(self.clause)):
            if i > 0:
                s += " "
            s += str(self.clause[i])
        s += ")"
        return s

@dataclass
class WhereClause:
    clause: List[Union[Clause, LogOp]]  # Alternate between statements and logOps

    def __str__(self):
        s = ""
        for i in range(len(self.clause)):
            if i > 0:
                s += " "
            s += str(self.clause[i])
        return s
