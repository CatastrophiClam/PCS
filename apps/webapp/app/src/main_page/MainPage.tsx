import React, { useState, useEffect } from "react";
import { getData, getCategories } from "../utils/Api";
import { PageWrapper } from "./styles/MainPage.jsx";
import TestCaseDetailsGraph from "./TestCaseDetailsGraph";
import TestCaseDetailsTable from "./TestCaseDetailsTable";
import AdditionalDetailsGraph from "./AdditionalDetailsGraph";
import OptionsMenu from "./OptionsMenu";
import { Categories } from "../types/Data";

const MainPage = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    "fib_slope",
    "prefix_sec",
    "max_delay",
  ]);
  const [filters, setFilters] = useState<Array<Categories>>([]);
  const [categories, setCategories] = useState({});

  const turnFiltersIntoQuery = (filters: Array<Categories>) => {
    return filters.reduce((query, currFilter, ind) => {
      if (ind != 0) {
        query = `${query}&`;
      }
      const queryBody = Object.keys(currFilter).reduce(
        (body, categoryGroup, i1) => {
          const partialQueryBody = Object.keys(
            currFilter[categoryGroup]
          ).reduce((pbody, category, i2) => {
            if (!(i1 == 0 && i2 == 0)) {
              pbody = `${pbody};`;
            }
            const values = currFilter[categoryGroup][category].reduce(
              (allVals, currVal, i3) => {
                if (i3 != 0) {
                  allVals = `${allVals},`;
                }
                return `${allVals}${currVal}`;
              },
              ""
            );
            return `${pbody}${category}=${values}`;
          }, "");
          return `${body}${partialQueryBody}`;
        },
        ""
      );
      return `${query}c${ind}=${queryBody}`;
    }, "?");
  };

  const fetchData = async (filters: Array<Categories>) => {
    const [respData, status] = await getData(turnFiltersIntoQuery(filters));
    setData(respData);
  };

  const fetchCategories = async () => {
    const [respData, status] = await getCategories("");
    setCategories(respData);
  };

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <PageWrapper>
      <OptionsMenu
        filters={filters}
        categories={categories}
        setFilters={setFilters}
      />
      <TestCaseDetailsGraph data={data} columns={columns} />
      <AdditionalDetailsGraph />
      <TestCaseDetailsTable data={data} columns={columns} />
    </PageWrapper>
  );
};

export default MainPage;
