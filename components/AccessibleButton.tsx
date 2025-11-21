import React from 'react';
import { useAccessibility } from './AccessibilityProvider';

// Define button props extending standard HTML button attributes
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const AccessibleButton: React.FC<Props> = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  icon, 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  // Access accessibility tools from global context
  const { speak, vibrate, settings } = useAccessibility();

  // Trigger haptic feedback on click before executing the action
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    vibrate(50);
    if (onClick) onClick(e);
  };

  // Announce button label via TTS when focused
  const handleFocus = () => {
    speak(label, true);
  };

  // Base styles for layout, animation, and focus states
  let baseStyles = "relative overflow-hidden rounded-3xl font-bold transition-all duration-300 flex items-center justify-center gap-4 p-6 shadow-sm active:scale-[0.98] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-offset-2";
  
  // Apply dynamic font size from settings
  const textSize = settings.fontSize;
  let colorStyles = "";

  // Determine color scheme based on the variant prop
  switch (variant) {
    case 'primary':
      colorStyles = "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 focus:ring-indigo-500";
      break;
    case 'danger':
      colorStyles = "bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600 focus:ring-rose-500";
      break;
    case 'secondary':
      colorStyles = "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400";
      break;
    case 'ghost':
      colorStyles = "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300 shadow-none";
      break;
  }

  return (
    <button
      onClick={handleClick}
      onFocus={handleFocus}
      className={`${baseStyles} ${textSize} ${colorStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      aria-label={label}
      {...props}
    >
      {icon && <span className="scale-110 shrink-0 opacity-90">{icon}</span>}
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
};