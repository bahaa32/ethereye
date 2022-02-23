import express from 'express';
import cors from 'cors';
import Logger from './lib/logger';
import morganMiddleware from './config/morgan.config';
import { handleAverage, handleGas } from './routes/ethgas';
import { storeGas } from './lib/ethgas';
import { DOCKER_PORT, LOCAL_PORT, FETCH_INTERVAL } from './config/server.config';

const app = express();
const corsOptions = {
  origin: `http://localhost:${DOCKER_PORT}`,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morganMiddleware);

app.get('/gas', handleGas);
app.get('/average', handleAverage);

// Auto fetch gas prices every x seconds
setInterval(storeGas, FETCH_INTERVAL * 1000);

app.listen(DOCKER_PORT, async () => {
  Logger.info(`⚡ Server is running on port ${DOCKER_PORT}.`);
  Logger.info(`🔗 You can access the server at http://localhost:${LOCAL_PORT}`);
});
