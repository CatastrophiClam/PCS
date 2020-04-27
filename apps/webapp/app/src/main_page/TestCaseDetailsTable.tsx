import React from "react";

import { Conv_Results } from "../Types";
import { stringify } from "querystring";

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
    <table>
      <tbody>
        <tr>
          <td>Testcase Name</td>
          {columns.map((col_name) => {
            return <td key={col_name}>{col_name}</td>;
          })}
        </tr>
        {Object.keys(conv_results_by_tc).map((tc_name) => {
          return conv_results_by_tc[tc_name].map((result_row, ind) => {
            return (
              <tr key={`${tc_name}${ind}`}>
                <td>{tc_name}</td>
                {columns.map((col_name) => {
                  return (
                    <td key={`${tc_name}${col_name}${ind}`}>
                      {result_row[col_name]}
                    </td>
                  );
                })}
              </tr>
            );
          });
        })}
      </tbody>
    </table>
  );
};

export default TestCaseDetailsTable;
