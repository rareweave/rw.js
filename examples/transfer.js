const rare = require("../build");
const JWK = require("./JWK.json");
(async () => {
  const client = await new rare.Client({
    prophet: "prophet.rareweave.store",
    wallet: JWK,
  });

  let nft = await client.GetNft("wHRNH2bzJ_sT3NDD2-qlujXDVDyYxVK_4UZB18mNgJM");

  let edit = await client.Transfer(
    nft,
    "udOL7D7qkfFyfnkxfRQA0r1Eoz1-XRwUOSLfiCFee38"
  );

  console.log(edit);
})();
