import styled from "styled-components";
import { Heading2, Heading4, BoxShadow, Body } from "../../constants/Mixins";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
`;

export const ResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  ${BoxShadow}
  padding: 32px;
`;

export const ResultsHeaderAndPageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: 16px;
`;

export const ResultsHeader = styled.div`
  color: ${({ theme }) => theme.colors.purple};
  ${Heading2}
`;

export const PageInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const PageText = styled.div`
  ${Body}
  color: ${({ theme }) => theme.colors.gray}
`;

export const DropdownChooserWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
`;

export const DropdownChooserText = styled.div`
  ${Heading4}
  color: ${({ theme }) => theme.colors.yellow};
  margin-right: 16px;
`;

export const TestCaseDetailsGraphWrapper = styled.div`
  margin-bottom: 16px;
`;

export const BarBackgroundDiv = styled.div`
  background-color: red;
  width: 100%;
  height: 100%;
`;
