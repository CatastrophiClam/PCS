from dataclasses import dataclass

from server.model.base_model_table import BaseModelTable
from server.model.repository import TableMetadata, ForeignKey

"""
Fields not provided to us in data are id, hash and metadata
"""

@dataclass
class Image(BaseModelTable):
    alias: str = None
    release: str = None
    version: str = None
    efr: str = None
    sdk: str = None
    smu: str = None
    metadata: TableMetadata = TableMetadata("conv_image", {"alias", "release", "version"})

@dataclass
class Testbed(BaseModelTable):
    testbed_name: str = None
    platform: str = None
    chassis: str = None
    rp: str = None
    lc: str = None
    interface: str = None
    metadata: TableMetadata = TableMetadata("conv_testbed", {"testbed_name", "platform", "chassis", "rp", "lc", "interface"})

@dataclass
class Topology(BaseModelTable):
    topology: str = None
    metadata: TableMetadata = TableMetadata("conv_topology", {"topology"})

@dataclass
class Tester(BaseModelTable):
    tester: str = None
    metadata: TableMetadata = TableMetadata("conv_tester", {"tester"})

@dataclass
class TestCase(BaseModelTable):
    script_name: str = None
    report_name: str = None
    category: str = None
    trigger: str = None
    scale: str = None
    router_configure: str = None
    tgen_configure: str = None
    metadata: TableMetadata = TableMetadata("conv_test_case", {"script_name", "category", "trigger", "scale"})

@dataclass
class Results(BaseModelTable):
    image_id: str = None
    testbed_id: str = None
    topology_id: str = None
    testcase_id: str = None
    tester_id: str = None
    prefix_sec: int = None
    prefix_sec_stddev_percent: float = None
    detail_result: str = None
    DDTS: str = None
    fib_slope: float = None
    fib_slope_unit: str = None
    fib_slope_stddev: float = None
    fib_slope_stddev_percent: float = None
    max_delay: float = None
    max_delay_unit: str = None
    max_delay_stddev: float = None
    max_delay_stddev_percent: float = None
    initial_delay: float = None
    initial_delay_unit: str = None
    initial_delay_stddev: float = None
    initial_delay_stddev_percent: float = None
    rib_initial_delay: float = None
    rib_initial_delay_unit: str = None
    rib_initial_delay_stddev: float = None
    rib_initial_delay_stddev_percent: float = None
    rib_slope: float = None
    rib_slope_unit: str = None
    rib_slope_stddev: float = None
    rib_slope_stddev_percent: float = None
    cpu_usage_rp_pim: float = None
    cpu_usage_rp_pim_unit: str = None
    cpu_usage_rp_pim_stddev: float = None
    cpu_usage_rp_pim_stddev_percent: float = None
    cpu_usage_lc_egress_fib_mgr: float = None
    cpu_usage_lc_egress_fib_mgr_unit: str = None
    cpu_usage_lc_egress_fib_mgr_stddev: float = None
    cpu_usage_lc_egress_fib_mgr_stddev_percent: float = None
    cpu_usage_lc_ingress_fib_mgr: float = None
    cpu_usage_lc_ingress_fib_mgr_unit: str = None
    cpu_usage_lc_ingress_fib_mgr_stddev: float = None
    cpu_usage_lc_ingress_fib_mgr_stddev_percent: float = None
    cpu_usage_rp_bgp: float = None
    cpu_usage_rp_bgp_unit: str = None
    cpu_usage_rp_bgp_stddev: float = None
    cpu_usage_rp_bgp_stddev_percent: float = None
    cpu_usage_rp_fib_mgr: float = None
    cpu_usage_rp_fib_mgr_unit: str = None
    cpu_usage_rp_fib_mgr_stddev: float = None
    cpu_usage_rp_fib_mgr_stddev_percent: float = None
    cpu_usage_rp_igmp: float = None
    cpu_usage_rp_igmp_unit: str = None
    cpu_usage_rp_igmp_stddev: float = None
    cpu_usage_rp_igmp_stddev_percent: float = None
    cpu_usage_rp_ipv4_rib: float = None
    cpu_usage_rp_ipv4_rib_unit: str = None
    cpu_usage_rp_ipv4_rib_stddev: float = None
    cpu_usage_rp_ipv4_rib_stddev_percent: float = None
    cpu_usage_rp_ipv6_rib: float = None
    cpu_usage_rp_ipv6_rib_unit: str = None
    cpu_usage_rp_ipv6_rib_stddev: float = None
    cpu_usage_rp_ipv6_rib_stddev_percent: float = None
    cpu_usage_rp_isis: float = None
    cpu_usage_rp_isis_unit: str = None
    cpu_usage_rp_isis_stddev: float = None
    cpu_usage_rp_isis_stddev_percent: float = None
    cpu_usage_rp_mpls_ldp: float = None
    cpu_usage_rp_mpls_ldp_unit: str = None
    cpu_usage_rp_mpls_ldp_stddev: float = None
    cpu_usage_rp_mpls_ldp_stddev_percent: float = None
    cpu_usage_rp_mpls_lsd: float = None
    cpu_usage_rp_mpls_lsd_unit: str = None
    cpu_usage_rp_mpls_lsd_stddev: float = None
    cpu_usage_rp_mpls_lsd_stddev_percent: float = None
    cpu_usage_rp_mrib: float = None
    cpu_usage_rp_mrib_unit: str = None
    cpu_usage_rp_mrib_stddev: float = None
    cpu_usage_rp_mrib_stddev_percent: float = None
    cpu_usage_rp_ospf: float = None
    cpu_usage_rp_ospf_unit: str = None
    cpu_usage_rp_ospf_stddev: float = None
    cpu_usage_rp_ospf_stddev_percent: float = None
    metadata: TableMetadata = TableMetadata(
        "conv_results",
        foreign_keys={
            'topology_id': ForeignKey(Topology.metadata.name, Topology.metadata.primary_key),
            'image_id': ForeignKey(Image.metadata.name, Image.metadata.primary_key),
            'testbed_id': ForeignKey(Testbed.metadata.name, Testbed.metadata.primary_key),
            'tester_id': ForeignKey(Tester.metadata.name, Tester.metadata.primary_key),
            'testcase_id': ForeignKey(TestCase.metadata.name, TestCase.metadata.primary_key)
        }
    )

