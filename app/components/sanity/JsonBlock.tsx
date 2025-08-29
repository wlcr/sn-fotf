type JsonBlockProps = {
  block: any;
};

/**
 * Simple component to display JSON data for debugging unknown block types
 */
export default function JsonBlock({block}: JsonBlockProps) {
  return (
    <div
      style={{
        padding: '1rem',
        background: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '4px',
        margin: '1rem 0',
      }}
    >
      <h4>Debug: Unknown Block Type</h4>
      <pre style={{fontSize: '12px', overflow: 'auto'}}>
        <code>{JSON.stringify(block, null, 2)}</code>
      </pre>
    </div>
  );
}
