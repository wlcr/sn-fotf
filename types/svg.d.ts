// SVG imports with ?react suffix
declare module '*.svg?react' {
  import {FC, SVGProps} from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

// SVG imports as URLs
declare module '*.svg' {
  const content: string;
  export default content;
}
