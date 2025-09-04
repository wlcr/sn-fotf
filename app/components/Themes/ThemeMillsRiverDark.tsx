import {Theme} from '@radix-ui/themes';

export type ThemeMillsRiverProps = {
  children?: React.ReactNode;
};

export default function ThemeMillsRiverDark({children}: ThemeMillsRiverProps) {
  return (
    <Theme
      accentColor="dryMalt"
      data-background-color="millsRiver"
      radius="none"
      appearance="dark"
    >
      {children}
    </Theme>
  );
}
