import clsx from 'clsx';
import styles from './Button.module.css';

const Button = (props) => {
    return (
        <button 
            onClick={props.onClick}
            className={clsx(
                styles.root,
                // ---- size
                props.size === 'small' && styles.sizeSmall,
                props.size === 'medium' && styles.sizeMedium,
                props.size === 'large' && styles.sizeLarge,
                // --- type
                props.type === 'primary' && styles.typePrimary,
                props.type === 'error' && styles.typeError,
                props.type === 'gray' && styles.typeGray,
                // --- variant
                props.variant === 'fill' && styles.variantFill,
                props.variant === 'outline' && styles.variantOutline,
            )}>
                {props.children}
        </button>
    );
};

export default Button;