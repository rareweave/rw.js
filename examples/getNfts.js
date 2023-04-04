const rare = require("../build");

(async () => {
  const client = new rare.Client({
    prophet: "prophet.rareweave.store",
  });

  let allNfts = await client.AllNfts();

  console.log(allNfts);
})();
