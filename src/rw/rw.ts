import * as types from "../@types";
import * as WarpSdk from "warp-contracts";
import { DeployPlugin } from "warp-contracts-plugin-deploy";

/**
 *
 * Create a new rare client
 *
 * @param {types.RareClient} types.RareClient
 * @example
 * const client = new Rare.Client({
 *  prophet: 'prophet.rareweave.store',
  });
 *
 */

export interface Client {
  prophet: string;
  seed: string;
  wallet: any;
  Warp: WarpSdk.Warp;

  /**
   *
   * Fetch all NFTs
   *
   * @returns {Promise<types.AllNfts>}
   *
   */
  GetNfts: () => Promise<types.AllNfts>;

  /**
   *
   * Fetch the data of one specific NFT
   * (Really just queries every type of contract)
   *
   * @param {string} contractId nft you want to get data on
   *
   * @returns {Promise<WarpSdk.Contract<unknown>>}
   *
   */
  GetNft: (contractId: string) => Promise<WarpSdk.Contract<unknown>>;

  /**
   *
   * Edit the properties of an NFT you own
   *
   * @param {WarpSdk.Contract<unknown>} contract nft you want to edit
   * @param {types.ModifyNft} The new data
   *
   * @returns {Promise<unknown>}
   *
   */
  EditNft: (
    contract: WarpSdk.Contract<unknown>,
    data: types.ModifyNft
  ) => Promise<unknown>;

  /**
   *
   * Index your NFT
   * Usually do this minutes after you mint your NFT
   *
   * @param {string} contractId The NFT you want to index
   *
   * @returns {Promise<boolean>}
   *
   */
  Index: (contractId: string) => Promise<boolean>;

  /**
   *
   * Transfer you NFT to another address
   *
   * @param {WarpSdk.Contract<unknown>} contract nft you want to transfer
   * @param {string} address The address for the NFT to go
   *
   * @returns {Promise<unknown>}
   *
   */
  Transfer: (
    contract: WarpSdk.Contract<unknown>,
    address: string
  ) => Promise<unknown>;

  /**
   *
   * Mint your own NFT
   *
   * @param {types.Nft} data nft Data
   * @param {Buffer} img The image to the NFT
   *
   * @returns {Promise<unknown>}
   *
   */
  Mint: (data: types.Nft, img: Buffer) => Promise<WarpSdk.Transaction>;
}

export class Client implements Client {
  address: string | undefined;
  constructor({ prophet = "" }: any) {
    this.prophet = prophet;
    this.Warp = WarpSdk.WarpFactory.forMainnet().use(new DeployPlugin());
  }

  _initWallet = async ({ JWK = "" }): Promise<Client> => {
    this.wallet = JWK;
    this.address = await this.Warp.arweave.wallets.getAddress(this.wallet);
    return this;
  };

  GetNfts = async (): Promise<types.AllNfts> => {
    let nfts = await fetch("http://" + this.prophet + "/nfts", {
      method: "GET",
    });

    return nfts.json();
  };

  GetNft = async (contractId: string): Promise<WarpSdk.Contract<unknown>> => {
    if (!this.wallet) {
      throw new Error("Must connect a wallet");
    }
    let contract = this.Warp.contract(contractId)
      .setEvaluationOptions({
        unsafeClient: "allow",
        waitForConfirmation: false,
      })
      .connect(this.wallet);

    return contract;
  };

  EditNft = async (
    contract: WarpSdk.Contract<unknown>,
    data: types.ModifyNft
  ): Promise<unknown> => {
    if (!this.wallet) {
      throw new Error("Must connect a wallet");
    }

    try {
      let interaction = await contract.writeInteraction({
        function: "edit-nft",
        description: data.description,
        forSale: data.forSale,
        price: data.price,
      });

      return interaction;
    } catch (e) {
      return e;
    }
  };

  Index = async (contractId: string) => {
    try {
      await fetch("http://" + this.prophet + "/index?id=" + contractId, {
        method: "GET",
      });

      return true;
    } catch (e) {
      return false;
    }
  };

  Tansfer = async (
    contract: WarpSdk.Contract<unknown>,
    address: string
  ): Promise<unknown> => {
    let transfer = await contract.writeInteraction({
      function: "transfer",
      target: address,
    });

    return transfer;
  };

  Mint = async (data: types.Nft, img: Buffer): Promise<WarpSdk.Transaction> => {
    if (!this.wallet) {
      throw new Error("Must connect a wallet");
    }

    let tx = await this.Warp.arweave.createTransaction(
      {
        data: Buffer.from(new Uint8Array(img)),
        tags: encodeTags([
          { name: "App-Name", value: "SmartWeaveContract" },
          { name: "App-Version", value: "0.3.0" },
          {
            name: "Contract-Src",
            value: "hcszckSXA5GTg6zg65nk6RQtT4aRHDzyxOOoD6DEGxg",
          },
          { name: "SDK", value: "Warp" },
          { name: "Nonce", value: Date.now().toString() },
          { name: "Content-Type", value: data.contentType },
          { name: "Init-State", value: JSON.stringify(data) },
          { name: "Title", value: data.name },
          { name: "Type", value: "Tradable-SW-NFT" },
          { name: "Topics", value: "NFTs, Atomic Assets" },
          { name: "Description", value: data.description },
          { name: "Signing-Client", value: "Rare.js" },
          {
            name: "Contract-Manifest",
            value: JSON.stringify({
              evaluationOptions: {
                unsafeClient: "allow",
                waitForConfirmation: false,
              },
            }),
          },
        ]),
      },
      this.wallet
    );

    if (img.byteLength > 10000) {
      await this.Warp.arweave.transactions.sign(tx, this.wallet);
      let uploader = await this.Warp.arweave.transactions.getUploader(tx);
      while (!uploader.isComplete) {
        await uploader.uploadChunk();
      }
    }

    await this.Warp.register(tx.id, "node1").catch((e) => null);
    await this.Warp.register(tx.id, "node2").catch((e) => null);

    return tx;
  };

  Purchase = async () => {};
}

function encodeTags(tags: any) {
  return tags.map(
    (tag: {
      name:
        | WithImplicitCoercion<string>
        | { [Symbol.toPrimitive](hint: "string"): string };
      value:
        | WithImplicitCoercion<string>
        | { [Symbol.toPrimitive](hint: "string"): string };
    }) => ({
      name: Buffer.from(tag.name, "utf-8").toString("base64"),
      value: Buffer.from(tag.value, "utf-8").toString("base64"),
    })
  );
}
