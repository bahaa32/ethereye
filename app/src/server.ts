import express from 'express';
import cors from 'cors';
import Logger from './lib/logger';
import morganMiddleware from './config/morgan.config'

const DOCKER_PORT = process.env.NODE_DOCKER_PORT || 8080;
const LOCAL_PORT = process.env.NODE_LOCAL_PORT || DOCKER_PORT;

const app = express();
const corsOptions = {
  origin: `http://localhost:${DOCKER_PORT}`,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morganMiddleware);

app.get('/', (_req, res) => {
  res.json({ error: false, message: 'Hello!' });
});

app.listen(DOCKER_PORT, () => {
  Logger.info(`⚡ Server is running on port ${DOCKER_PORT}.`);
  Logger.info(`🔗 You can access the server at http://localhost:${LOCAL_PORT}`);
});
