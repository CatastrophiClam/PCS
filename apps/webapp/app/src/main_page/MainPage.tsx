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
import { Categories } from "../types/Data";
import { turnFiltersIntoQuery } from "../utils/Filter";
import { SELECT } from "../constants/Select";

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

  const fetchCategories = async () => {
    const [respData, status] = await getCategories("");
    setCategories(respData);
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

  useEffect(() => {
    fetchColumns();
  }, []);

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  useEffect(() => {
    fetchCategories();
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
