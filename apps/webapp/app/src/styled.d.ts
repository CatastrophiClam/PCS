// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      blue: string;
      lightRed: string;
      red: string;
      darkRed: string;
      lightPurple: string;
      purple: string;
      darkPurple: string;
      lightGray: string;
      gray: string;
      darkGray: string;
      lightYellow: string;
      yellow: string;
      darkYellow: string;
    };
  }
}
