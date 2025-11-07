import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      text: string;
      subtext: string;
      bg: string;
      surface: string;
      border: string;
      primary: string;
    };
    spacing: (n: number) => string;
    radius: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}
