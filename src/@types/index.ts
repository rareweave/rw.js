export type RareClient = {
  prophet: string;
};

export type AllNfts = {
  result: {
    contractTxId: string;
    owner: [Object];
    state: [Object];
    timestamp: Date;
  }[];
  status: "string";
  time: "string";
};

export type Nft = {
  name: string;
  owner: string;
  price: BigInt;
  evolve: null;
  minter: string;
  ticker: string;
  forSale: boolean;
  royalty: number;
  balances: [Object];
  reserver: null;
  createdAt: Date;
  contentType: string;
  description: string;
  divisibility: number;
  reservationTxId: null;
  reservationBlockHeight: number;
};

export type ModifyNft = {
  description: string;
  price: number;
  forSale: boolean;
};
