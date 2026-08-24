import React from 'react';

export default function LoadingState({ message = 'Loading system intelligence data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute w-12 h-12 rounded-full border-4 border-accent-blue/10 animate-pulse"></div>
        <div className="absolute w-12 h-12 rounded-full border-4 border-t-accent-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-surface-200">{message}</p>
      <div className="mt-2 flex gap-1.5 justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan/80 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan/80 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan/80 animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
