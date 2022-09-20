require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKeys = process.env.KOVAN_PRIVATE_KEYS || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    localhost: {},
    // goerli: {
    //   url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   accounts: privateKeys.split(','),
    // }
  },
  
};