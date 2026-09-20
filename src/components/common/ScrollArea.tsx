import type { ReactNode } from "react";

type ScrollAreaProps = {
  label: string;
  children: ReactNode;
  size: "sm" | "md" | "lg" | "xl";
};

export const ScrollArea = ({ label, size, children }: ScrollAreaProps) => (
  <div
    tabIndex={0}
    role="region"
    aria-label={label}
    className={`scroll-area scroll-area--${size}`}
  >
    {children}
  </div>
);
