import React, { useState } from 'react';

export default function Settings({ isOpen, onClose }) {
  const [voiceEnabled, setVoiceEnabled] = useState(
    localStorage.getItem('fs_voice') === 'true'
  );

  if (!isOpen) return null;

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    localStorage.setItem('fs_voice', String(next));
  };

  return (
    <div className="settings-overlay" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Settings</h2>
          <button onClick={onClose} aria-label="Close settings">✕</button>
        </div>

        <div className="settings-body">
          <div className="settings-note">
            <p>🔐 Your API key is configured securely on the server.</p>
            <p>It is never stored in your browser.</p>
          </div>

          <div className="settings-row">
            <div>
              <p className="settings-label">Voice Input</p>
              <p className="settings-sub">Use microphone instead of typing</p>
            </div>
            <label className="toggle-switch" aria-label="Toggle voice input">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={toggleVoice}
              />
              <span className="slider" />
            </label>
          </div>

          <p className="settings-coming-soon">
            🎙️ Voice transcription via Whisper — coming in next update
          </p>
        </div>
      </div>
    </div>
  );
}
