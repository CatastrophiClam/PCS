from dataclasses import dataclass

from server.model.repository import TableMetadata, ForeignKey

"""
Every table should contain 'id' as a primary key
Fields not provided to us in data are id, hash and metadata
"""

EXCLUDE_FROM_HASH_FIELDS = {'id', 'hash', 'metadata'}

@dataclass
class Chassis:
    id: str
    value: str
    metadata: TableMetadata = TableMetadata("chassis")

@dataclass
class Testbed:
    id: str
    platform: str
    metadata: TableMetadata = TableMetadata("testbed")

@dataclass
class Project:
    id: str
    value: str
    metadata: TableMetadata = TableMetadata("project")

@dataclass
class ImageAlias:
    id: str
    hash: str
    alias: str
    release: str
    version: str
    efr: str
    sdk: str
    smu: str
    metadata: TableMetadata = TableMetadata("image_alias")

@dataclass
class Results:
    id: str
    project_id: str
    image_alias_id: str
    testbed_id: str
    chassis_id: str
    metadata: TableMetadata = TableMetadata(
        "results",
        foreign_keys={
            'project_id': ForeignKey(Project.metadata.name, Project.metadata.primary_key),
            'image_alias_id': ForeignKey(ImageAlias.metadata.name, ImageAlias.metadata.primary_key),
            'testbed_id': ForeignKey(Testbed.metadata.name, Testbed.metadata.primary_key),
            'chassis_id': ForeignKey(Chassis.metadata.name, Chassis.metadata.primary_key),
        }
    )

# Not a table in db - this keeps track of all our table models
# Note: variable names here MUST match table names
@dataclass
class Tables:
    results: Results
    project: Project
    image_alias: ImageAlias
    testbed: Testbed
    chassis: Chassis
