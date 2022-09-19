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
        const availableBooks = await bookLibraryDeployerContract.getAvailableBooks();
        console.log('available books ' + availableBooks);

    } catch(error) {
        console.log('call failed because of:' + error.reason);
    }

    try {
        console.log('<< deployer tries to add a new book >>');
        const transaction = await bookLibraryDeployerContract.addBook("only one", 0);
        await transaction.wait();
        console.log('should be added');

    } catch(error) {
        console.log('call failed because of:' + error.reason);
    }

    console.log('<< get balance at >>');
    const ballance1 = await deployerWallet.getBalance();
    console.log(hre.ethers.utils.formatEther(ballance1, 18));

    const firstBookId = 0;
    try {
        console.log('<< deployer tries to borrow a book with id:0 >>');
        const transaction1 = await bookLibraryDeployerContract.borrowBook(firstBookId);
        await transaction1.wait();
        console.log('should be borrowed');

    } catch(error) {
        console.log('call failed because of:' + error.reason);
    }

    try {
        console.log('<< deployer tries to get available books >>');
        const availableBooks1 = await bookLibraryDeployerContract.getAvailableBooks();
        console.log('available books: ' + availableBooks1);
    } catch(error) {
        console.log('call failed because of:' + error.reason);
    }

    try {
        console.log('<< deployer tries to return the borrowed book >>');
        const transaction2 = await bookLibraryDeployerContract.returnBook(firstBookId);
        await transaction2.wait();
        console.log('should return the book ');
    } catch(error) {
        console.log('call failed because of:' + error.reason);
    }

    try {
        console.log('<< deployer tries to get available books >>');
        const availableBooks2 = await bookLibraryDeployerContract.getAvailableBooks();
        console.log('available books: ' + availableBooks2);
    } catch(error) {
        console.log('call failed because of:' + error.reason);
    }
}

run(
    process.env.PERSONAL_WALLET_PRIVATE_KEY,
    process.env.RINKEBY_API_KEY,
    process.env.BOOK_LIBRARY_CONTRACT_ADDRESS)