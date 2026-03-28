import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRoute from './routes/chat.js';
import healthRoute from './routes/health.js';
import { sanitiseMiddleware } from './middleware/sanitise.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*', methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '10kb' }));
app.use(sanitiseMiddleware);
app.use(rateLimitMiddleware);

app.use('/api/chat', chatRoute);
app.use('/health', healthRoute);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuild = path.join(process.cwd(), 'frontend/dist');
  app.use(express.static(frontendBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

app.listen(PORT, () => console.log(`FirstSignal running on port ${PORT}`));
export default app;
