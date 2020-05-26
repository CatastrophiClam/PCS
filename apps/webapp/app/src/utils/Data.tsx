import { Conv_Results, Categories } from "../types/Data";
import { Defaults } from "../types/Models";

export const isFieldResultField = (fieldName: string, data: any) => {
  return data == null || typeof data !== "object";
};

const categoriesToHash = [
  (result: Conv_Results) => result.image_id.alias,
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

const colNameToGroupName: { [colName: string]: string } = {
  testbed_name: "Testbed",
  platform: "Testbed",
  chassis: "Testbed",
  rp: "Testbed",
  lc: "Testbed",
  interface: "Testbed",
  topology: "Topology",
  tester: "Tester",
  alias: "Image",
  release: "Image",
  version: "Image",
  efr: "Image",
  sdk: "Image",
  smu: "Image",
  script_name: "Test Case",
  report_name: "Test Case",
  category: "Test Case",
  trigger: "Test Case",
  scale: "Test Case",
  router_configure: "Test Case",
  tgen_configure: "Test Case",
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

export const getDefaultsFromLinkParams = (link: string): Defaults => {
  let defaults: Defaults = {
    columns: [],
    tableCategories: [],
    dataLabels: [],
    sortTestcasesCategory: "",
    filters: [],
  };

  const split = link.split("&");
  const dict = split.reduce((acc: { [key: string]: string }, exp) => {
    const pair = exp.split("=");
    acc[pair[0]] = pair[1];
    return acc;
  }, {});

  if (dict.columns && dict.columns !== "") {
    defaults.columns = dict.columns.split(",");
  }
  if (dict.tableCategories && dict.tableCategories !== "") {
    defaults.tableCategories = dict.tableCategories.split(",");
  }
  if (dict.dataLabels && dict.dataLabels !== "") {
    defaults.dataLabels = dict.dataLabels.split(",");
  }
  if (dict.sortTestcasesCategory && dict.sortTestcasesCategory !== "") {
    defaults.sortTestcasesCategory = dict.sortTestcasesCategory;
  }
  if (dict.filters && dict.filters !== "") {
    const filters = dict.filters.split(";"); // filters separated by ";"
    defaults.filters = filters.map((filterString) => {
      let filter: Categories = {};
      const categoriesWithOptions = filterString.split("|");
      categoriesWithOptions.forEach((categoryWithOptions) => {
        const [category, optionsString] = categoryWithOptions.split("!");
        const options = optionsString.split(",");
        const groupName = colNameToGroupName[category];
        if (!filter[groupName]) {
          filter[groupName] = {};
        }
        filter[groupName][category] = options;
      });
      return filter;
    });
  }
  return defaults;
};

export const getLinkParamsFromState = (
  columns: Array<string>,
  tableCategories: Array<string>,
  dataLabels: Array<string>,
  sortTestcasesCategory: string,
  filters: Array<Categories>
): string => {
  let link = `columns=${columns.reduce((acc, curr, ind) => {
    if (ind != 0) {
      acc = `${acc},`;
    }
    acc = `${acc}${curr}`;
    return acc;
  }, "")}`;
  link = `${link}&tableCategories=${tableCategories.reduce((acc, curr, ind) => {
    if (ind != 0) {
      acc = `${acc},`;
    }
    acc = `${acc}${curr}`;
    return acc;
  }, "")}`;
  link = `${link}&dataLabels=${dataLabels.reduce((acc, curr, ind) => {
    if (ind != 0) {
      acc = `${acc},`;
    }
    acc = `${acc}${curr}`;
    return acc;
  }, "")}`;
  link = `${link}&sortTestcasesCategory=${sortTestcasesCategory}`;
  link = `${link}&filters=${filters.reduce((acc, categories, ind) => {
    const filterString = Object.keys(categories).reduce(
      (acc1, groupName, ind1) => {
        return `${acc1}${Object.keys(categories[groupName]).reduce(
          (acc2, categoryName, ind2) => {
            if (ind1 != 0 || ind2 != 0) {
              acc2 = `${acc2}|`;
            }
            return `${acc2}${categoryName}!${categories[groupName][
              categoryName
            ].reduce((acc3, field, ind3) => {
              if (ind3 != 0) {
                acc3 = `${acc3},`;
              }
              return `${acc3}${field}`;
            }, "")}`;
          },
          ""
        )}`;
      },
      ""
    );
    if (ind != 0) {
      acc = `${acc};`;
    }
    return `${acc}${filterString}`;
  }, "")}`;
  return link;
};
