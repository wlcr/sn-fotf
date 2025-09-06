import styles from './Button.module.css';

export type ButtonProps = {
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  appearance?: 'light' | 'dark';
  variant?: 'solid' | 'outline' | 'round' | 'text' | 'round-outline';
  children?: React.ReactNode;
};

export default function Button({
  disabled,
  appearance = 'dark',
  variant = 'solid',
  children,
}: ButtonProps) {
  let className = styles.Button;
  switch (`${appearance}-${variant}`) {
    case 'dark-solid':
      className = styles.ButtonDarkSolid;
      break;
    case 'dark-outline':
      className = styles.ButtonDarkOutline;
      break;
    case 'dark-round':
      className = styles.ButtonDarkRound;
      break;
    case 'dark-text':
      className = styles.ButtonDarkText;
      break;
    case 'light-solid':
      className = styles.ButtonLightSolid;
      break;
    case 'light-outline':
      className = styles.ButtonLightOutline;
      break;
    case 'light-round':
      className = styles.ButtonLightRound;
      break;
    case 'light-text':
      className = styles.ButtonLightText;
      break;
    case 'light-round-outline':
      className = styles.ButtonLightRoundOutline;
      break;
    default:
      break;
  }

  return (
    <button className={className} disabled={disabled}>
      {children}
    </button>
  );
}
