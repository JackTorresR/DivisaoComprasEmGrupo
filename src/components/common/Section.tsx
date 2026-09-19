import { useId, type ReactNode } from 'react';

type SectionProps = {
  id?: string;
  title: string;
  step?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export const Section = ({ id, title, step, description, actions, children }: SectionProps) => {
  const titleId = useId();
  return (
    <section id={id} className="card" aria-labelledby={titleId}>
      <header className="card__header">
        <div className="card__heading">
          {step && <span className="step-badge">{step}</span>}
          <div>
            <h2 id={titleId} className="card__title">
              {title}
            </h2>
            {description && <p className="card__description">{description}</p>}
          </div>
        </div>
        {actions && <div className="card__actions">{actions}</div>}
      </header>
      {children}
    </section>
  );
};
