// src/components/ui/cards/CardTitle.tsx
import { ReactNode } from "react";

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3
      className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}
    >
      {children}
    </h3>
  );
}
