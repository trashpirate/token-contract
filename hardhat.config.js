require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const privateKeys = process.env.PRIVATE_KEYS || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    localhost: {},
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: privateKeys.split(","),
    },
    bsc_test: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: privateKeys.split(","),
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: privateKeys.split(","),
    },
  },
  // etherscan: {
  //   // verification on Ethereum
  //   apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  // },
  etherscan: {
    // verification on Binance Smart Chain
    apiKey: `${process.env.BSCSCAN_API_KEY}`,
  },
};
