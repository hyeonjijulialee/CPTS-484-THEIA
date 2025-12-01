import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, Eye, AlertTriangle } from 'lucide-react';
import { AccessibleButton } from '../components/AccessibleButton';
import { useAccessibility } from '../components/AccessibilityProvider';
import { Navbar } from '../components/Navbar';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useAccessibility();

  useEffect(() => {
    speak("Welcome to Theia.");
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar title="THEIA" />
      
      <main className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto max-w-lg mx-auto w-full pb-8">
        
        <div className="flex flex-col gap-4 flex-1 justify-center">
            <AccessibleButton
                label="Navigation"
                icon={<Navigation size={32} />}
                variant="primary"
                onClick={() => navigate('/destination')}
                fullWidth
                className="flex-1 min-h-[140px] text-2xl shadow-lg shadow-indigo-200/50"
            />
            
            <AccessibleButton
                label="Live Camera"
                icon={<Eye size={32} />}
                variant="secondary"
                onClick={() => navigate('/live-view')}
                fullWidth
                className="flex-1 min-h-[140px] text-2xl"
            />
        </div>

        <div className="h-32 shrink-0">
          <AccessibleButton
            label="Emergency"
            icon={<AlertTriangle size={24} />}
            variant="danger"
            onClick={() => navigate('/emergency')}
            fullWidth
            className="h-full"
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
