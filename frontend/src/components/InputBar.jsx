import React, { useState, useRef } from 'react';

export default function InputBar({ onSend, isLoading, voiceEnabled }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
    inputRef.current?.focus();
  };

  return (
    <div className="input-bar" role="form" aria-label="Send message">
      <input
        ref={inputRef}
        type="text"
        className="chat-input"
        placeholder="Describe your emergency..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        disabled={isLoading}
        aria-label="Type your emergency message"
        autoComplete="off"
      />

      {/* Voice toggle — stubbed, wired in future iteration */}
      {voiceEnabled && (
        <button
          className="mic-btn"
          aria-label="Voice input (coming soon)"
          title="Voice input coming soon"
          disabled
        >
          🎙️
        </button>
      )}

      <button
        className="send-btn"
        onClick={handleSend}
        disabled={isLoading || !text.trim()}
        aria-label="Send message"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
}
