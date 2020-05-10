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
  Text,
} from "recharts";
import {
  MAX_COLUMNS,
  CONVERGENCE_TC_DATAKEY,
  chartColors,
  GRAPH_DATA_LABEL_KEY,
} from "../constants/Chart";
import LoadingSpinner from "../components/LoadingSpinner";

const BarLabelRenderer = (props: any) => {
  const { x, y, width, height, value } = props;
  return (
    <Text x={x + width / 2 - 2} y={y - 4} textAnchor="start" angle={-45}>
      {value}
    </Text>
  );
};

interface TestCaseDetailsGraphProps {
  data: Array<Conv_Results>;
  columns: Array<string>;
  isLoading: boolean;
}

const TestCaseDetailsGraph = ({
  data,
  columns,
  isLoading,
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const dataToDisplay = guaranteeNumberData(flattenAndCropData(data));

  return (
    <ResponsiveContainer height={600}>
      <BarChart data={dataToDisplay} barCategoryGap={10} maxBarSize={100}>
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
        <YAxis domain={[0, (dataMax) => dataMax * 1.5]} allowDecimals={false} />
        <Tooltip />
        <Legend />
        {columns.map((col, ind) => (
          <Bar dataKey={col} fill={chartColors[ind]}>
            {ind == Math.floor(columns.length / 2) && (
              <LabelList
                dataKey={GRAPH_DATA_LABEL_KEY}
                position="top"
                angle={-45}
                content={BarLabelRenderer}
              ></LabelList>
            )}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TestCaseDetailsGraph;
