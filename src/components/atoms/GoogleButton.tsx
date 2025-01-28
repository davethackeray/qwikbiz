import React from 'react';
import Image from 'next/image';

interface GoogleButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function GoogleButton({ onClick, disabled = false, loading = false }: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center w-full
        px-4 py-2 space-x-3 text-gray-600 
        bg-white border border-gray-300 rounded-md
        shadow-sm hover:bg-gray-50 focus:outline-none 
        focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
      `}
      aria-label="Sign in with Google"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      ) : (
        <>
          <Image
            src="/google-logo.svg"
            alt="Google logo"
            width={20}
            height={20}
            priority
          />
          <span className="text-sm font-medium">
            Sign in with Google
          </span>
        </>
      )}
    </button>
  );
}
