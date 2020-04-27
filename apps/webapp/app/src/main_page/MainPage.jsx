import React, { useState, useEffect } from "react";
import { getData } from "../utils/Api";
import { PageWrapper } from "./styles/MainPage.jsx";
import TestCaseDetailsGraph from "./TestCaseDetailsGraph";
import TestCaseDetailsTable from "./TestCaseDetailsTable";
import AdditionalDetailsGraph from "./AdditionalDetailsGraph";
import OptionsMenu from "./OptionsMenu";

const MainPage = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const [respData, status] = await getData();
    setData(respData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageWrapper>
      <OptionsMenu />
      <TestCaseDetailsGraph />
      <AdditionalDetailsGraph />
      <TestCaseDetailsTable data={data} columns={["fib_slope"]} />
    </PageWrapper>
  );
};

export default MainPage;
