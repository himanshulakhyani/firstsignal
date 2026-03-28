import React from 'react';

const STAGE_COLORS = {
  LISTEN:   '#6b7280',
  CALM:     '#10b981',
  GATHER:   '#f59e0b',
  ADVISE:   '#3b82f6',
  DISPATCH: '#8b5cf6',
};

export default function MessageBubble({ role, content, stage }) {
  if (role === 'user') {
    return (
      <div className="message user" role="listitem">
        <p>{content}</p>
      </div>
    );
  }

  return (
    <div className="message ai" role="listitem" aria-label={`Assistant: ${content}`}>
      {stage && (
        <span
          className="stage-badge"
          style={{ color: STAGE_COLORS[stage] || '#6b7280' }}
          aria-label={`Stage: ${stage}`}
        >
          {stage}
        </span>
      )}
      <p dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
    </div>
  );
}
