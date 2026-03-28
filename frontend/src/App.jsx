import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen.jsx';
import ChatScreen from './components/ChatScreen.jsx';
import Settings from './components/Settings.jsx';
import { useLocation } from './hooks/useLocation.js';
import { useConversation } from './hooks/useConversation.js';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('landing'); // landing | chat
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { location, locationSource, locationStatus, locationLabel } = useLocation();

  const {
    messages, category, danger, report, toolCalls,
    isLoading, error, send, startSession, reset,
  } = useConversation({ location, locationSource });

  const handleStart = async () => {
    setScreen('chat');
    await startSession();
  };

  const handleReset = () => {
    reset();
    setScreen('landing');
  };

  return (
    <div className="app" role="application" aria-label="FirstSignal Emergency Assistant">
      <header className="app-header">
        <h1 className="app-title">🆘 FirstSignal</h1>
        <button
          className="settings-btn"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
        >
          ⚙️
        </button>
      </header>

      {screen === 'landing' && (
        <LandingScreen
          onStart={handleStart}
          locationLabel={locationLabel}
          locationStatus={locationStatus}
        />
      )}

      {screen === 'chat' && (
        <ChatScreen
          messages={messages}
          category={category}
          danger={danger}
          report={report}
          toolCalls={toolCalls}
          isLoading={isLoading}
          error={error}
          onSend={send}
          onReset={handleReset}
          location={location}
          locationSource={locationSource}
        />
      )}

      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
