import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import Home from './pages/Home';
import DestinationSelect from './pages/DestinationSelect';
import Navigation from './pages/Navigation';
import LiveView from './pages/LiveView';
import Emergency from './pages/Emergency';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destination" element={<DestinationSelect />} />
          <Route path="/navigation" element={<Navigation />} />
          <Route path="/live-view" element={<LiveView />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </HashRouter>
    </AccessibilityProvider>
  );
};

export default App;