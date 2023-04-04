const rare = require("../build");
const JWK = require("./JWK.json");
(async () => {
  const client = await new rare.Client({
    prophet: "prophet.rareweave.store",
  })._initWallet({
    JWK,
  });

  let nft = await client.GetNft("dy12xuph-p00T5DZqqtXx2HgNofNRpZa5e8zuvM_R6c");

  let edit = await client.EditNft(nft, {
    description: "Mossy South",
    forSale: true,
    price: 1000000000000,
  });

  console.log(edit);
})();
