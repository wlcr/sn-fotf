type JsonBlockProps = {
  block: any;
};

export default function JsonBlock({block}: JsonBlockProps) {
  return (
    <pre>
      <code>{JSON.stringify(block, null, 2)}</code>
    </pre>
  );
}
