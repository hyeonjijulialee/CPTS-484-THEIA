import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, XOctagon, ShieldAlert, MapPin } from 'lucide-react';
import { AccessibleButton } from '../components/AccessibleButton';
import { useAccessibility } from '../components/AccessibilityProvider';
import { Navbar } from '../components/Navbar';

const Emergency: React.FC = () => {
  const navigate = useNavigate();
  const { speak, vibrate, settings } = useAccessibility();
  
  // State for countdown timer and UI modes (active countdown vs sent success)
  const [countdown, setCountdown] = useState(5);
  const [active, setActive] = useState(false);
  const [sent, setSent] = useState(false);

  // Start 5-second countdown before sending alert
  const handleEmergencyTrigger = (type: 'Security' | 'Contact') => {
    setActive(true);
    const msg = type === 'Security' ? "Calling Security" : "Alerting Contact";
    speak(`${msg} in 5 seconds.`);
    let count = 5;
    
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count > 0) {
        speak(`${count}`);
        vibrate(100);
      } else {
        clearInterval(interval);
        sendAlert();
      }
    }, 1000);

    // Store interval ID globally to allow cancellation
    (window as any).emergencyInterval = interval;
  };

  // Trigger final alert with strong vibration and audio confirmation
  const sendAlert = () => {
    setSent(true);
    vibrate([200, 100, 200, 100, 500]);
    speak("Alert sent. Help is on the way.");
  };

  // Abort the countdown and reset to initial state
  const cancelEmergency = () => {
    const interval = (window as any).emergencyInterval;
    if (interval) clearInterval(interval);
    setActive(false);
    setCountdown(5);
    speak("Emergency alert cancelled.");
  };

  // Announce screen entry and cleanup timers on unmount
  useEffect(() => {
      if (!active && !sent) {
          speak("Emergency mode.");
      }
      return () => {
          const interval = (window as any).emergencyInterval;
          if (interval) clearInterval(interval);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1. Render Success Screen (Alert Sent)
  if (sent) {
      return (
        <div className="flex flex-col h-screen p-8 items-center justify-center text-center bg-rose-600 text-white">
            <div className="bg-white/20 p-8 rounded-full mb-8 animate-pulse">
                <ShieldAlert size={80} />
            </div>
            <h1 className="text-4xl font-black mb-2">HELP SENT</h1>
            <p className="text-xl font-medium opacity-90 mb-12">Security has been notified.</p>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl w-full mb-12 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2 opacity-80">
                    <MapPin size={20} />
                    <span className="font-bold uppercase tracking-wider text-sm">Location Shared</span>
                </div>
                <p className="text-2xl font-bold">Engineering Bldg, Floor 3</p>
            </div>

            <AccessibleButton 
                label="Return Home"
                onClick={() => navigate('/')} 
                className="w-full h-20 text-xl bg-white text-rose-600 border-none shadow-xl hover:bg-gray-50"
            />
        </div>
      )
  }

  // 2. Render Countdown Screen
  if (active) {
      return (
        <div className="flex flex-col h-screen bg-slate-900 items-center justify-center p-8">
            <div className="w-72 h-72 rounded-full border-[16px] border-rose-500/30 flex items-center justify-center mb-12 relative">
                 <div className="absolute inset-0 rounded-full border-[16px] border-rose-500 border-r-transparent rotate-45" style={{ transition: 'all 1s linear' }}></div>
                 <h1 className="text-[10rem] font-black text-white leading-none">{countdown}</h1>
            </div>
            
            <p className="text-2xl text-white font-bold text-center mb-12 uppercase tracking-widest opacity-80">Sending Alert...</p>
            
            <AccessibleButton 
                label="CANCEL"
                onClick={cancelEmergency} 
                icon={<XOctagon size={32} />}
                className="bg-red-600 text-white w-full h-24 text-2xl font-black shadow-2xl hover:bg-red-700"
            />
        </div>
      );
  }

  // 3. Render Main Emergency Dashboard
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar title="Emergency" />
      
      <div className="flex-1 p-6 flex flex-col gap-6 justify-center max-w-lg mx-auto w-full">
        
        {/* Current Location Info Card */}
        <div className="bg-white p-8 rounded-[2.5rem] text-center shadow-sm border border-slate-100">
             <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} />
             </div>
             <p className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-2">Current Location</p>
             <p className={`${settings.fontSize} font-black text-slate-900`}>WSU Hall</p>
             <p className="text-lg font-bold text-slate-500">Floor 4, near Room 427</p>
        </div>

        {/* Action Buttons */}
        <div className="flex-1 flex flex-col gap-5 justify-center pb-12">
            <AccessibleButton
                label="Call Security"
                icon={<ShieldAlert size={32} />}
                variant="danger"
                onClick={() => handleEmergencyTrigger('Security')}
                fullWidth
                className="flex-1 text-2xl shadow-rose-200 shadow-xl"
            />
            
            <AccessibleButton
                label="Alert Contact"
                icon={<Phone size={32} />}
                variant="secondary"
                onClick={() => handleEmergencyTrigger('Contact')}
                fullWidth
                className="h-32 text-xl"
            />
        </div>
      </div>
    </div>
  );
};

export default Emergency;