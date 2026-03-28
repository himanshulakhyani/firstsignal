import React from 'react';
import { CATEGORY_COLORS } from '../constants/prompts.js';

export default function LandingScreen({ onStart, locationLabel, locationStatus }) {
  const locClass = {
    gps: 'loc-success',
    ip: 'loc-warning',
    denied: 'loc-error',
    pending: 'loc-pending',
  }[locationStatus] || 'loc-pending';

  return (
    <main className="landing-screen" role="main">
      <div className={`location-pill ${locClass}`} aria-live="polite">
        {locationLabel}
      </div>

      <button
        className="sos-btn"
        onClick={onStart}
        aria-label="Tap to start emergency assistance"
      >
        <span className="sos-icon" aria-hidden="true">🆘</span>
        <span className="sos-text">TAP FOR HELP</span>
        <span className="sos-sub">Emergency SOS</span>
      </button>

      <p className="hint-text">
        Tap the button and describe what's happening.<br />
        We will figure out the rest.
      </p>
    </main>
  );
}
