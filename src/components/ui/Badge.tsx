import clsx from 'clsx';

export type BadgeVariant =
  | 'completed'
  | 'success'
  | 'confirmed'
  | 'info'
  | 'pending'
  | 'warning'
  | 'cancelled'
  | 'error'
  | 'in-progress'
  | 'default';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<BadgeVariant, { styles: string; dotColor: string }> = {
  completed: {
    styles: 'bg-[#22C55E]/15 text-[#16A34A] border-[#22C55E]/30',
    dotColor: 'bg-[#22C55E]',
  },
  success: {
    styles: 'bg-[#22C55E]/15 text-[#16A34A] border-[#22C55E]/30',
    dotColor: 'bg-[#22C55E]',
  },
  confirmed: {
    styles: 'bg-[#3B82F6]/15 text-[#2563EB] border-[#3B82F6]/30',
    dotColor: 'bg-[#3B82F6]',
  },
  info: {
    styles: 'bg-[#3B82F6]/15 text-[#2563EB] border-[#3B82F6]/30',
    dotColor: 'bg-[#3B82F6]',
  },
  pending: {
    styles: 'bg-[#FFB800]/15 text-[#B17C00] border-[#FFB800]/30',
    dotColor: 'bg-[#FFB800]',
  },
  warning: {
    styles: 'bg-[#FFB800]/15 text-[#B17C00] border-[#FFB800]/30',
    dotColor: 'bg-[#FFB800]',
  },
  cancelled: {
    styles: 'bg-[#EF4444]/15 text-[#DC2626] border-[#EF4444]/30',
    dotColor: 'bg-[#EF4444]',
  },
  error: {
    styles: 'bg-[#EF4444]/15 text-[#DC2626] border-[#EF4444]/30',
    dotColor: 'bg-[#EF4444]',
  },
  'in-progress': {
    styles: 'bg-[#FF6B00]/15 text-[#E55F00] border-[#FF6B00]/30',
    dotColor: 'bg-[#FF6B00]',
  },
  default: {
    styles: 'bg-[#E8E4DF] text-[#64748B] border-transparent',
    dotColor: 'bg-[#64748B]',
  },
};

function Badge({ variant = 'default', children, className }: BadgeProps) {
  const config = variantConfig[variant];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        config.styles,
        className
      )}
    >
      <span
        className={clsx('h-1.5 w-1.5 rounded-full shrink-0', config.dotColor)}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

export { Badge };
