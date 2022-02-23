import { Request, Response } from 'express';
import { getAveragePrice } from '../lib/db';
import { getGas } from '../lib/ethgas';
import Logger from '../lib/logger';
import { EthGasSnapshot } from '../types/ethgas';

export async function handleGas(_req: Request, res: Response) {
  await getGas().then((price: EthGasSnapshot) => res.json({
    error: false,
    message: {
      fast: price.fast, average: price.average, low: price.low, blockNum: price.blockNum,
    },
  })).catch((err) => {
    res.json({ error: true, message: err.message });
  });
}

export async function handleAverage(req: Request, res: Response) {
  // Input handling
  res.status(400);
  const { fromTime, toTime } = req.query;
  Logger.debug(`fromTime: ${fromTime}, toTime: ${toTime}`);
  if (typeof fromTime !== 'string' || typeof toTime !== 'string') {
    res.json({ error: true, message: 'fromTime and toTime query params are required.' });
    return;
  }

  let fromTimeDT;
  let toTimeDT;
  try {
    fromTimeDT = new Date(parseInt(fromTime, 10) * 1000);
    if (fromTimeDT.toString() === 'Invalid Date') throw new EvalError();
  } catch (error) {
    res.json({ error: true, message: 'Invalid unix timestamp provided for fromTime!' });
    return;
  }
  try {
    toTimeDT = new Date(parseInt(toTime, 10) * 1000);
    if (toTimeDT.toString() === 'Invalid Date') throw new EvalError();
  } catch (error) {
    res.json({ error: true, message: 'Invalid unix timestamp provided for toTime!' });
    return;
  }
  const today = new Date();
  if (today < fromTimeDT || today < toTimeDT) {
    res.json({ error: true, message: 'Cannot take dates from the future.' });
    return;
  }
  if (fromTimeDT > toTimeDT) {
    res.json({ error: true, message: 'fromTime cannot be later than toTime.' });
    return;
  }
  Logger.debug(`${fromTimeDT}, ${toTimeDT}`);
  // End input handling
  res.status(200);
  const dbResponse = await getAveragePrice(fromTimeDT, toTimeDT);
  if (dbResponse.length === 0) {
    res.json({ error: true, message: 'No history recorded for time range.' });
    return;
  }
  const { avg } = dbResponse[0];
  res.json({
    error: false,
    message: {
      averageGasPrice: Math.round(avg),
      // Get timestamp from DT object for easier bug discovery/reporting
      fromTime: fromTimeDT.getTime() / 1000,
      toTime: toTimeDT.getTime() / 1000,
    },
  });
}
