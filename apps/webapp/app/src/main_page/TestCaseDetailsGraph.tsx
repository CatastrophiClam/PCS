import React from "react";
import { Conv_Results } from "../types/Data";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LabelList,
} from "recharts";
import {
  MAX_COLUMNS,
  CONVERGENCE_TC_DATAKEY,
  chartColors,
} from "../constants/Chart";

interface TestCaseDetailsGraphProps {
  data: Array<Conv_Results>;
  columns: Array<string>;
  dataLabelKey?: string | null;
}

const TestCaseDetailsGraph = ({
  data,
  columns,
  dataLabelKey,
}: TestCaseDetailsGraphProps) => {
  const flattenAndCropData = (input: Array<Conv_Results>) => {
    const max_data_len = Math.floor(MAX_COLUMNS / columns.length);
    let output = input.slice(0, max_data_len);
    for (let i = 0; i < output.length; i++) {
      const keys: Array<string> = Object.keys(output[i]);
      for (let key of keys) {
        if (typeof output[i][key] === "object") {
          output[i] = { ...output[i], ...output[i][key] };
          delete output[i][key];
        }
      }
    }
    return output;
  };

  const guaranteeNumberData = (input: Array<Conv_Results>) => {
    let output = [...input];
    for (let i = 0; i < output.length; i++) {
      output[i] = { ...input[i] };
      Object.keys(output[i]).forEach((key) => {
        if (columns.includes(key)) {
          output[i][key] = parseFloat(output[i][key]);
          if (typeof output[i][key] !== "number" || output[i][key] == NaN) {
            output[i][key] = 0;
          }
        }
      });
    }
    return output;
  };

  const dataToDisplay = guaranteeNumberData(flattenAndCropData(data));
  return (
    <ResponsiveContainer height={600}>
      <BarChart data={dataToDisplay} barCategoryGap={10}>
        <CartesianGrid strokeDasharray="3 3" />
        {columns.length > 0 && (
          <XAxis
            dataKey={CONVERGENCE_TC_DATAKEY}
            angle={-45}
            interval={0}
            height={200}
            textAnchor="end"
            tickMargin={8}
          />
        )}
        <YAxis domain={[0, (dataMax) => dataMax * 1.25]} />
        <Tooltip />
        <Legend />
        {columns.map((col, ind) => (
          <Bar dataKey={col} fill={chartColors[ind]}>
            {dataLabelKey && (
              <LabelList dataKey={dataLabelKey} position="top" />
            )}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TestCaseDetailsGraph;
