import React from 'react'

export function Button({ className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold transition disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
