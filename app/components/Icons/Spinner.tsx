export function Spinner({
  className = '',
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z"
      />
    </svg>
  );
}
