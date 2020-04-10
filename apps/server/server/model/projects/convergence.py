from dataclasses import dataclass

from server.model.repository import TableMetadata, ForeignKey

"""
Every table should contain 'id' as a primary key
Fields not provided to us in data are id, hash and metadata
"""

@dataclass
class Chassis:
    id: str
    value: str
    metadata: TableMetadata = TableMetadata("con_chassis")

@dataclass
class Testbed:
    id: str
    platform: str
    metadata: TableMetadata = TableMetadata("con_testbed")

@dataclass
class Project:
    id: str
    value: str
    metadata: TableMetadata = TableMetadata("con_project")

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
    metadata: TableMetadata = TableMetadata("con_image_alias")

@dataclass
class TestCase:
    id: str
    script_name: str
    report_name: str
    category: str
    trigger: str
    scale: str
    router_configfile: str
    tgen_configfile: str
    status: str
    metadata: TableMetadata = TableMetadata("con_test_case")

@dataclass
class Results:
    id: str
    project_id: str
    image_alias_id: str
    testbed_id: str
    chassis_id: str
    testcase_id: str
    metadata: TableMetadata = TableMetadata(
        "con_results",
        foreign_keys={
            'project_id': ForeignKey(Project.metadata.name, Project.metadata.primary_key),
            'image_alias_id': ForeignKey(ImageAlias.metadata.name, ImageAlias.metadata.primary_key),
            'testbed_id': ForeignKey(Testbed.metadata.name, Testbed.metadata.primary_key),
            'chassis_id': ForeignKey(Chassis.metadata.name, Chassis.metadata.primary_key),
            'testcase_id': ForeignKey(TestCase.metadata.name, TestCase.metadata.primary_key)
        }
    )

