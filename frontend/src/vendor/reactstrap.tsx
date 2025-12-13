import React, { ElementType, HTMLAttributes, ReactNode } from 'react';

const classNames = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(' ');

type Breakpoint = string | number | undefined;

const colClass = (prefix: string, value: Breakpoint) =>
  value ? `${prefix}-${value}` : undefined;

interface TagProps {
  tag?: ElementType;
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const Container = ({
  className,
  fluid,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { fluid?: boolean }) => (
  <div
    className={classNames(fluid ? 'container-fluid' : 'container', className)}
    {...rest}
  />
);

export const Row = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('row', className)} {...rest} />
);

export const Col = ({
  className,
  sm,
  md,
  lg,
  xl,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  sm?: Breakpoint;
  md?: Breakpoint;
  lg?: Breakpoint;
  xl?: Breakpoint;
}) => (
  <div
    className={classNames(
      'col',
      colClass('col-sm', sm),
      colClass('col-md', md),
      colClass('col-lg', lg),
      colClass('col-xl', xl),
      className
    )}
    {...rest}
  />
);

export const Navbar = ({
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLElement>) => (
  <nav className={classNames('navbar', className)} {...rest}>
    {children}
  </nav>
);

export const NavbarBrand = ({
  tag: Tag = 'a',
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLElement>) => (
  <Tag className={classNames('navbar-brand', className)} {...rest}>
    {children}
  </Tag>
);

export const Nav = ({
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLUListElement>) => (
  <ul className={classNames('nav', 'navbar-nav', className)} {...rest}>
    {children}
  </ul>
);

export const NavItem = ({
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLLIElement>) => (
  <li className={classNames('nav-item', className)} {...rest}>
    {children}
  </li>
);

export const NavLink = ({
  tag: Tag = 'a',
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLElement>) => (
  <Tag className={classNames('nav-link', className)} {...rest}>
    {children}
  </Tag>
);

export const Button = ({
  tag: Tag = 'button',
  className,
  color = 'primary',
  outline,
  children,
  ...rest
}: TagProps &
  HTMLAttributes<HTMLElement> & { color?: string; outline?: boolean }) => (
  <Tag
    className={classNames(
      'btn',
      outline ? `btn-outline-${color}` : `btn-${color}`,
      className
    )}
    {...rest}
  >
    {children}
  </Tag>
);

export const Badge = ({
  className,
  color = 'dark',
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLSpanElement> & { color?: string }) => (
  <span
    className={classNames('badge', `text-bg-${color}`, className)}
    {...rest}
  >
    {children}
  </span>
);

export const Card = ({
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('card', className)} {...rest}>
    {children}
  </div>
);

export const CardBody = ({
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('card-body', className)} {...rest}>
    {children}
  </div>
);

export const CardTitle = ({
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLElement>) => (
  <h5 className={classNames('card-title', className)} {...rest}>
    {children}
  </h5>
);

export const CardSubtitle = ({
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLElement>) => (
  <h6
    className={classNames('card-subtitle', 'mb-2', 'text-muted', className)}
    {...rest}
  >
    {children}
  </h6>
);

export const CardText = ({
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLElement>) => (
  <p className={classNames('card-text', className)} {...rest}>
    {children}
  </p>
);

export const Form = ({
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLFormElement>) => (
  <form className={classNames(className)} {...rest}>
    {children}
  </form>
);

export const FormGroup = ({
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('mb-3', className)} {...rest}>
    {children}
  </div>
);

export const Label = ({
  className,
  children,
  ...rest
}: TagProps & React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={classNames('form-label', className)} {...rest}>
    {children}
  </label>
);

type InputProps = {
  type?: string;
  children?: ReactNode;
  className?: string;
} & Record<string, unknown>;

export const Input = ({
  className,
  type = 'text',
  children,
  ...rest
}: InputProps) => {
  if (type === 'select') {
    return (
      <select
        className={classNames('form-select', className)}
        {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        {children}
      </select>
    );
  }

  if (type === 'textarea') {
    return (
      <textarea
        className={classNames('form-control', className)}
        {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      >
        {children}
      </textarea>
    );
  }

  return (
    <input
      type={type}
      className={classNames('form-control', className)}
      {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );
};

export const CardFooter = ({
  className,
  children,
  ...rest
}: TagProps & HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('card-footer', className)} {...rest}>
    {children}
  </div>
);
