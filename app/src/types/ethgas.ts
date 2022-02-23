export interface EthGasSnapshot {
    fast: number;
    average: number;
    low: number;
    blockNum: number;
  }

export interface RawEthGas {
  fastest: number;
  fast: number;
  safeLow: number;
  blockNum: number;
  block_time: number;
}
