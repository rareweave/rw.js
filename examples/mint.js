const rare = require("../build");
const JWK = require("./JWK.json");
const fs = require("fs");

(async () => {
  const client = await new rare.Client({
    prophet: "prophet.rareweave.store",
    wallet: JWK,
  });

  // Img of your nft
  const imgBuffer = fs.readFileSync(__dirname + "/images/DUCK2.png");

  console.log(imgBuffer);

  console.log(
    await client.Mint(
      {
        name: "Duck #2",
        owner: "VYDyg7TPf5tB4wqeCOklGx5VWjrbRFkDnsCuFaWhtb8",
        price: 1000000000000,
        evolve: null,
        minter: "VYDyg7TPf5tB4wqeCOklGx5VWjrbRFkDnsCuFaWhtb8",
        ticker: "RWNFT",
        forSale: true,
        royalty: 0.05,
        balances: {
          VYDyg7TPf5tB4wqeCOklGx5VWjrbRFkDnsCuFaWhtb8: 1,
        },
        reserver: null,
        createdAt: Date.now(),
        contentType: "image/png",
        description: "MS Paint Duck #2",
        divisibility: 0,
        reservationTxId: null,
        reservationBlockHeight: 0,
      },
      imgBuffer
    )
  );
})();
