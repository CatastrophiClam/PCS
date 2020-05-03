import styled from "styled-components";
import { Heading4, Body } from "../../constants/Mixins";

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
