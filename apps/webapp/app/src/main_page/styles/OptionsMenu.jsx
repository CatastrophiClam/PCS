import styled from "styled-components";
import {
  Heading2,
  BoxShadow,
  Heading3,
  Heading4,
  Body,
} from "../../constants/Mixins";

export const OptionsMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
  ${BoxShadow};
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 5px;
`;
export const CreateFilterSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const CreateFilterSectionHeader = styled.div`
  ${Heading2}
  color: ${({ theme }) => theme.colors.purple};
  align-self: flex-start;
  margin-bottom: 16px;
`;

export const AllCategoryGroupsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const CategoryGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 16px 16px 0;
  border-radius: 5px;
  align-items: flex-start;
  ${BoxShadow}
  padding: 8px;
`;

export const CategoryGroupHeader = styled.div`
  color: ${({ theme }) => theme.colors.yellow};
  ${Heading4};
`;

export const CategoryName = styled.td`
  ${Body}
  display: flex;
  justify-content: flex-start;
  margin-right: 4px;
  align-items: center;
`;

export const CurrentFilterSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const CurrentFilterHeader = styled.div`
  align-self: flex-start;
  ${Heading3}
  color: ${({ theme }) => theme.colors.purple};
`;

export const CurrentFilterInfoText = styled.div`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const AllFiltersSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const AllFiltersHeader = styled.div`
  align-self: flex-start;
  ${Heading3}
  color: ${({ theme }) => theme.colors.purple};
`;

export const FilterWrapper = styled.div`
  margin: 16px 0 0 0;
`;
