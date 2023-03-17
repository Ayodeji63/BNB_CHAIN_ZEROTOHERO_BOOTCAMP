const hre = require("hardhat");

async function main() {
  const BadgerCoin = hre.ethers.getContractFactory("BadgerCoin");

  const TOTAL_SUPPLY = 1_000_000;
  const DECIMALS = 18;
  const badgerCoin = (await BadgerCoin).deploy(TOTAL_SUPPLY, DECIMALS);

  await (await badgerCoin).deployed();

  console.log(`Contract deployed at address`, (await badgerCoin).address);
}
main().catch((e) => {
  console.log(e);
  process.exit(0);
});
