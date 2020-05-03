import React from "react";

import { Conv_Results } from "../types/Data";
import { stringify } from "querystring";
import {
  Table,
  HeaderData,
  TableRow,
  RowData,
} from "./styles/TestCaseDetailsTable";

interface TestCaseDetailsTableProps {
  data: Array<Conv_Results>;
  columns: Array<string>;
}

const TestCaseDetailsTable = ({ data, columns }: TestCaseDetailsTableProps) => {
  const conv_results_by_tc: Record<string, Array<Conv_Results>> = data.reduce(
    (acc: Record<string, Array<Conv_Results>>, curr: Conv_Results) => {
      if (!(curr.testcase_id.script_name in acc)) {
        acc[curr.testcase_id.script_name] = [];
      }
      if (!acc[curr.testcase_id.script_name].includes(curr)) {
        acc[curr.testcase_id.script_name].push(curr);
      }
      return acc;
    },
    {}
  );
  return (
    <Table>
      <tbody>
        <tr>
          <HeaderData>Testcase Name</HeaderData>
          {columns.map((col_name) => {
            return <HeaderData key={col_name}>{col_name}</HeaderData>;
          })}
        </tr>
        {Object.keys(conv_results_by_tc).map((tc_name) => {
          return conv_results_by_tc[tc_name].map((result_row, ind) => {
            return (
              <TableRow key={`${tc_name}${ind}`}>
                <RowData>{tc_name}</RowData>
                {columns.map((col_name) => {
                  return (
                    <RowData key={`${tc_name}${col_name}${ind}`}>
                      {result_row[col_name]}
                    </RowData>
                  );
                })}
              </TableRow>
            );
          });
        })}
      </tbody>
    </Table>
  );
};

export default TestCaseDetailsTable;
