export interface Conv_TestBed {
  testbed_name: string;
  platform: string;
  chassis: string;
  rp?: string;
  lc?: string;
  interface?: string;
  [propName: string]: any;
}

export interface Conv_Topology {
  topology: string;
  [propName: string]: any;
}

export interface Conv_Tester {
  tester: string;
  [propName: string]: any;
}

export interface Conv_Image {
  alias: string;
  release?: string;
  version?: string;
  efr?: string;
  sdk?: string;
  smu?: string;
  [propName: string]: any;
}

export interface Conv_TestCase {
  script_name: string;
  report_name?: string;
  category?: string;
  trigger?: string;
  scale?: string;
  router_configure?: string;
  tgen_configure?: string;
  [propName: string]: any;
}

export interface Conv_Results {
  image_id: Conv_Image;
  testbed_id: Conv_TestBed;
  topology_id: Conv_Topology;
  testcase_id: Conv_TestCase;
  tester_id: Conv_Tester;
  fib_slope?: string;
  fib_slope_unit?: string;
  fib_slope_stddev?: string;
  prefix_sec?: string;
  max_delay?: string;
  max_delay_unit?: string;
  max_delay_stddev?: string;
  initial_delay?: string;
  initial_delay_unit?: string;
  initial_delay_stddev?: string;
  rib_initial_delay?: string;
  rib_initial_delay_unit?: string;
  rib_initial_delay_stddev?: string;
  rib_slope?: string;
  rib_slope_unit?: string;
  rib_slope_stddev?: string;
  detail_result?: string;
  cpu_usage_lc_egress_fib_mgr?: string;
  cpu_usage_lc_egress_fib_mgr_stddev?: string;
  cpu_usage_lc_egress_fib_mgr_unit?: string;
  cpu_usage_lc_ingress_fib_mgr?: string;
  cpu_usage_lc_ingress_fib_mgr_unit?: string;
  cpu_usage_lc_ingress_fib_mgr_stddev?: string;
  cpu_usage_rp_bgp?: string;
  cpu_usage_rp_bgp_unit?: string;
  cpu_usage_rp_bgp_stddev?: string;
  cpu_usage_rp_fib_mgr?: string;
  cpu_usage_rp_fib_mgr_stddev?: string;
  cpu_usage_rp_fib_mgr_unit?: string;
  cpu_usage_rp_igmp?: string;
  cpu_usage_rp_igmp_stddev?: string;
  cpu_usage_rp_igmp_unit?: string;
  cpu_usage_rp_ipv4_rib?: string;
  cpu_usage_rp_ipv4_rib_unit?: string;
  cpu_usage_rp_ipv4_rib_stddev?: string;
  cpu_usage_rp_ipv6_rib?: string;
  cpu_usage_rp_ipv6_rib_unit?: string;
  cpu_usage_rp_ipv6_rib_stddev?: string;
  cpu_usage_rp_isis?: string;
  cpu_usage_rp_isis_unit?: string;
  cpu_usage_rp_isis_stddev?: string;
  cpu_usage_rp_mpls_ldp?: string;
  cpu_usage_rp_mpls_ldp_unit?: string;
  cpu_usage_rp_mpls_ldp_stddev?: string;
  cpu_usage_rp_mpls_lsd?: string;
  cpu_usage_rp_mpls_lsd_unit?: string;
  cpu_usage_rp_mpls_lsd_stddev?: string;
  cpu_usage_rp_mrib?: string;
  cpu_usage_rp_mrib_unit?: string;
  cpu_usage_rp_mrib_stddev?: string;
  cpu_usage_rp_ospf_unit?: string;
  cpu_usage_rp_ospf?: string;
  cpu_usage_rp_ospf_stddev?: string;
  cpu_usage_rp_pim?: string;
  cpu_usage_rp_pim_unit?: string;
  cpu_usage_rp_pim_stddev?: string;
  [propName: string]: any;
}
