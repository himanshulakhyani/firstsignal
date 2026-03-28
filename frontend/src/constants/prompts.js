// System prompt is built server-side in backend/src/agent/promptBuilder.js
// This file holds frontend-only constants

export const EMERGENCY_NUMBERS = {
  FIRE: '101',
  CRIME: '100',
  MEDICAL: '108',
  COMBINATION: '100, 101, 108',
};

export const CATEGORY_COLORS = {
  FIRE: '#ff4b4b',
  CRIME: '#3b82f6',
  MEDICAL: '#10b981',
  COMBINATION: '#8b5cf6',
  DEFAULT: '#6b7280',
};

export const CATEGORY_LABELS = {
  FIRE: '🔥 Fire Emergency',
  CRIME: '🚨 Crime Emergency',
  MEDICAL: '🏥 Medical Emergency',
  COMBINATION: '⚡ Combined Emergency',
};

export const STAGE_LABELS = ['LISTEN', 'CALM', 'GATHER', 'ADVISE', 'DISPATCH'];
