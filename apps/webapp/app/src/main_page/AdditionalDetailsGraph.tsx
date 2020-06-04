import React from "react";
import _ from "lodash";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { ChartWrapper, ChartTitle } from "./styles/TestCaseDetailsTable";
import { chartColors } from "../constants/Chart";

interface AdditionalDetailsGraphProps {
  details: string | null;
  reportName: string | undefined;
}

const AdditionalDetailsGraph = ({
  details,
  reportName,
}: AdditionalDetailsGraphProps) => {
  const d: string = details ? details : "";
  const dataByLines = _.split(d, "\n").map((linestr) => _.split(linestr, ","));
  const lines = dataByLines.map((_, ind) => `Iteration ${ind}`);

  const maxLineLength = dataByLines.reduce((acc, curr) => {
    if (curr.length > acc) {
      return curr.length;
    }
    return acc;
  }, 0);
  let flatData = [];
  for (let i = 0; i < maxLineLength; i++) {
    let currObj: { [key: string]: number } = { x: i };
    for (let j = 0; j < dataByLines.length; j++) {
      if (dataByLines[j].length > i) {
        currObj[`Iteration ${j}`] = parseInt(dataByLines[j][i]);
      }
    }
    flatData.push(currObj);
  }

  return (
    <ChartWrapper>
      <ChartTitle>{reportName}</ChartTitle>
      <LineChart
        width={800}
        height={400}
        data={flatData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataByLines.map((_, ind) => (
          <Line
            type="monotone"
            dataKey={`Iteration ${ind}`}
            stroke={chartColors[ind]}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartWrapper>
  );
};

export default AdditionalDetailsGraph;
