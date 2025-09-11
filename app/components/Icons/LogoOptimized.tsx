/**
 * Fallback Logo Component
 *
 * This component only renders when no Sanity logo is configured in the Header.
 * The large logo SVG has been moved to Sanity CMS to reduce bundle size.
 * Previously: The 98KB logo.svg consumed 10% of the server bundle (101.9kb).
 */
export default function Logo() {
  return (
    <div className="fallback-logo">
      <span
        style={{
          fontFamily: 'var(--font-family-heading)',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: 'var(--color-dry-malt)',
          letterSpacing: '-0.02em',
        }}
      >
        Sierra Nevada
      </span>
      <div
        style={{
          fontSize: '0.75rem',
          color: 'var(--color-dry-malt)',
          opacity: 0.8,
          marginTop: '-0.25rem',
        }}
      >
        Friends of the Family
      </div>
    </div>
  );
}
