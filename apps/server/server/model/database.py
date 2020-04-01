from dataclasses import dataclass

from server.model.repository import TableMetadata


@dataclass
class Project:
    id: str
    value: str
    metadata: TableMetadata = TableMetadata({'id'}, set())

@dataclass
class ImageAlias:
    id: str
    value: str
    metadata: TableMetadata = TableMetadata({'id'}, set())

@dataclass
class ImageRelease:
    id: str
    value: str
    metadata: TableMetadata = TableMetadata({'id'}, set())

@dataclass
class Results:
    id: str
    project: str
    image_alias: str
    image_release: str
    metadata: TableMetadata = TableMetadata({'id'}, set())

# Not a table in db - this keeps track of all our table models
@dataclass
class Tables:
    results: Results
    project: Project
    image_alias: ImageAlias
    image_release: ImageRelease

