// src/components/common/Badge/Badge.tsx
import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary";
}

const variants = {
  default: "bg-blue-100 text-blue-800 border border-blue-200",
  secondary: "bg-green-100 text-green-800 border border-green-200",
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