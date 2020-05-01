export const InterFont = `Inter, -apple-system, BlinkMacSystemFont, San Francisco, Roboto, Segoe UI, Helvetica Neue, sans-serif`;
export const AndersonFont = `'Anderson Grotesk', -apple-system, BlinkMacSystemFont, San Francisco, Roboto, Segoe UI, Helvetica Neue, sans-serif`;

/* Fonts */
export const Heading1 = `
  font-family: ${AndersonFont};
  font-size: 40px;
  font-weight: 800;
`;

export const Heading2 = `
  font-family: ${AndersonFont};
  font-size: 32px;
  font-weight: 800;
`;

export const Heading3 = `
  font-family: ${AndersonFont};
  font-size: 20px;
  font-weight: 600;
`;

export const Heading4 = `
  font-family: ${AndersonFont};
  font-size: 18px;
  font-weight: 600;
`;

export const Body = `
  font-family: ${InterFont};
  font-weight: 400;
  font-size: 16px;
`;

export const BoxShadow = `
  box-shadow: 0px 4px 7px rgba(236, 237, 237, 0.6),
  0px 0px 7px rgba(142, 147, 148, 0.5);
`;

export const HoverTransition = (target = "all", time = "0.1s") => `
  transition: ${target} ${time} ease-in;
`;

export const Hover = (darker = false) => `
  ${HoverTransition()}
  &:hover, &:focus {
    cursor: pointer;
    filter: brightness(${darker ? "60%" : "85%"});
  }
`;
