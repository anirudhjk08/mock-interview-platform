"use client";

import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}) {
  const baseStyle =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 focus:ring-offset-[#0f0f0f] active:scale-[0.98]';

  const variants = {
    primary:
      'bg-[#6366f1] text-white hover:bg-[#5053e1] shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 disabled:bg-[#6366f1]/50 disabled:shadow-none disabled:active:scale-100',
    secondary:
      'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] border border-[#2a2a2a] hover:border-[#3a3a3a] disabled:opacity-50 disabled:active:scale-100',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
