import React from 'react';

const SEV_CLASS = { Critical: 'sev-critical', High: 'sev-high', Medium: 'sev-medium' };

export default function DispatchReport({ data, resolvedLocation, locationSource }) {
  if (!data) return null;
  const sev = data.severity || 'Medium';

  return (
    <section className="report-card" aria-label="Emergency Dispatch Report">
      <div className="report-header">
        <h2 className="report-title">🚨 Emergency Dispatch Report</h2>
        <span className={`sev-badge ${SEV_CLASS[sev] || 'sev-medium'}`}>{sev}</span>
      </div>
      <dl className="report-grid">
        {[
          ['Category',    data.category],
          ['Name',        data.name || 'Unknown'],
          ['Location',    data.location || resolvedLocation || 'Unknown'],
          ['Location Source', data.location_source || locationSource || 'Unknown'],
          ['Phone',       data.phone || 'Not provided'],
          ['Situation',   data.situation],
          ['Advice Given', data.advice_given],
          ['Authorities', data.authorities],
        ].map(([label, value]) => (
          <div className="report-item" key={label}>
            <dt className="report-label">{label}</dt>
            <dd className="report-value">{value || '—'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
