import React, { useRef, useEffect, useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { AccessibleButton } from '../components/AccessibleButton';
import { useAccessibility } from '../components/AccessibilityProvider';
import { Navbar } from '../components/Navbar';
import { analyzeEnvironment } from '../services/geminiService';

const LiveView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { speak, vibrate, settings } = useAccessibility();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [description, setDescription] = useState("");

  // Initialize camera and cleanup on unmount
  useEffect(() => {
    startCamera();
    speak("Live view active. Tap scan for description.");
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize rear-facing camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error", err);
      speak("Camera permission denied.");
    }
  };

  // Release camera resources to save battery/memory
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Capture current frame, convert to image, and request AI analysis
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    vibrate(50);
    setIsAnalyzing(true);
    speak("Analyzing scene...");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      // Draw video frame to invisible canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to Base64 and send to Gemini AI
      const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
      const result = await analyzeEnvironment(base64Image);
      
      // Update UI and announce result via TTS
      setDescription(result);
      speak(result);
      vibrate(100);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <Navbar title="Live View" />
      
      {/* Camera Viewfinder Area */}
      <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-slate-900">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover opacity-60"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Text Description Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 min-h-[200px] bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-center">
          <p className={`${settings.fontSize} font-bold leading-relaxed text-white drop-shadow-md text-center`}>
            {isAnalyzing ? "Analyzing environment..." : (description || "Point camera and tap Scan.")}
          </p>
        </div>
      </div>

      {/* Bottom Control Area */}
      <div className="p-6 bg-black border-t border-white/10">
        <AccessibleButton
          label={isAnalyzing ? "Analyzing..." : "Scan Scene"}
          icon={isAnalyzing ? <RefreshCw className="animate-spin" size={28}/> : <Camera size={28}/>}
          onClick={captureAndAnalyze}
          disabled={isAnalyzing}
          fullWidth
          variant="primary"
          className="h-24 text-2xl bg-white text-black hover:bg-gray-200 shadow-none border-none"
        />
      </div>
    </div>
  );
};

export default LiveView;