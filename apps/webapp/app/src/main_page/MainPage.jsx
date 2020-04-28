import React, { useState, useEffect } from "react";
import { getData, getCategories } from "../utils/Api";
import { PageWrapper } from "./styles/MainPage.jsx";
import TestCaseDetailsGraph from "./TestCaseDetailsGraph";
import TestCaseDetailsTable from "./TestCaseDetailsTable";
import AdditionalDetailsGraph from "./AdditionalDetailsGraph";
import OptionsMenu from "./OptionsMenu";

const MainPage = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    "fib_slope",
    "prefix_sec",
    "max_delay",
  ]);
  const [options, setOptions] = useState({});
  const [categories, setCategories] = useState({});

  const fetchData = async () => {
    const [respData, status] = await getData();
    setData(respData);
  };

  const fetchCategories = async () => {
    const [respData, status] = await getCategories();
    setCategories(respData);
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  return (
    <PageWrapper>
      <OptionsMenu />
      <TestCaseDetailsGraph data={data} columns={columns} />
      <AdditionalDetailsGraph />
      <TestCaseDetailsTable data={data} columns={columns} />
    </PageWrapper>
  );
};

export default MainPage;