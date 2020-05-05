import styled, { keyframes } from "styled-components";

const RotateAnimation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const DashAnimation = keyframes`
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -32px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -100px;
  }
`;

interface LoadingSpinnerWrapperProps {
  margin: string;
  size: number;
}

export const LoadingSpinnerWrapper = styled.div<LoadingSpinnerWrapperProps>`
  position: relative;
  overflow: hidden;
  margin: ${({ margin }) => margin};
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  content: "";
`;

interface CircularSvgProps {
  size: number;
}

export const CircularSvg = styled.svg`
  animation: ${RotateAnimation} 2s linear infinite;
  transform-origin: center center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`;

export const CircleSvgSpinner = styled.circle`
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: ${DashAnimation} 2.5s ease-in-out infinite;
  stroke-linecap: square;
  stroke-width: ${({ strokeWidth }) => strokeWidth}px;
  stroke: ${({ theme, color }) => (color ? color : theme.colors.blue)};
  z-index: 5;
`;

export const CircleSvgBackground = styled.circle`
  stroke-width: ${({ strokeWidth }) => strokeWidth}px;
  stroke: ${({ theme, color }) => (color ? color : theme.colors.lightGray)};
  z-index: 2;
`;
