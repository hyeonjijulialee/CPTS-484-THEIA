import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../components/AccessibilityProvider';
import { Navbar } from '../components/Navbar';
import { AccessibleButton } from '../components/AccessibleButton';
import { FontSize } from '../types';
import { Type, Smartphone, Volume2, User, Save, MapPin, Zap } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateSettings, speak, vibrate } = useAccessibility();

  // Local state for form inputs (Emergency Contact)
  const [contactName, setContactName] = useState(settings.emergencyContactName);
  const [contactPhone, setContactPhone] = useState(settings.emergencyContactPhone);

  // Sync local state with global settings when they change
  useEffect(() => {
      setContactName(settings.emergencyContactName);
      setContactPhone(settings.emergencyContactPhone);
  }, [settings.emergencyContactName, settings.emergencyContactPhone]);

  // Adjust TTS speed and announce change
  const handleVoiceSpeed = (speed: number) => {
    updateSettings({ voiceSpeed: speed });
    speak(`Speed ${speed}x`);
  };

  // Adjust global font size and confirm
  const handleFontSize = (size: FontSize) => {
    updateSettings({ fontSize: size });
    speak("Text size adjusted");
  };

  // Save contact details to global context
  const handleSaveContact = () => {
      updateSettings({ 
          emergencyContactName: contactName, 
          emergencyContactPhone: contactPhone 
      });
      vibrate(50);
      speak("Emergency contact saved.");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar title="Settings" />
      
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto max-w-lg mx-auto w-full pb-10">
        
        {/* 1. Text Size Controls */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4 opacity-60">
                <Type size={20} />
                <h2 className="font-bold text-sm uppercase tracking-widest">Text Size</h2>
            </div>
            
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                {[FontSize.SMALL, FontSize.MEDIUM, FontSize.LARGE, FontSize.EXTRA_LARGE].map((size, idx) => (
                    <button
                        key={size}
                        onClick={() => handleFontSize(size)}
                        className={`flex-1 py-4 rounded-xl flex items-center justify-center transition-all duration-200
                            ${settings.fontSize === size 
                                ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5 scale-[1.02]' 
                                : 'text-slate-400 hover:text-slate-600'
                            }
                        `}
                    >
                        {/* Visual representation of size increasing */}
                        <span className={
                            idx === 0 ? 'text-sm font-medium' : 
                            idx === 1 ? 'text-base font-bold' : 
                            idx === 2 ? 'text-xl font-black' : 
                            'text-2xl font-black'
                        }>A</span>
                    </button>
                ))}
            </div>
        </section>

        {/* 2. Voice Speed Slider */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4 opacity-60">
                <Volume2 size={20} />
                <h2 className="font-bold text-sm uppercase tracking-widest">Voice Speed</h2>
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between px-2 mb-2 font-bold text-slate-400 text-sm">
                    <span>Slow</span>
                    <span>Fast</span>
                </div>
                <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.25"
                    value={settings.voiceSpeed}
                    onChange={(e) => handleVoiceSpeed(parseFloat(e.target.value))}
                    className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="text-center font-bold text-indigo-600 text-xl mt-2">{settings.voiceSpeed}x</div>
            </div>
        </section>

        {/* 3. Feature Toggles (Vibration & Location) */}
        <div className="flex flex-col gap-3">
            {/* Vibration Toggle */}
            <section className="bg-white p-1 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <button 
                    onClick={() => {
                        const newVal = !settings.vibrationEnabled;
                        updateSettings({ vibrationEnabled: newVal });
                        speak(`Vibration ${newVal ? 'On' : 'Off'}`);
                    }}
                    className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${settings.vibrationEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Zap size={24} />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-lg text-slate-900">Vibration</div>
                            <div className="text-sm text-slate-500 font-medium">Haptic feedback</div>
                        </div>
                    </div>
                    
                    {/* Custom Switch UI */}
                    <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${settings.vibrationEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${settings.vibrationEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                    </div>
                </button>
            </section>

            {/* Location Sharing Toggle */}
            <section className="bg-white p-1 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <button 
                    onClick={() => {
                        const newVal = !settings.locationSharingEnabled;
                        updateSettings({ locationSharingEnabled: newVal });
                        speak(`Location Sharing ${newVal ? 'On' : 'Off'}`);
                    }}
                    className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${settings.locationSharingEnabled ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                            <MapPin size={24} />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-lg text-slate-900">Location Sharing</div>
                            <div className="text-sm text-slate-500 font-medium">Send location in emergency</div>
                        </div>
                    </div>
                    
                    <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${settings.locationSharingEnabled ? 'bg-rose-500' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${settings.locationSharingEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                    </div>
                </button>
            </section>
        </div>

        {/* 4. Emergency Contact Form */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-3 mb-6 opacity-60">
                <User size={20} />
                <h2 className="font-bold text-sm uppercase tracking-widest">Emergency Contact</h2>
            </div>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Name</label>
                    <input 
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Contact Name"
                        className="w-full p-4 bg-slate-50 rounded-xl font-bold text-lg border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all outline-none text-slate-900 placeholder:text-slate-300"
                    />
                </div>

                <div>
                     <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                    <input 
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="w-full p-4 bg-slate-50 rounded-xl font-bold text-lg border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all outline-none text-slate-900 placeholder:text-slate-300"
                    />
                </div>
                
                <div className="pt-2">
                     <AccessibleButton 
                        label="Save Contact"
                        icon={<Save size={20} />}
                        onClick={handleSaveContact}
                        fullWidth
                        className="shadow-indigo-100"
                    />
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default Settings;