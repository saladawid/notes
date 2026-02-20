import express from 'express';
import corsMiddleware from './middleware/cors';
import authRoutes from './routes/auth';
import notesRoutes from './routes/notes';
import tagsRoutes from './routes/tags';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tags', tagsRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
