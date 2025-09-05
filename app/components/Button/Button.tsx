import styles from './Button.module.css';

export type ButtonProps = {
  label: string;
  appearance: 'light' | 'dark';
  variant: 'solid' | 'outline' | 'round' | 'text' | 'round-outline';
};

export default function Button({label, appearance, variant}: ButtonProps) {
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

  return <button className={className}>{label}</button>;
}
