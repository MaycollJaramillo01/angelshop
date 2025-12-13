import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export const Card = ({
  children,
  className,
  title,
  description,
  actions
}: CardProps) => {
  return (
    <article className={`card ${className ?? ''}`}>
      {(title || description || actions) && (
        <header className="card-header">
          <div>
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </header>
      )}
      <div className="card-body">{children}</div>
    </article>
  );
};
