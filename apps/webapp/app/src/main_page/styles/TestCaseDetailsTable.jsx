import styled from "styled-components";
import { Heading4, Body } from "../../constants/Mixins";
import FadeIn from "react-fade-in";

export const Table = styled.table`
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 5px;
`;

export const HeaderData = styled.td`
  color: ${({ theme }) => theme.colors.yellow};
  ${Heading4};
  padding: 4px;

  :first-child {
    border-radius: 0 0 0 5px;
  }
`;

export const TableRow = styled.tr`
  :nth-child(even) {
    background-color: ${({ theme }) => theme.colors.superLightGray};
  }
`;

export const RowData = styled.td`
  ${Body}
  padding: 4px;
`;

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
