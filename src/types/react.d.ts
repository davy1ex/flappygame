declare module 'react' {
  export = React;
  export as namespace React;

  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  interface JSXElementConstructor<P> {
    (props: P): ReactElement<any, any> | null;
  }
}

declare module 'react-dom/client' {
  import { ReactNode } from 'react';
  
  interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;
}

declare module 'react/jsx-runtime' {
  export = ReactJSXRuntime;
  export as namespace ReactJSXRuntime;
} 