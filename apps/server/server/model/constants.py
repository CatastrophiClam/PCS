from server.model.projects.convergence import Testbed, Topology, Tester, Image, TestCase

EXCLUDE_FROM_HASH_FIELDS = {'id', 'hash', 'metadata'}
EXCLUDE_FROM_COLUMN_FIELDS = {'metadata'}
EXCLUDE_FROM_CATEGORY_FIELDS = {'router_configure', 'tgen_configure'}

# NOTE these names are the same as the groupNames variable on the frontend
# Any change in these names must also be reflected in the Utils/data.tsx colNameToGroupName constant in the frontend code
CONVERGENCE_CATEGORY_TABLES = {Testbed.metadata.name: "Testbed", Topology.metadata.name: "Topology",
                               Tester.metadata.name: "Tester", Image.metadata.name: "Image",
                               TestCase.metadata.name: "Test Case"}
