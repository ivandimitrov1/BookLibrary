const hre = require("hardhat");
const bookLibraryJson = require('../artifacts/contracts/BookLibrary.sol/BookLibrary.json');

require("dotenv").config();

const run = async function(privateKey, rinkebyApiKey, bookLibraryContractAddress) {
    const provider = new hre.ethers.providers.InfuraProvider("rinkeby", rinkebyApiKey)

    const deployerWallet = new hre.ethers.Wallet(privateKey, provider);
    console.log('<< get balance at startup >>');
    const ballance = await deployerWallet.getBalance();
    console.log(hre.ethers.utils.formatEther(ballance, 18));

    const bookLibraryDeployerContract = new hre.ethers.Contract(bookLibraryContractAddress, bookLibraryJson.abi, deployerWallet);
    
    try {
        console.log('<< deployer tries to get available books >>');
        const allBookIds = await bookLibraryDeployerContract.getAvailableBookIds();
        console.log('book ids: ' + allBookIds);

    } catch(error) {
        console.log('call failed because of:' + error.reason);
    }

    try {
        console.log('<< deployer tries to add a new book >>');
        const allBookIds = await bookLibraryDeployerContract.addBook("only one", 0);
        console.log('should be added');

    } catch(error) {
        console.log('call failed because of:' + error.reason);
    }

    console.log('<< get balance at >>');
    // it doesnt change ? why
    const ballance1 = await deployerWallet.getBalance();
    console.log(hre.ethers.utils.formatEther(ballance1, 18));

    try {
        console.log('<< deployer tries to borrow a book with id:0 >>');
        await bookLibraryDeployerContract.borrowBook(0);
        console.log('should be borrowed');

    } catch(error) {
        console.log('call failed because of:' + error.reason);
    }

    try {
        console.log('<< deployer tries to get available books >>');
        const allBookIds1 = await bookLibraryDeployerContract.getAvailableBookIds();
        console.log('book ids: ' + allBookIds1);

    } catch(error) {
        console.log('call failed because of:' + error.reason);
    }
}

run(
    process.env.PERSONAL_WALLET_PRIVATE_KEY,
    process.env.RINKEBY_API_KEY,
    process.env.BOOK_LIBRARY_CONTRACT_ADDRESS)