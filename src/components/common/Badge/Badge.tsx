// src/components/common/Badge/Badge.tsx
import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive";
}

const variants = {
  default: "bg-pink-100 text-pink-800 border border-pink-200",
  secondary: "bg-red-100 text-[9px] sm:text-sm md:text-base text-red-800 border border-red-200",
  destructive: "bg-green-100 text-green-800 border border-green-200",
};

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "default",
  children,
  ...props
}) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full font-medium text-xs ${variants[variant]} ${className}`}
    {...props}
  >
    {children}
  </span>
);