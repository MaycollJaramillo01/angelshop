import {
  ButtonHTMLAttributes,
  forwardRef,
  FormHTMLAttributes,
  InputHTMLAttributes,
  ReactNode
} from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  stacked?: boolean;
}

export const Form = ({
  children,
  className,
  stacked = true,
  ...props
}: FormProps) => (
  <form
    className={`form ${stacked ? 'form-stacked' : ''} ${className ?? ''}`}
    {...props}
  >
    {children}
  </form>
);

interface FormGroupProps {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}

export const FormGroup = ({
  label,
  htmlFor,
  hint,
  children
}: FormGroupProps) => (
  <div className="form-group">
    <label htmlFor={htmlFor} className="form-label">
      {label}
    </label>
    {children}
    {hint && <p className="form-hint">{hint}</p>}
  </div>
);

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={`input ${className ?? ''}`} {...props} />;
});

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost';
}

export const Button = ({
  className,
  children,
  variant = 'solid',
  ...props
}: ButtonProps) => (
  <button className={`button ${variant} ${className ?? ''}`} {...props}>
    {children}
  </button>
);

interface BadgeProps {
  children: ReactNode;
  tone?: 'muted' | 'success' | 'danger';
}

export const Badge = ({ children, tone = 'muted' }: BadgeProps) => (
  <span className={`badge ${tone}`}>{children}</span>
);
