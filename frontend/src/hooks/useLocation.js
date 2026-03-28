import { useState, useEffect } from 'react';

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [locationSource, setLocationSource] = useState(null);
  const [locationStatus, setLocationStatus] = useState('pending'); // pending | gps | ip | denied
  const [locationLabel, setLocationLabel] = useState('📍 Requesting location...');

  useEffect(() => {
    let gpsResolved = false;

    // IP fallback — always start immediately
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        if (!gpsResolved && d?.city) {
          setLocation(`${d.city}, ${d.region}, ${d.country_name}`);
          setLocationSource('IP address');
          setLocationStatus('ip');
          setLocationLabel(`📍 ~${d.city} (approximate)`);
        }
      })
      .catch(() => {});

    // GPS — overrides IP if granted
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setLocationLabel('📍 Location unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        gpsResolved = true;
        const { latitude, longitude } = pos.coords;
        const coords = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        setLocation(coords);
        setLocationSource('GPS');
        setLocationStatus('gps');
        setLocationLabel('📍 Location captured');

        // Try reverse geocode for readable address
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          if (data?.display_name) {
            const short = data.address?.suburb || data.address?.city_district || data.address?.city || 'Location ready';
            setLocation(data.display_name);
            setLocationLabel(`📍 ${short}`);
          }
        } catch (_) {}
      },
      () => {
        if (!gpsResolved) {
          setLocationStatus('denied');
          setLocationLabel('📍 Will ask for your location');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { location, locationSource, locationStatus, locationLabel };
}
