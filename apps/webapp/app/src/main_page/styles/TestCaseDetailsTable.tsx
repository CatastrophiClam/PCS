import styled from "styled-components";
import { Heading4, Body } from "../../constants/Mixins";
import FadeIn from "react-fade-in";

export const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
`;

export const Table = styled.table`
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 5px;
  width: 100%;
`;

export const HeaderData = styled.td`
  color: ${({ theme }) => theme.colors.yellow};
  ${Heading4};
  padding: 4px;
`;

interface TableRowProps {
  light?: boolean;
}

export const TableRow = styled.tr<TableRowProps>`
  :nth-child(even) {
    background-color: ${({ theme }) => theme.colors.superLightGray};
  }

  ${({ light, theme }) =>
    !light &&
    `:nth-child(odd){
    background-color: ${theme.colors.lightGray};
  }`}
`;

interface RowDataProps {
  left?: boolean;
  right?: boolean;
  dark?: boolean;
}

export const RowData = styled.td<RowDataProps>`
  ${Body}
  padding: 4px;
  ${({ left, theme }) =>
    left ? `border-left: 1px solid ${theme.colors.darkGray};` : ""}
  :not(:last-child) {
    ${({ right, theme }) =>
      right ? `border-right: 1px solid ${theme.colors.darkGray};` : ""}
  }
  ${({ dark, theme }) =>
    dark && `background-color: ${theme.colors.superLightGray}`}
`;

export const DataTextWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

// @ts-ignore
export const ModalChildren = styled(FadeIn)`
  position: relative;
  margin: 4px;
`;

export const ModalX = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  height: 24px;
  width: 24px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  z-index: 1;
  color: ${({ theme }) => theme.colors.darkGray};

  &:hover {
    color: ${({ theme }) => theme.colors.gray};
  }
`;

export const ChartWrapper = styled.div`
  background-color: white;
  border-radius: 5px;
  padding: 16px;
`;

interface DifferencePercentageProps {
  positive?: boolean;
}

export const DifferencePercentage = styled.div<DifferencePercentageProps>`
  ${Body}
  color: ${({ positive, theme }) =>
    positive ? theme.colors.green : theme.colors.red};
  margin-left: 4px;
`;
