'use client';

import {
  type ButtonHTMLAttributes,
  forwardRef,
  isValidElement,
  cloneElement,
  type ReactElement,
} from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      asChild = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles =
      'inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]';

    const variantStyles: Record<string, string> = {
      primary:
        'bg-[#FF6B00] text-white hover:bg-[#E55F00] hover:shadow-lg focus:ring-[#FF6B00]/50 shadow-md',
      secondary:
        'bg-transparent border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white focus:ring-[#FF6B00]/50',
      outline:
        'border-2 border-[#1A1A1A] text-[#1A1A1A] bg-transparent hover:bg-[#1A1A1A] hover:text-white focus:ring-[#1A1A1A]/50',
      ghost:
        'text-[#1A1A1A] bg-transparent hover:bg-[#1A1A1A]/10 focus:ring-[#1A1A1A]/50',
    };

    const sizeStyles: Record<string, string> = {
      sm: 'text-sm px-4 py-2 gap-1.5 min-h-[40px]',
      md: 'text-base px-5 py-2.5 gap-2 min-h-[48px]',
      lg: 'text-lg px-7 py-3.5 gap-2.5 min-h-[52px]',
    };

    const combinedClassName = clsx(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      className
    );

    // asChild: render the child element with button styles instead of a <button>
    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<Record<string, unknown>>, {
        className: clsx(
          combinedClassName,
          (children as ReactElement<{ className?: string }>).props.className
        ),
        ref,
      });
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={combinedClassName}
        {...props}
      >
        {loading && (
          <Loader2
            className={clsx(
              'animate-spin',
              size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
            )}
          />
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
