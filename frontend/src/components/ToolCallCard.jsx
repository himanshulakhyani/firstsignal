import React, { useEffect, useState } from 'react';

export default function ToolCallCard({ type, text, delay = 0 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isDispatch = type === 'dispatch';

  const parts = text.split(' at ');
  const authority = parts[0];
  const number = parts[1] || null;

  return (
    <div className="tool-card" role="status" aria-live="polite">
      <span className="tool-icon" aria-hidden="true">{isDispatch ? '📋' : '📞'}</span>
      <div className="tool-content">
        <p className="tool-title">{isDispatch ? 'Dispatch Report Sent' : 'Emergency Call Initiated'}</p>
        <p className="tool-detail">
          Authority: {authority}
          {number && <><br />Number: <strong>{number}</strong></>}
          {isDispatch && <><br />Time: {now}</>}
        </p>
      </div>
      <span className={`tool-status ${isDispatch ? 'status-sent' : 'status-calling'}`}>
        {isDispatch ? 'SENT ✅' : 'CALLING 🔴'}
      </span>
    </div>
  );
}
