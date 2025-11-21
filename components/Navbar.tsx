import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

export const Navbar: React.FC<{ title: string }> = ({ title }) => {
  // Initialize router hooks and accessibility context
  const navigate = useNavigate();
  const location = useLocation();
  const { vibrate, settings } = useAccessibility();

  // Check current path to conditionally hide buttons
  const isHome = location.pathname === '/';
  const isSettings = location.pathname === '/settings';

  // Navigate to Home with haptic feedback
  const handleHome = () => {
    vibrate(50);
    navigate('/');
  };

  // Navigate to Settings with haptic feedback
  const handleSettings = () => {
    vibrate(50);
    navigate('/settings');
  };

  return (
    // Sticky header with backdrop blur (glass effect)
    <header className="p-5 flex items-center justify-between sticky top-0 z-50 bg-slate-50/95 backdrop-blur-sm">
      <div className="w-12 h-12 flex items-center justify-center">
        {/* Left slot: Show Home button only if not on Home page */}
        {!isHome && (
          <button 
            onClick={handleHome} 
            className="p-3 rounded-2xl text-slate-700 hover:bg-white hover:shadow-sm transition-all active:scale-95"
            aria-label="Home"
          >
            <Home size={28} strokeWidth={2.5} />
          </button>
        )}
      </div>
      
      {/* Title with dynamic font size from settings */}
      <h1 className={`${settings.fontSize} font-extrabold text-slate-900 tracking-tight truncate mx-4`}>
        {title}
      </h1>
      
      <div className="w-12 h-12 flex items-center justify-center">
        {/* Right slot: Show Settings button only if not on Settings page */}
        {!isSettings && (
             <button 
             onClick={handleSettings} 
             className="p-3 rounded-2xl text-slate-700 hover:bg-white hover:shadow-sm transition-all active:scale-95"
             aria-label="Settings"
           >
             <Settings size={28} strokeWidth={2.5} />
           </button>
        )}
      </div>
    </header>
  );
};