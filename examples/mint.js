const rare = require("../build");
const JWK = require("./JWK.json");
const fs = require("fs");

(async () => {
  const client = await new rare.Client({
    prophet: "prophet.rareweave.store",
  })._initWallet({
    JWK,
  });

  // Img of your nft
  const imgBuffer = fs.readFileSync(__dirname + "/images/img.png");

  console.log(
    await client.Mint(
      {
        name: "Testing",
        owner: "VYDyg7TPf5tB4wqeCOklGx5VWjrbRFkDnsCuFaWhtb8",
        price: 10000000000000,
        evolve: null,
        minter: "VYDyg7TPf5tB4wqeCOklGx5VWjrbRFkDnsCuFaWhtb8",
        ticker: "RWNFT",
        forSale: true,
        royalty: 5,
        balances: {
          VYDyg7TPf5tB4wqeCOklGx5VWjrbRFkDnsCuFaWhtb8: 1,
        },
        reserver: null,
        createdAt: Date.now(),
        contentType: "image/png",
        description: "Testing 12",
        divisibility: 0,
        reservationTxId: null,
        reservationBlockHeight: 0,
      },
      imgBuffer
    )
  );
})();
