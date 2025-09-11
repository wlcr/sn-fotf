import {type OptimisticCartLineInput} from '@shopify/hydrogen';
import Button from './Button/Button';
import {Spinner} from './Icons/Spinner';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  loading,
  loadingText,
  onClick,
  variant = 'solid',
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  loading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  variant?:
    | 'text'
    | 'solid'
    | 'outline'
    | 'round'
    | 'round-outline'
    | undefined;
}) {
  return (
    <>
      <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />

      <Button
        type="submit"
        onClick={onClick}
        disabled={disabled}
        variant={variant}
        width="full"
      >
        {loading ? (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center',
            }}
          >
            <Spinner size={16} />
            {loadingText || 'Adding...'}
          </span>
        ) : (
          children
        )}
      </Button>
    </>
  );
}
