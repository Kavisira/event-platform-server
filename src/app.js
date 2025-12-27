import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/event.routes.js';
import publicRoutes from './routes/public.routes.js';
import exportRoutes from './routes/export.routes.js';
import submissionRoutes from './routes/submission.routes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'OK' });
});

app.use('/events', eventRoutes)
app.use("/public", publicRoutes);
app.use("/export", exportRoutes);
app.use("/submissions", submissionRoutes);

export default app;
