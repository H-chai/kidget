import { ReactNode } from 'react';
import './ui.css';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`card ${className}`.trim()}>{children}</div>
);
