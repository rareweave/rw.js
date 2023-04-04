const rare = require("../build");

(async () => {
  const client = new rare.Client({
    prophet: "prophet.rareweave.store",
  });

  let nft = await client.GetNft("TQV3jF__DifI3nPFf5vH6zAXnSKvfGBcYCIGhTXetok");

  let readState = await nft.readState();
  let state = await readState.cachedValue.state;

  console.log(state);
})();
