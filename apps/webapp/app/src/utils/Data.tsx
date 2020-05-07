import { Conv_Results } from "../types/Data";

export const isFieldResultField = (fieldName: string, data: any) => {
  return data == null || typeof data !== "object";
};

const categoriesToHash = [
  (result: Conv_Results) => result.image_id.alias,
  (result: Conv_Results) => result.testcase_id.scale,
  (result: Conv_Results) => result.testcase_id.trigger,
  (result: Conv_Results) => result.testbed_id.chassis,
  (result: Conv_Results) => result.testbed_id.interface,
  (result: Conv_Results) => result.testbed_id.lc,
  (result: Conv_Results) => result.testbed_id.platform,
  (result: Conv_Results) => result.testbed_id.rp,
  (result: Conv_Results) => result.testbed_id.testbed_name,
];

export const hashResultRowByCategory = (result: Conv_Results) => {
  return categoriesToHash.reduce((acc, curr) => {
    return `${acc}${curr(result)}`;
  }, "");
};

const colNameToField: { [colName: string]: Function } = {
  testbed_name: (result: Conv_Results) => result.testbed_id.testbed_name,
  platform: (result: Conv_Results) => result.testbed_id.platform,
  chassis: (result: Conv_Results) => result.testbed_id.chassis,
  rp: (result: Conv_Results) => result.testbed_id.rp,
  lc: (result: Conv_Results) => result.testbed_id.lc,
  interface: (result: Conv_Results) => result.testbed_id.interface,
  topology: (result: Conv_Results) => result.topology_id.topology,
  tester: (result: Conv_Results) => result.tester_id.tester,
  alias: (result: Conv_Results) => result.image_id.alias,
  release: (result: Conv_Results) => result.image_id.release,
  version: (result: Conv_Results) => result.image_id.version,
  efr: (result: Conv_Results) => result.image_id.efr,
  sdk: (result: Conv_Results) => result.image_id.sdk,
  smu: (result: Conv_Results) => result.image_id.smu,
  script_name: (result: Conv_Results) => result.testcase_id.script_name,
  report_name: (result: Conv_Results) => result.testcase_id.report_name,
  category: (result: Conv_Results) => result.testcase_id.category,
  trigger: (result: Conv_Results) => result.testcase_id.trigger,
  scale: (result: Conv_Results) => result.testcase_id.scale,
  router_configure: (result: Conv_Results) =>
    result.testcase_id.router_configure,
  tgen_configure: (result: Conv_Results) => result.testcase_id.tgen_configure,
};

export const getColFromResult = (colName: string, result: Conv_Results) => {
  if (colNameToField[colName]) {
    return colNameToField[colName](result);
  }
  return result[colName];
};
