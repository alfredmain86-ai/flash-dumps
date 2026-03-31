import clsx from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverable?: boolean;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className, noPadding = false, hoverable = false }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-[#FEFEFE] rounded-2xl overflow-hidden transition-all duration-300',
        'border border-[rgba(0,0,0,0.06)]',
        '[box-shadow:0_1px_3px_rgba(26,26,26,0.08),0_4px_12px_rgba(26,26,26,0.04)]',
        hoverable && 'hover:-translate-y-0.5 hover:[box-shadow:0_4px_8px_rgba(26,26,26,0.12),0_8px_24px_rgba(26,26,26,0.08)] cursor-pointer',
        'dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.08)] dark:backdrop-blur-xl',
        !noPadding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div
      className={clsx(
        'border-b border-[rgba(0,0,0,0.06)] pb-4 mb-4',
        className
      )}
    >
      {children}
    </div>
  );
}

function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={clsx(
        'border-t border-[rgba(0,0,0,0.06)] pt-4 mt-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardFooter };
