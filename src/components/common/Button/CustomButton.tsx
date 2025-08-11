'use client';

import React from 'react';
import Link from 'next/link';

interface CustomButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-bold text-white cursor-pointer
    transition-all duration-300 ease-in-out
    transform hover:scale-105 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:scale-100 disabled:active:scale-100
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'focus:ring-blue-500',
    secondary: 'focus:ring-gray-500',
    outline: 'focus:ring-green-500',
  };

  const buttonStyle = {
    backgroundImage: `url('/btn.png')`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: size === 'sm' ? '40px' : size === 'md' ? '48px' : '56px',
    minWidth: size === 'sm' ? '120px' : size === 'md' ? '140px' : '160px',
  };

  const buttonContent = (
    <div
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={buttonStyle}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <span className="relative z-10 px-2 text-center">
        {children}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className="p-0 border-0 bg-transparent outline-none cursor-pointer border-none  pb-[20px]"
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
};

export default CustomButton;
