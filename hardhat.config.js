require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

task("deploy-booklibrary", "Deploys book library on a provided network")
    .setAction(async (taskArguments, hre, runSuper) => {
        const deployBookLibraryContract = require("./scripts/deploy");
        await deployBookLibraryContract(taskArguments);
    });

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    rinkeby: {
      url: process.env.DEPLOY_URL_RINKEBY,
      accounts: [process.env.DEPLOY_ACC_RINKEBY],
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};