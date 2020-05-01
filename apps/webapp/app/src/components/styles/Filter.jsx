import styled from "styled-components";
import { Body, Heading4 } from "../../constants/Mixins";

export const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 5px;
`;

export const CategoryWithOptions = styled.div`
  display: flex;
  margin-right: 8px;
  align-items: center;
`;

export const CategoryName = styled.div`
  ${Body};
  color: ${({ theme }) => theme.colors.yellow};
  margin-right: 4px;
`;

export const CategoryOptions = styled.div`
  ${Body}
`;
