import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AccessibilitySettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

// Define the shape of the context state and functions
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  speak: (text: string, interrupt?: boolean) => void;
  vibrate: (pattern?: number | number[]) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with default accessibility settings
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  // Merge new settings into the existing state
  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Trigger device vibration if enabled in settings
  const vibrate = (pattern: number | number[] = 50) => {
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  // Handle Text-to-Speech logic
  const speak = (text: string, interrupt = true) => {
    if (!window.speechSynthesis) return; // Exit if TTS is unavailable
    
    // Stop any currently speaking audio if interrupt is true
    if (interrupt) {
      window.speechSynthesis.cancel();
    }

    // Configure speech parameters
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.voiceSpeed;
    utterance.lang = 'en-US'; 
    
    // English + Female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && (
        voice.name.includes('Google US English') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Zira') ||
        voice.name.toLowerCase().includes('female')
      )
    );

    // Apply the selected voice if found
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, speak, vibrate }}>
      {/* Wrapper div applying global base styles and transitions */}
      <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

// Custom hook to access the context safely
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};