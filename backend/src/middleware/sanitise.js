function stripDangerous(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').replace(/on\w+\s*=/gi, '').trim().slice(0, 2000);
}
function sanitiseObject(obj) {
  if (typeof obj === 'string') return stripDangerous(obj);
  if (Array.isArray(obj)) return obj.map(sanitiseObject);
  if (obj && typeof obj === 'object') return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, sanitiseObject(v)]));
  return obj;
}
export function sanitiseMiddleware(req, res, next) {
  if (req.body) req.body = sanitiseObject(req.body);
  next();
}
