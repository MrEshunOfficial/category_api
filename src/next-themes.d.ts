declare module 'next-themes/dist/types' {
  import { ReactNode } from "react";

  export interface ThemeProviderProps {
    children: ReactNode;
    [key: string]: string | number | boolean | ReactNode;
  }
}
