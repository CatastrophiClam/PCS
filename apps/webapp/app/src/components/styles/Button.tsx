import styled from "styled-components";
import { Heading4, Hover, BoxShadow } from "../../constants/Mixins";

interface ButtonWrapperProps {
  height: number;
  onClick: null | Function;
  disabled: null | boolean;
  color?: string;
  hoverColor?: string;
  borderColor?: string;
  hasShadow: boolean;
  margin: string;
  padding: string;
  width: number | string;
  maxHeight: number | string;
  type: string;
  onMouseDown: Function;
}

export const ButtonWrapper = styled.button<ButtonWrapperProps>`
  cursor: ${({ disabled }) => (disabled ? "auto" : "pointer")};
  display: flex;
  align-items: center;
  text-align: center;
  border: ${({ borderColor }) =>
    borderColor ? `2px solid ${borderColor}` : "none"};
  border-radius: 8px;
  padding: ${({ padding }) => padding};
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.lightGray : theme.colors.darkGray};
  min-height: ${({ height }) => height}px;
  max-height: ${({ maxHeight }) => maxHeight};
  margin: ${({ margin }) => margin};
  background: ${({ theme, color = theme.colors.blue, disabled = false }) =>
    disabled ? theme.colors.lightGray : color};
  ${({ hasShadow }) => hasShadow && BoxShadow}
  max-width: 100%;
  width: ${({ width }) => (width ? width : "auto")};
  ${Hover()} :hover {
    background: ${({ theme, disabled = false }) =>
      disabled && theme.colors.lightGray};
  }

  :focus {
    color: ${({ theme }) => theme.colors.lightGray};
  }
`;

export const ButtonText = styled.div`
  margin: auto;
  width: max-content;
  ${Heading4}
`;
