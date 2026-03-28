import React from 'react';

export default function DangerBanner({ level }) {
  if (!level || level === 'NORMAL') return null;

  const isExtreme = level === 'EXTREME';

  return (
    <div
      className={`danger-banner ${isExtreme ? 'extreme' : 'high'}`}
      role="alert"
      aria-live="assertive"
    >
      {isExtreme
        ? '⚠️ EXTREME DANGER — Dispatching help immediately'
        : '⚡ HIGH SEVERITY — Help is being arranged'}
    </div>
  );
}
