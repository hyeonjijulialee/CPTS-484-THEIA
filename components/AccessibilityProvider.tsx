import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AccessibilitySettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  speak: (text: string, interrupt?: boolean) => void;
  vibrate: (pattern?: number | number[]) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const vibrate = (pattern: number | number[] = 50) => {
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const speak = (text: string, interrupt = true) => {
    if (!window.speechSynthesis) return;
    if (interrupt) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.voiceSpeed;
    utterance.lang = 'en-US'; 
    
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && (
        voice.name.includes('Google US English') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Zira') ||
        voice.name.toLowerCase().includes('female')
      )
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, speak, vibrate }}>
      <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};