import React, { useState } from "react";
import ReactModal from "react-modal";
import { X } from "react-feather";
import { Conv_Results } from "../types/Data";
import { ModalChildren, ModalX } from "./styles/TestCaseDetailsTable";
import {
  Table,
  HeaderData,
  TableRow,
  RowData,
} from "./styles/TestCaseDetailsTable";
import AdditionalDetailsGraph from "./AdditionalDetailsGraph";
import { DETAIL_RESULT } from "../constants/Api";

interface TestCaseDetailsTableProps {
  data: Array<Conv_Results>;
  columns: Array<string>;
}

const TestCaseDetailsTable = ({ data, columns }: TestCaseDetailsTableProps) => {
  const [additionalDetails, setAdditionalDetails] = useState<string | null>(
    null
  );
  const [
    isAdditionalDetailsModalOpen,
    setAdditionalDetailsModalOpen,
  ] = useState(false);

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

  const openGraphModal = (detailed_result: string | undefined) => {
    if (detailed_result) {
      setAdditionalDetails(detailed_result);
    }
    setAdditionalDetailsModalOpen(true);
  };

  return (
    <>
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
                  {columns.map((col_name) => (
                    <RowData key={`${tc_name}${col_name}${ind}`}>
                      {col_name === DETAIL_RESULT ? (
                        result_row[col_name] ? (
                          <a
                            onClick={() => openGraphModal(result_row[col_name])}
                          >
                            graph
                          </a>
                        ) : null
                      ) : (
                        result_row[col_name]
                      )}
                    </RowData>
                  ))}
                </TableRow>
              );
            });
          })}
        </tbody>
      </Table>
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
