const sessions = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;

export function rateLimitMiddleware(req, res, next) {
  if (!req.path.startsWith('/api')) return next();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const session = sessions.get(ip) || { count: 0, start: now };
  if (now - session.start > WINDOW_MS) { session.count = 1; session.start = now; }
  else session.count++;
  sessions.set(ip, session);
  if (session.count > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }
  next();
}
