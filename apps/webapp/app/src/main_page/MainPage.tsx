import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { getData, getCategories, getDataCount } from "../utils/Api";
import Select from "react-select";
import {
  PageWrapper,
  ResultsWrapper,
  ResultsHeader,
  DropdownChooserWrapper,
  DropdownChooserText,
  TestCaseDetailsGraphWrapper,
  ResultsHeaderAndPageInfo,
  PageInfo,
  PageText,
} from "./styles/MainPage.jsx";
import TestCaseDetailsGraph from "./TestCaseDetailsGraph";
import TestCaseDetailsTable from "./TestCaseDetailsTable";
import OptionsMenu from "./OptionsMenu";
import { Categories, CategoryGroup, Conv_Results } from "../types/Data";
import { turnFiltersIntoQuery } from "../utils/Filter";
import { SELECT } from "../constants/Select";
import { ALL_CATEGORY_CONST, PAGE_SIZE } from "../constants/Api";
import {
  isFieldResultField,
  getColFromResult,
  getLinkParamsFromState,
  getDefaultsFromLinkParams,
} from "../utils/Data";
import Button from "../components/Button";
import { GRAPH_DATA_LABEL_KEY } from "../constants/Chart";

const customStyles = {
  container: (provided: any, state: any) => ({
    ...provided,
    width: state.selectProps.width,
  }),
};

const NONE_OPTION = "(None)";

const MainPage = () => {
  const defaults = getDefaultsFromLinkParams(window.location.search.slice(1));

  const empty_data: Array<Conv_Results> = [];
  const [data, setData] = useState<Array<Conv_Results>>(empty_data);
  const prevDataRef = useRef<Array<Conv_Results>>(empty_data);
  const [columns, setColumns] = useState(
    defaults.columns ? defaults.columns : ["max_delay"]
  );
  const [tableCategories, setTableCategories] = useState(
    defaults.tableCategories ? defaults.tableCategories : ["alias"]
  );
  const [columnsAvailable, setColumnsAvailable] = useState<Array<string>>([]);
  const [filters, setFilters] = useState<Array<Categories>>(
    defaults.filters ? defaults.filters : []
  );
  const [categories, setCategories] = useState<Categories>({});
  const [dataLabels, setDataLabels] = useState<Array<string>>(
    defaults.dataLabels ? defaults.dataLabels : []
  );
  const [page, setPage] = useState(0); // 0 indexed
  const [totalPages, setTotalPages] = useState(0); // 1 indexed
  const [dataLoading, setDataLoading] = useState(false);
  const [sortTestcasesCategory, setSortTestcasesCategory] = useState<string>(
    defaults.sortTestcasesCategory
      ? defaults.sortTestcasesCategory
      : NONE_OPTION
  );
  const [baseColumnHash, setBaseColumnHash] = useState<string | null>(
    defaults.baseColumnHash ? defaults.baseColumnHash : null
  );

  const fetchDataAndDataCount = async (filters: Array<Categories>) => {
    setDataLoading(true);
    const [respData, status] = await getData(
      `${turnFiltersIntoQuery(filters)}&page=${page}&page_size=${PAGE_SIZE}`
    );
    const [pages, status2] = await getDataCount(turnFiltersIntoQuery(filters));
    setTotalPages(Math.ceil(pages.count / PAGE_SIZE));
    setData(respData);
    setDataLoading(false);
  };

  const fetchColumns = async () => {
    const [respData, status] = await getData("");
    if (respData.length > 0) {
      const tempColsAvailable = Object.keys(respData[0]).filter((colName) => {
        return isFieldResultField(colName, respData[0][colName]);
      });
      setColumnsAvailable(tempColsAvailable);
    }
  };

  const categoriesAvailable = Object.keys(categories).reduce(
    (all: Array<string>, categoryGroup) => {
      return all.concat(Object.keys(categories[categoryGroup]));
    },
    []
  );

  const updateSingleCategoryWithFilter = async (
    newCategories: Categories,
    filter: Categories,
    categoryGroup: string,
    categoryName: string
  ) => {
    let filterForCategory = Object.keys(filter).reduce(
      (acc: Categories, curr) => {
        acc[curr] = Object.keys(filter[curr]).reduce(
          (acc1: CategoryGroup, curr1) => {
            if (curr1 !== categoryName) {
              acc1[curr1] = filter[curr][curr1];
            }
            return acc1;
          },
          {}
        );
        return acc;
      },
      {}
    );
    if (
      filterForCategory[categoryGroup] &&
      Object.keys(filterForCategory[categoryGroup]).length == 0
    ) {
      delete filterForCategory[categoryGroup];
    }
    let [respData, status] = await getCategories(
      categoryName,
      turnFiltersIntoQuery([filterForCategory])
    );
    if (!newCategories[categoryGroup]) {
      newCategories[categoryGroup] = {};
    }
    newCategories[categoryGroup][categoryName] = [];
    if (respData[categoryGroup] && respData[categoryGroup][categoryName]) {
      newCategories[categoryGroup][categoryName] =
        respData[categoryGroup][categoryName];
    }
  };

  const updateCategoriesWithFilter = async (filter: Categories) => {
    if (Object.keys(filter).length == 0) {
      const [respData, status] = await getCategories(ALL_CATEGORY_CONST, "");
      setCategories(respData);
    } else {
      let newCategories: Categories = {};
      let promises: Array<Promise<void>> = [];
      for (let categoryGroup in categories) {
        for (let categoryName in categories[categoryGroup]) {
          promises.push(
            updateSingleCategoryWithFilter(
              newCategories,
              filter,
              categoryGroup,
              categoryName
            )
          );
        }
      }
      await Promise.all(promises);
      setCategories(newCategories);
    }
  };

  const updateGraphDataLabels = () => {
    const newData = _.cloneDeep(data);
    newData.forEach((element) => {
      element[GRAPH_DATA_LABEL_KEY] = dataLabels.reduce((acc, curr, ind) => {
        if (ind != 0) {
          acc = `${acc} / `;
        }
        const result = getColFromResult(curr, element);
        acc = `${acc}${result}`;
        return acc;
      }, "");
    });
    setData(newData);
    return newData;
  };

  useEffect(() => {
    const newQuery = getLinkParamsFromState(
      columns,
      tableCategories,
      dataLabels,
      sortTestcasesCategory,
      filters,
      baseColumnHash
    );
    window.history.pushState("", "", `${window.location.origin}/?${newQuery}`);
  }, [
    columns,
    tableCategories,
    dataLabels,
    sortTestcasesCategory,
    filters,
    baseColumnHash,
  ]);

  useEffect(() => {
    if (data !== prevDataRef.current) {
      prevDataRef.current = updateGraphDataLabels();
    }
  }, [data]);

  useEffect(() => {
    updateGraphDataLabels();
  }, [dataLabels]);

  useEffect(() => {
    fetchColumns();
  }, []);

  useEffect(() => {
    fetchDataAndDataCount(filters);
  }, [filters, page]);

  useEffect(() => {
    updateCategoriesWithFilter({});
  }, []);

  const onSelectColumnChange = (obj: any, info: any) => {
    let newColumns = [...columns];
    switch (info.action) {
      case SELECT.SELECT_OPTION:
        newColumns.push(info.option.value);
        break;
      case SELECT.POP_VALUE:
      case SELECT.REMOVE_VALUE:
        newColumns = newColumns.filter(
          (option) => option != info.removedValue.value
        );
        break;
      case SELECT.CLEAR:
        newColumns = [];
    }
    setColumns(newColumns);
  };

  const onSelectTableCategoryChange = (obj: any, info: any) => {
    let newTableCategories = [...tableCategories];
    switch (info.action) {
      case SELECT.SELECT_OPTION:
        newTableCategories.push(info.option.value);
        break;
      case SELECT.POP_VALUE:
      case SELECT.REMOVE_VALUE:
        newTableCategories = newTableCategories.filter(
          (option) => option != info.removedValue.value
        );
        break;
      case SELECT.CLEAR:
        newTableCategories = [];
    }
    setTableCategories(newTableCategories);
  };

  const onSelectDataLabelKeyChange = (obj: any, info: any) => {
    let newDataLabels = [...dataLabels];
    switch (info.action) {
      case SELECT.SELECT_OPTION:
        newDataLabels.push(info.option.value);
        break;
      case SELECT.POP_VALUE:
      case SELECT.REMOVE_VALUE:
        newDataLabels = newDataLabels.filter(
          (option) => option != info.removedValue.value
        );
        break;
      case SELECT.CLEAR:
        newDataLabels = [];
    }
    setDataLabels(newDataLabels);
  };

  const onSortTestcaseCategoriesChange = (obj: any, info: any) => {
    switch (info.action) {
      case SELECT.SELECT_OPTION:
        setSortTestcasesCategory(obj.value);
        break;
    }
  };

  return (
    <PageWrapper>
      <OptionsMenu
        filters={filters}
        categories={categories}
        setFilters={setFilters}
        updateCategoriesWithFilter={updateCategoriesWithFilter}
      />
      <ResultsWrapper>
        <ResultsHeaderAndPageInfo>
          <ResultsHeader>Results</ResultsHeader>
          <PageInfo>
            <Button
              padding="8px 16px"
              height={32}
              margin="0 16px 0 0"
              handleClick={() => {
                if (page > 0) setPage(page - 1);
              }}
            >
              {"<"}
            </Button>
            <PageText>{`Page ${page + 1} of ${totalPages}`}</PageText>
            <Button
              padding="8px 16px"
              height={32}
              margin="0 0 0 16px"
              handleClick={() => {
                if (page < totalPages - 1) setPage(page + 1);
              }}
            >
              {">"}
            </Button>
          </PageInfo>
        </ResultsHeaderAndPageInfo>
        <DropdownChooserWrapper>
          <DropdownChooserText>Choose columns</DropdownChooserText>
          <Select
            closeMenuOnSelect={false}
            value={columns.map((col) => ({
              value: col,
              label: col,
            }))}
            onChange={onSelectColumnChange}
            styles={customStyles}
            isMulti
            options={columnsAvailable.map((col) => ({
              value: col,
              label: col,
            }))}
            width={500}
          />
        </DropdownChooserWrapper>
        <DropdownChooserWrapper>
          <DropdownChooserText>Choose labels</DropdownChooserText>
          <Select
            closeMenuOnSelect={false}
            value={dataLabels.map((col) => ({
              value: col,
              label: col,
            }))}
            isMulti
            onChange={onSelectDataLabelKeyChange}
            styles={customStyles}
            options={categoriesAvailable.map((cat) => ({
              value: cat,
              label: cat,
            }))}
            width={500}
          />
        </DropdownChooserWrapper>
        <DropdownChooserWrapper>
          <DropdownChooserText>
            Choose category to sort groups of test cases by
          </DropdownChooserText>
          <Select
            closeMenuOnSelect={false}
            value={
              sortTestcasesCategory === NONE_OPTION
                ? null
                : {
                    value: sortTestcasesCategory,
                    label: sortTestcasesCategory,
                  }
            }
            onChange={onSortTestcaseCategoriesChange}
            styles={customStyles}
            options={[NONE_OPTION, ...categoriesAvailable].map((cat) => ({
              value: cat,
              label: cat,
            }))}
            width={500}
          />
        </DropdownChooserWrapper>
        <TestCaseDetailsGraphWrapper>
          <TestCaseDetailsGraph
            data={data}
            columns={columns}
            isLoading={dataLoading}
          />
        </TestCaseDetailsGraphWrapper>
        <DropdownChooserWrapper>
          <DropdownChooserText>
            Choose categories to display along top
          </DropdownChooserText>
          <Select
            closeMenuOnSelect={false}
            value={tableCategories.map((col) => ({
              value: col,
              label: col,
            }))}
            onChange={onSelectTableCategoryChange}
            styles={customStyles}
            isMulti
            options={categoriesAvailable.map((cat) => ({
              value: cat,
              label: cat,
            }))}
            width={500}
          />
        </DropdownChooserWrapper>
        <TestCaseDetailsTable
          data={data}
          result_fields={columns}
          categories={tableCategories}
          isLoading={dataLoading}
          baseColumnHash={baseColumnHash}
          setBaseColumnHash={setBaseColumnHash}
        />
      </ResultsWrapper>
    </PageWrapper>
  );
};

export default MainPage;
