const hre = require("hardhat");

async function main() {
  const name = "PeerSharePlace";
  const symbol = "BLOCK";

  // get deployer address
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // check deployer account balance
  const weiAmount = (await deployer.getBalance()).toString();
  console.log("Account balance:", await ethers.utils.formatEther(weiAmount));

  // fetch contract to deploy
  const Token = await hre.ethers.getContractFactory("PeerSharePlace");

  // deploy contract
  const token = await Token.deploy();

  // fetch deployed contract
  await token.deployed();

  console.log(`Contract deployed to ${token.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
