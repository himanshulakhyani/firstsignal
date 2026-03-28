import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble.jsx';
import ToolCallCard from './ToolCallCard.jsx';
import DispatchReport from './DispatchReport.jsx';
import DangerBanner from './DangerBanner.jsx';
import InputBar from './InputBar.jsx';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../constants/prompts.js';

export default function ChatScreen({
  messages, category, danger, report, toolCalls,
  isLoading, error, onSend, onReset, location, locationSource,
}) {
  const bottomRef = useRef(null);
  const themeColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.DEFAULT;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, toolCalls, report, isLoading]);

  return (
    <div className="chat-screen" style={{ '--theme-color': themeColor }}>
      {/* Top bar */}
      <div className="top-bar">
        <div className="cat-indicator">
          <span className="cat-dot" aria-hidden="true" />
          <span aria-live="polite">{CATEGORY_LABELS[category] || 'ANALYZING...'}</span>
        </div>
        <button className="reset-link" onClick={onReset} aria-label="Start new emergency">
          New Emergency
        </button>
      </div>

      <DangerBanner level={danger} />

      {/* Chat window */}
      <div
        className="chat-window"
        role="list"
        aria-label="Emergency conversation"
        aria-live="polite"
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} stage={msg.stage} />
        ))}

        {toolCalls.map((tc, i) => (
          <ToolCallCard key={i} type={tc.type} text={tc.text} delay={i * 1000} />
        ))}

        {report && (
          <DispatchReport
            data={report}
            resolvedLocation={location}
            locationSource={locationSource}
          />
        )}

        {isLoading && (
          <div className="loading-indicator" aria-live="polite" aria-label="FirstSignal is responding">
            FirstSignal is here with you...
          </div>
        )}

        {error && (
          <div className="error-msg" role="alert">
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <InputBar onSend={onSend} isLoading={isLoading} voiceEnabled={false} />
    </div>
  );
}
