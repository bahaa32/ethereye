import axios, { AxiosError } from 'axios';
import Logger from './logger';
import { RawEthGas } from '../types/ethgas';
import { storeSnapshot } from './db';
import { FETCH_INTERVAL } from '../config/server.config';

export async function getGas() {
  return axios.get<RawEthGas>('https://ethgasstation.info/api/ethgasAPI.json').then((res) => ({
    blockNum: res.data.blockNum,
    // Divide by 10 to get Gwei
    fast: res.data.fastest / 10,
    average: res.data.fast / 10,
    low: res.data.safeLow / 10,
    blockTime: res.data.block_time,
  })).catch((err: AxiosError) => {
    if (err.response) {
      throw Error(`Prediction API responded with ${err.response.status}`);
    } else {
      throw Error('Prediction API failed to respond.');
    }
  });
}

export async function storeGas() {
  Logger.debug('Fetching gas price...');
  const gas = await getGas().catch((err: Error) => {
    Logger.error(`Failed to retrieve gas price in the background: ${err}`);
  });
  if (!gas) return;
  if (gas.blockTime < FETCH_INTERVAL) {
    Logger.warn(`Fetch interval could be too high! Latest block time: ${gas.blockTime}, fetch interval: ${FETCH_INTERVAL}.`);
  }
  await storeSnapshot(gas);
  Logger.debug('Gas price fetch successful.');
}
