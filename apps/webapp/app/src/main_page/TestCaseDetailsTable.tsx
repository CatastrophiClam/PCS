import React, { useState } from "react";
import ReactModal from "react-modal";
import { X } from "react-feather";
import { Conv_Results } from "../types/Data";
import {
  TableWrapper,
  Table,
  HeaderData,
  TableRow,
  RowData,
  DifferencePercentage,
  ModalChildren,
  ModalX,
  DataTextWrapper,
} from "./styles/TestCaseDetailsTable";
import AdditionalDetailsGraph from "./AdditionalDetailsGraph";
import { DETAIL_RESULT } from "../constants/Api";
import LoadingSpinner from "../components/LoadingSpinner";
import { hashResultRowByCategory, getColFromResult } from "../utils/Data";
import { NON_REVERSE_PERCENTAGE_FIELDS } from "../constants/DataTable";

interface HeaderObj {
  hash: string;
  categories: { [category: string]: string };
  width: number;
}

interface DataObj {
  testcase: string;
  data: { [hash: string]: Array<Conv_Results> };
}

interface ProcessedData
  extends Array<Array<HeaderObj> | Array<DataObj> | number> {
  0: Array<HeaderObj>;
  1: Array<DataObj>;
  2: number;
}

const processData = (
  data: Array<Conv_Results>,
  categories: Array<string>
): ProcessedData => {
  let tableHeaders: Array<HeaderObj> = [];
  let tableData: Array<DataObj> = [];
  let hashToIndInHeaders: { [hash: string]: number } = {};

  let prevTableData: DataObj | null = null;
  let currTableData: DataObj | null = null;

  const updateTableHeaderMaxWidths = (currData: DataObj) => {
    Object.keys(currData.data).forEach((currHash) => {
      if (
        currData.data[currHash].length >
        tableHeaders[hashToIndInHeaders[currHash]].width
      ) {
        tableHeaders[hashToIndInHeaders[currHash]].width =
          currData.data[currHash].length;
      }
    });
  };

  // Assume data has been sorted by test case script name
  data.forEach((result) => {
    if (
      !currTableData ||
      currTableData.testcase !== result.testcase_id.script_name
    ) {
      prevTableData = currTableData;
      currTableData = { testcase: result.testcase_id.script_name, data: {} };
      if (prevTableData) {
        updateTableHeaderMaxWidths(prevTableData);
        tableData.push(prevTableData);
      }
    }

    const hash = hashResultRowByCategory(result);
    if (
      hashToIndInHeaders[hash] == undefined ||
      hashToIndInHeaders[hash] == null
    ) {
      hashToIndInHeaders[hash] = tableHeaders.length;
      tableHeaders.push({
        hash: hash,
        categories: categories.reduce(
          (acc: { [colName: string]: string }, curr) => {
            acc[curr] = getColFromResult(curr, result);
            return acc;
          },
          {}
        ),
        width: 1,
      });
    }

    if (!currTableData.data[hash]) {
      currTableData.data[hash] = [];
    }
    currTableData.data[hash].push(result);
  });
  if (currTableData) {
    updateTableHeaderMaxWidths(currTableData);
    tableData.push(currTableData);
  }

  const numDataCols = tableHeaders.reduce((acc, curr) => {
    return acc + curr.width;
  }, 0);

  console.log(tableHeaders);
  console.log(tableData);
  console.log(hashToIndInHeaders);

  return [tableHeaders, tableData, numDataCols];
};

interface TestCaseDetailsTableProps {
  data: Array<Conv_Results>;
  result_fields: Array<string>;
  categories: Array<string>;
  isLoading: boolean;
}

const TestCaseDetailsTable = ({
  data,
  result_fields,
  categories,
  isLoading,
}: TestCaseDetailsTableProps) => {
  const [additionalDetails, setAdditionalDetails] = useState<string | null>(
    null
  );
  const [
    isAdditionalDetailsModalOpen,
    setAdditionalDetailsModalOpen,
  ] = useState(false);

  const [tableHeaders, tableData, numDataCols] = processData(data, categories);

  const openGraphModal = (detailed_result: string | undefined) => {
    if (detailed_result) {
      setAdditionalDetails(detailed_result);
    }
    setAdditionalDetailsModalOpen(true);
  };
  const [baseColumnHash, setBaseColumnHash] = useState<string | null>(null);

  const getDifferencePercentage = (
    testcaseRow: DataObj,
    result: Conv_Results,
    field: string
  ) => {
    const fieldNum = parseFloat(result[field]);
    if (result[field] && typeof fieldNum == "number" && fieldNum !== NaN) {
      if (baseColumnHash && testcaseRow.data[baseColumnHash]) {
        return testcaseRow.data[baseColumnHash].map((curr) => {
          const baseNum = parseFloat(curr[field]);
          if (typeof baseNum == "number" && baseNum !== NaN && baseNum > 0) {
            let diffPercent = ((fieldNum - baseNum) / baseNum) * 100;
            if (!NON_REVERSE_PERCENTAGE_FIELDS.includes(field)) {
              diffPercent *= -1;
            }
            return (
              <DifferencePercentage
                positive={diffPercent >= 0}
              >{`(${diffPercent.toFixed(2)}%) `}</DifferencePercentage>
            );
          } else {
            return null;
          }
        });
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <TableWrapper>
        <Table>
          <tbody>
            <tr>
              <HeaderData colSpan={2}></HeaderData>
              {tableHeaders.map((header) => (
                <td colSpan={header.width}>
                  <a
                    onClick={() =>
                      baseColumnHash === header.hash
                        ? setBaseColumnHash(null)
                        : setBaseColumnHash(header.hash)
                    }
                  >
                    {baseColumnHash === header.hash
                      ? "Remove as base"
                      : "Use as base"}
                  </a>
                </td>
              ))}
            </tr>
            {categories.length == 0 && (
              <tr>
                <HeaderData>Test Cases</HeaderData>
                <HeaderData colSpan={numDataCols + 1}></HeaderData>
              </tr>
            )}
            {categories.map((category, ind) => (
              <tr>
                {ind == 0 && (
                  <HeaderData rowSpan={categories.length}>
                    Test Cases
                  </HeaderData>
                )}
                <HeaderData>{category}</HeaderData>
                {tableHeaders.map((header) => (
                  <HeaderData key={header.hash} colSpan={header.width}>
                    {header.categories[category]}
                  </HeaderData>
                ))}
              </tr>
            ))}
            {result_fields.length > 0 &&
              tableData.map((testcaseRow, ind2) =>
                result_fields.map((result_field, ind) => (
                  <TableRow light={ind2 % 2 == 0}>
                    {ind == 0 && (
                      <RowData
                        dark={ind2 % 2 == 1}
                        rowSpan={result_fields.length}
                        right
                      >
                        {testcaseRow.testcase}
                      </RowData>
                    )}
                    <RowData right>{result_field}</RowData>
                    {tableHeaders.map((header) =>
                      testcaseRow.data[header.hash] ? (
                        testcaseRow.data[header.hash].map((result, ind1) => (
                          <RowData
                            colSpan={
                              Math.floor(
                                header.width /
                                  testcaseRow.data[header.hash].length
                              ) +
                              (ind1 <=
                              (header.width %
                                testcaseRow.data[header.hash].length) -
                                1
                                ? 1
                                : 0)
                            }
                            right={
                              ind1 == testcaseRow.data[header.hash].length - 1
                            }
                          >
                            {result_field === DETAIL_RESULT ? (
                              result[result_field] ? (
                                <a
                                  onClick={() =>
                                    openGraphModal(result[result_field])
                                  }
                                >
                                  graph
                                </a>
                              ) : null
                            ) : (
                              <DataTextWrapper>
                                {result[result_field]}
                                {getDifferencePercentage(
                                  testcaseRow,
                                  result,
                                  result_field
                                )}
                              </DataTextWrapper>
                            )}
                          </RowData>
                        ))
                      ) : (
                        <RowData right colSpan={header.width}></RowData>
                      )
                    )}
                  </TableRow>
                ))
              )}
          </tbody>
        </Table>
      </TableWrapper>
      {additionalDetails && (
        <ReactModal
          isOpen={isAdditionalDetailsModalOpen}
          onRequestClose={() => setAdditionalDetailsModalOpen(false)}
          shouldCloseOnOverlayClick={true}
          closeTimeoutMS={150}
          className={"Modal"}
          overlayClassName={"ModalOverlay"}
          onAfterClose={() => setAdditionalDetails(null)}
        >
          <ModalChildren>
            <ModalX
              onClick={() => setAdditionalDetailsModalOpen(false)}
              onMouseDown={(e) => e.preventDefault()}
            >
              <X />
            </ModalX>
            <AdditionalDetailsGraph details={additionalDetails} />
          </ModalChildren>
        </ReactModal>
      )}
    </>
  );
};

export default TestCaseDetailsTable;
