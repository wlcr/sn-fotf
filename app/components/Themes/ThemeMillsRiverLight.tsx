import {Theme} from '@radix-ui/themes';

export type ThemeMillsRiverProps = {
  children?: React.ReactNode;
};

export default function ThemeMillsRiverLight({children}: ThemeMillsRiverProps) {
  return (
    <Theme
      accentColor="millsRiver"
      data-background-color="foamWhite"
      radius="none"
      appearance="light"
    >
      {children}
    </Theme>
  );
}
