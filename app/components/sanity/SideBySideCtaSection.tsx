import {ImageContentSection, SideBySideCta} from 'studio/sanity.types';
import {Box, Flex, Grid} from '@radix-ui/themes';
import Cta from './Cta';

type SideBySideCtaBlockProps = {
  block: SideBySideCta;
  index: number;
};

export default function SideBySideCtaBlock({block}: SideBySideCtaBlockProps) {
  return (
    <Box>
      <Grid columns={{initial: '1', md: '2'}} justify="center" align="center">
        <Cta block={block.sideA} index={1} />
        <Cta block={block.sideB} index={2} />
      </Grid>
    </Box>
  );
}
