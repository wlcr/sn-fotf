import {Box} from '@radix-ui/themes';

type JsonBlockProps = {
  block: any;
};

export default function JsonBlock({block}: JsonBlockProps) {
  return (
    <Box>
      <pre>
        <code>{JSON.stringify(block, null, 2)}</code>
      </pre>
    </Box>
  );
}
