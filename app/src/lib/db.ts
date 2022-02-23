import { Schema, model, connect } from 'mongoose';
import mongoUri from '../config/db.config';
import Logger from './logger';
import { EthGasSnapshot } from '../types/ethgas';

const schema = new Schema<EthGasSnapshot>({
  fast: { type: Number, required: true },
  average: { type: Number, required: true },
  low: { type: Number, required: true },
  blockNum: { type: Number, required: true, unique: true },
}, { timestamps: true });

async function init() {
  Logger.debug('Connecting to database...');
  await connect(mongoUri);
  Logger.debug('Connected to database.');
}
init();

const EthGasSnapshotModel = model<EthGasSnapshot>('EthGasSnapshot', schema);

export async function storeSnapshot(snapshot: EthGasSnapshot): Promise<void> {
  Logger.debug(snapshot);
  await EthGasSnapshotModel.findOneAndUpdate(
    { blockNum: snapshot.blockNum },
    snapshot,
    { upsert: true },
  );
}

export function getAveragePrice(fromTime: Date, toTime: Date) {
  return EthGasSnapshotModel.aggregate([{
    $match: {
      updatedAt: {
        $gte: fromTime,
        $lte: toTime,
      },
    },
  },
  {
    $group: {
      _id: null,
      avg: {
        $avg: {
          $sum: ['$fast', '$average', '$low'],
        },
      },
    },
  }]);
}
