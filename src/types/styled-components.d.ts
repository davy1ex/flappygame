import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    // Add your theme properties here if needed
  }
  
  export function createGlobalStyle(
    strings: TemplateStringsArray,
    ...interpolations: any[]
  ): React.ComponentType<any>;
} 