from dataclasses import dataclass

from server.model.base_model_table import BaseModelTable
from server.model.repository import TableMetadata, ForeignKey

"""
Every table should contain 'id' as a primary key
Fields not provided to us in data are id, hash and metadata
"""

@dataclass
class Chassis(BaseModelTable):
    value: str = None
    metadata: TableMetadata = TableMetadata("con_chassis")

@dataclass
class Testbed(BaseModelTable):
    platform: str = None
    metadata: TableMetadata = TableMetadata("con_testbed")

@dataclass
class Project(BaseModelTable):
    value: str = None
    metadata: TableMetadata = TableMetadata("con_project")

@dataclass
class ImageAlias(BaseModelTable):
    alias: str = None
    release: str = None
    version: str = None
    efr: str = None
    sdk: str = None
    smu: str = None
    metadata: TableMetadata = TableMetadata("con_image_alias")

@dataclass
class TestCase(BaseModelTable):
    script_name: str = None
    report_name: str = None
    category: str = None
    trigger: str = None
    scale: str = None
    router_configfile: str = None
    tgen_configfile: str = None
    status: str = None
    metadata: TableMetadata = TableMetadata("con_test_case")

@dataclass
class Results(BaseModelTable):
    project_id: str = None
    image_alias_id: str = None
    testbed_id: str = None
    chassis_id: str = None
    testcase_id: str = None
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

