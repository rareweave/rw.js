# rw.js

Interact with the Rareweave platform programatically

# Notice

This library isnt finished and is prone to breaking changes

# Getting Started

```js
const rw = require("rw.js"); // Place holder name
const JWK = require("./JWK.json"); // Your wallet pretty much

(async () => {
  const client = await new rw.Client({
    prophet: "prophet.rareweave.store",
    wallet: JWK,
  });

  let nft = await client.GetNft("HIufcajDbKEbQIbvORswimsuwAhz4_QaG5-a-JwuSBo");

  // NFT State
  let readState = await nft.readState();
  let state = await readState.cachedValue.state;

  // Editing NFT
  await client.EditNft(nft, {
    description: "Example",
    forSale: true,
    price: 1000000000000, // 1 AR
  });
})();
```

# Installing

To:Do

# Documentation

Read examples

## Supports

1. Fetch NFT data
2. Mint
3. Edit
4. Indexing
5. ~~Buy~~
