
const hre = require("hardhat");

async function main() {

    const name = "Token";
    const symbol = "TOKEN";
    const totalSupply = "1000000";

    // fetch contract to deploy
    const Token = await hre.ethers.getContractFactory("Token");

    // deploy contract
    const token = await Token.deploy(name, symbol, totalSupply);

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