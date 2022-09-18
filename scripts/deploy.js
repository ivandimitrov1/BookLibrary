// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function deployBookLibraryContract() {

  // gets info of the account used to deploy
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log('Deploying contract with account: ', deployer.address);
  console.log('Account balance: ', accountBalance.toString());

  // read contract file
  const bookLibraryFactory = await hre.ethers.getContractFactory(
    'BookLibrary'
  );
  // triggers deployment
  const bookLibraryContract = await bookLibraryFactory.deploy({});

  // wait for deployment to finish
  await bookLibraryContract.deployed();

  console.log('BookLibrary contract address: ', bookLibraryContract.address);

  await hre.run("verify:verify", {
    address: bookLibraryContract.address,
    constructorArguments: [
     // if any
    ],
  });
}

module.exports = deployBookLibraryContract;