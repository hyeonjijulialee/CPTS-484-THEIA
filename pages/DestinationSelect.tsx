import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Search, MapPin } from 'lucide-react';
import { AccessibleButton } from '../components/AccessibleButton';
import { useAccessibility } from '../components/AccessibilityProvider';
import { Navbar } from '../components/Navbar';
import { MOCK_DESTINATIONS } from '../constants';
import { Destination } from '../types';

const DestinationSelect: React.FC = () => {
  const navigate = useNavigate();
  const { speak, settings, vibrate } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    speak("Select your destination.");
  }, []);

  const handleDestinationClick = (dest: Destination) => {
    speak(`Navigating to ${dest.name}`);
    navigate('/navigation', { state: { destination: dest } });
  };

  const filteredDestinations = MOCK_DESTINATIONS.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleVoiceInput = () => {
    vibrate(100);
    if (!isListening) {
      setIsListening(true);
      speak("Listening...");
      // Mock voice input
      setTimeout(() => {
        setIsListening(false);
        setSearchTerm("Room");
        speak("Found matching results.");
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Navbar title="Destination" />

      <div className="flex-1 flex flex-col gap-6 p-6 max-w-lg mx-auto w-full overflow-hidden">
        
        {/* Search Bar */}
        <div className="flex gap-3 items-stretch shrink-0">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className={`w-full h-full p-4 pl-12 rounded-2xl font-bold bg-white border-2 border-transparent text-slate-900 focus:border-indigo-500 focus:ring-0 shadow-sm transition-all outline-none ${settings.fontSize}`}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          </div>
          <button 
            onClick={toggleVoiceInput}
            className={`p-4 rounded-2xl transition-all duration-300 ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-indigo-600'} text-white shadow-md flex items-center justify-center w-16 shrink-0 active:scale-95`}
            aria-label="Voice Search"
          >
            <Mic size={28} />
          </button>
        </div>

        {/* List - Scrollbar hidden but scrollable */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-8 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filteredDestinations.map(dest => (
            <button
              key={dest.id}
              onClick={() => handleDestinationClick(dest)}
              className="p-5 text-left rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all active:scale-[0.98] flex items-center gap-5 group shrink-0"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                 <MapPin size={24} fill="currentColor" className="opacity-80" />
              </div>
              <div>
                <div className={`font-bold text-slate-900 leading-tight mb-1 ${settings.fontSize}`}>{dest.name}</div>
                <div className="text-slate-500 font-medium text-sm bg-slate-100 inline-block px-2 py-0.5 rounded-md">{dest.category} • {dest.floor} Floor</div>
              </div>
            </button>
          ))}
          
          {filteredDestinations.length === 0 && (
            <div className="p-10 text-center opacity-50 font-medium">
              No places found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationSelect;
