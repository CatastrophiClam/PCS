import styled from "styled-components";
import { Heading2, Heading4, BoxShadow } from "../../constants/Mixins";

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
  padding: 16px;
`;

export const ResultsHeader = styled.div`
  color: ${({ theme }) => theme.colors.purple};
  ${Heading2}
  align-self: flex-start;
  margin-bottom: 16px;
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
