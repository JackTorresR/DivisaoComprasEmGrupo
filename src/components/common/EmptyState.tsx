import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="empty-state">
    <p className="empty-state__title">{title}</p>
    <p className="empty-state__description">{description}</p>
    {action}
  </div>
);
