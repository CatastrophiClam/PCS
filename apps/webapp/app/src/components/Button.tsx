import React from "react";

import { ButtonWrapper, ButtonText } from "./styles/Button";

interface ButtonProps {
  children: any;
  color?: string;
  hoverColor?: string;
  borderColor?: string;
  width?: string;
  margin?: string;
  padding?: string;
  handleClick?: (event: React.MouseEvent) => void;
  height?: number;
  maxHeight?: string;
  hasShadow?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  children,
  color,
  hoverColor,
  borderColor,
  width = "auto",
  margin = "0",
  padding = "8px 32px",
  handleClick = (event) => {},
  height = 48,
  maxHeight = "100%",
  hasShadow = true,
  disabled = false,
  type = "button",
}: ButtonProps) => {
  return (
    <ButtonWrapper
      height={height}
      onClick={handleClick}
      disabled={disabled}
      color={color}
      hoverColor={hoverColor}
      borderColor={borderColor}
      hasShadow={hasShadow}
      margin={margin}
      padding={padding}
      width={width}
      maxHeight={maxHeight}
      onMouseDown={(e) => e.preventDefault()}
      type={type}
    >
      <ButtonText>{children}</ButtonText>
    </ButtonWrapper>
  );
};

export default Button;
