import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pause, Play, X, AlertOctagon, ArrowUp, MapPin } from 'lucide-react';
import { AccessibleButton } from '../components/AccessibleButton';
import { useAccessibility } from '../components/AccessibilityProvider';
import { Navbar } from '../components/Navbar';
import { Destination, NavigationStatus } from '../types';
import { NAVIGATION_STEPS } from '../constants';

const Navigation: React.FC = () => {
  // Initialize hooks for routing, accessibility, and state
  const { state } = useLocation();
  const navigate = useNavigate();
  const destination = (state as any)?.destination as Destination;
  const { speak, vibrate, settings } = useAccessibility();
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSpokenIndex = useRef<number>(-1);

  const [status, setStatus] = useState<NavigationStatus>(NavigationStatus.NAVIGATING);
  const [progress, setProgress] = useState(0);
  const [distance, setDistance] = useState(150); // feet
  const [showObstacleAlert, setShowObstacleAlert] = useState(false);

  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!destination) {
      navigate('/');
      return;
    }
    
    // Initialize rear-facing AR camera stream
    let stream: MediaStream | null = null;
    const startCamera = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error", err);
            speak("Camera unavailable. Using audio guidance.");
        }
    };
    startCamera();

    speak(`Navigating to ${destination.name}. Starting camera view.`);
    startNavigation();

    // Simulate an obstacle detection after 8 seconds
    const obstacleTimer = setTimeout(() => {
        triggerObstacleAlert();
    }, 8000);

    // Cleanup: stop navigation loop and camera stream
    return () => {
        stopNavigation();
        clearTimeout(obstacleTimer);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start the simulation loop (distance decrease, progress increase)
  const startNavigation = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    
    progressInterval.current = setInterval(() => {
      setDistance(prev => {
        if (prev <= 0) {
          completeNavigation();
          return 0;
        }
        return prev - 2; // Simulate walking speed (2ft/sec)
      });

      setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 1.5;
      });

    }, 1000);
  };

  const stopNavigation = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Handle arrival state
  const completeNavigation = () => {
    stopNavigation();
    setStatus(NavigationStatus.ARRIVED);
    speak("You have arrived at your destination.");
    vibrate([100, 50, 100, 50, 100]);
  };

  // Toggle between Pause and Resume states
  const togglePause = () => {
    if (status === NavigationStatus.NAVIGATING) {
      setStatus(NavigationStatus.PAUSED);
      stopNavigation();
      speak("Navigation paused.");
    } else if (status === NavigationStatus.PAUSED) {
      setStatus(NavigationStatus.NAVIGATING);
      startNavigation();
      speak("Resuming navigation.");
    }
  };

  // Trigger urgent haptic and audio alert for obstacles
  const triggerObstacleAlert = () => {
      if (status === NavigationStatus.ARRIVED) return;
      setShowObstacleAlert(true);
      vibrate([500, 100, 500]);
      speak("Caution. Obstacle detected ahead.");
      setTimeout(() => setShowObstacleAlert(false), 4000);
  };

  const handleCancel = () => {
    stopNavigation();
    speak("Navigation ended.");
    navigate('/');
  };

  // Calculate current instruction step based on progress
  const currentStepIndex = Math.min(Math.floor(progress / 20), NAVIGATION_STEPS.length - 1);
  const currentStepText = NAVIGATION_STEPS[currentStepIndex];

  // Announce new instructions automatically when step changes
  useEffect(() => {
    if (status === NavigationStatus.NAVIGATING && currentStepIndex !== lastSpokenIndex.current) {
        // Use interrupt=false to queue instructions naturally
        speak(currentStepText, false);
        lastSpokenIndex.current = currentStepIndex;
    }
  }, [currentStepIndex, currentStepText, status, speak]);

  // Determine arrow icon and rotation based on text instruction
  const getDirectionVisuals = () => {
      if (status === NavigationStatus.ARRIVED) {
          return { icon: <MapPin size={100} className="text-rose-500 drop-shadow-2xl" />, rotation: 0 };
      }
      if (currentStepText.toLowerCase().includes('destination')) {
           return { icon: <MapPin size={100} className="text-rose-500 drop-shadow-2xl" />, rotation: 0 };
      }

      let rotation = 0;
      const lower = currentStepText.toLowerCase();
      if (lower.includes('turn slightly right')) rotation = 45;
      else if (lower.includes('turn slightly left')) rotation = -45;
      else if (lower.includes('turn right')) rotation = 90;
      else if (lower.includes('turn left')) rotation = -90;
      
      return { 
          icon: <ArrowUp size={120} strokeWidth={2.5} className="text-indigo-600 drop-shadow-sm" />, 
          rotation 
      };
  };

  const { icon, rotation } = getDirectionVisuals();

  if (!destination) return null;

  return (
    <div className="flex flex-col h-screen bg-black relative overflow-hidden">
      <Navbar title="Navigating" />

      {/* Full-screen Obstacle Alert Overlay */}
      {showObstacleAlert && (
          <div className="absolute inset-0 z-[60] bg-rose-600/90 backdrop-blur-sm flex flex-col items-center justify-center animate-pulse p-6 text-center">
              <div className="bg-white p-6 rounded-full mb-6">
                  <AlertOctagon size={64} className="text-rose-600" strokeWidth={3} />
              </div>
              <h2 className="text-white text-4xl font-black uppercase tracking-wider drop-shadow-md">Obstacle Detected</h2>
          </div>
      )}

      {/* AR Camera View Container */}
      <div className="relative flex-1 overflow-hidden bg-black">
          <video 
            ref={videoRef} 
            className="absolute inset-0 w-full h-full object-cover opacity-90" 
            autoPlay 
            playsInline 
            muted 
          />

          {/* Central Directional Display (Arrow + Text) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none pb-20">
             {/* Rotating Arrow Circle */}
             <div 
                className="bg-white p-8 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-in-out mb-8"
                style={{ transform: `rotate(${rotation}deg)` }}
             >
                {icon}
             </div>
             
             {/* Text Instruction */}
             <div className="px-6 max-w-md text-center">
                 <p className={`font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] leading-tight ${settings.fontSize === 'text-4xl' ? 'text-5xl' : settings.fontSize}`}>
                    {currentStepText}
                 </p>
             </div>
          </div>

          {/* HUD Stats (Bottom Left - Distance) */}
          <div className="absolute bottom-32 left-6 z-20">
             <div className="flex flex-col items-start drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                <span className="text-7xl font-black text-white tracking-tighter leading-none">{Math.floor(distance)}</span>
                <span className="text-xl font-bold text-white/90 ml-1">ft</span>
             </div>
          </div>

          {/* HUD Stats (Bottom Right - Time) */}
          <div className="absolute bottom-32 right-6 z-20">
             <div className="flex flex-col items-end drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                <span className="text-7xl font-black text-white tracking-tighter leading-none">{Math.ceil(distance / 80)}</span>
                <span className="text-xl font-bold text-white/90 mr-1">min</span>
             </div>
          </div>
          
          {/* Floating Action Buttons (Pause/End) */}
          <div className="absolute bottom-8 left-0 right-0 px-6 z-30 flex gap-4 justify-center">
            {status !== NavigationStatus.ARRIVED && (
                 <AccessibleButton 
                 label={status === NavigationStatus.PAUSED ? "Resume" : "Pause"} 
                 icon={status === NavigationStatus.PAUSED ? <Play size={28} fill="currentColor"/> : <Pause size={28} fill="currentColor" />}
                 onClick={togglePause}
                 variant="secondary"
                 className="flex-1 h-20 text-xl font-bold shadow-xl bg-white text-slate-900 rounded-2xl hover:bg-slate-50 hover:shadow-xl border-none"
             />
            )}
            
            <AccessibleButton 
                label="End"
                icon={<X size={28} />}
                onClick={handleCancel}
                variant="danger"
                className={`h-20 text-xl font-bold rounded-2xl ${status === NavigationStatus.ARRIVED ? 'w-full' : 'flex-1'} 
                    shadow-none hover:shadow-none ring-0 outline-none border-none focus:ring-0 !bg-red-600 !text-white
                `}
            />
        </div>

      </div>
    </div>
  );
};

export default Navigation;