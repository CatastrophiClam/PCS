import React, { useState, useEffect } from "react";
import { getData, getCategories } from "../utils/Api";
import Select from "react-select";
import {
  PageWrapper,
  ResultsWrapper,
  ResultsHeader,
  DropdownChooserWrapper,
  DropdownChooserText,
  TestCaseDetailsGraphWrapper,
} from "./styles/MainPage.jsx";
import TestCaseDetailsGraph from "./TestCaseDetailsGraph";
import TestCaseDetailsTable from "./TestCaseDetailsTable";
import AdditionalDetailsGraph from "./AdditionalDetailsGraph";
import OptionsMenu from "./OptionsMenu";
import { Categories, CategoryGroup } from "../types/Data";
import { turnFiltersIntoQuery } from "../utils/Filter";
import { SELECT } from "../constants/Select";
import { ALL_CATEGORY_CONST } from "../constants/Api";

const NONE_OPTION = "(none)";

const customStyles = {
  container: (provided: any, state: any) => ({
    ...provided,
    width: state.selectProps.width,
  }),
};

const MainPage = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    "fib_slope",
    "prefix_sec",
    "max_delay",
  ]);
  const [columnsAvailable, setColumnsAvailable] = useState<Array<string>>([]);
  const [filters, setFilters] = useState<Array<Categories>>([]);
  const [categories, setCategories] = useState<Categories>({});
  const [dataLabelKey, setDataLabelKey] = useState<string | null>(null);

  const fetchData = async (filters: Array<Categories>) => {
    const [respData, status] = await getData(turnFiltersIntoQuery(filters));
    setData(respData);
  };

  const fetchColumns = async () => {
    const [respData, status] = await getData("");
    if (respData.length > 0) {
      const tempColsAvailable = Object.keys(respData[0]).filter((colName) => {
        return typeof respData[0][colName] !== "object";
      });
      setColumnsAvailable(tempColsAvailable);
    }
  };

  const categoriesAvailable = Object.keys(categories).reduce(
    (all: Array<string>, categoryGroup) => {
      return all.concat(Object.keys(categories[categoryGroup]));
    },
    [NONE_OPTION]
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

  useEffect(() => {
    fetchColumns();
  }, []);

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

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

  const onSelectDataLabelKeyChange = (obj: any, info: any) => {
    switch (info.action) {
      case SELECT.SELECT_OPTION:
        const newKey = obj.value == NONE_OPTION ? null : obj.value;
        setDataLabelKey(newKey);
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
        <ResultsHeader>Results</ResultsHeader>
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
          <DropdownChooserText>Choose label</DropdownChooserText>
          <Select
            closeMenuOnSelect={false}
            value={
              dataLabelKey ? { value: dataLabelKey, label: dataLabelKey } : null
            }
            onChange={onSelectDataLabelKeyChange}
            styles={customStyles}
            options={categoriesAvailable.map((cat) => ({
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
            dataLabelKey={dataLabelKey}
          />
        </TestCaseDetailsGraphWrapper>
        <AdditionalDetailsGraph />
        <TestCaseDetailsTable data={data} columns={columns} />
      </ResultsWrapper>
    </PageWrapper>
  );
};

export default MainPage;
