// SVG imports with ?react suffix
declare module '*.svg?react' {
  import {FC, SVGProps} from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

// SVG imports as React components (via SVGR plugin)
declare module '*.svg' {
  import {FC, SVGProps} from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
  export const ReactComponent: FC<SVGProps<SVGElement>>;
}
