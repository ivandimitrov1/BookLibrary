const hre = require("hardhat");
const bookLibraryJson = require('../artifacts/contracts/BookLibrary.sol/BookLibrary.json');

const run = async function() {
    const provider = new hre.ethers.providers.JsonRpcProvider("http://localhost:8545/");
    const latestBlock = await provider.getBlock("latest");
	console.log(latestBlock.hash);
	console.log("-----------");
	console.log(latestBlock);

    const deployerWallet = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const ballance = await deployerWallet.getBalance();
    console.log(hre.ethers.utils.formatEther(ballance, 18));

    const notDeployerWallet = new hre.ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);

    const bookLibraryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const bookLibraryDeployerContract = new hre.ethers.Contract(bookLibraryAddress, bookLibraryJson.abi, deployerWallet);

    const bookLibraryNotDeployerContract = await bookLibraryDeployerContract.connect(notDeployerWallet);

    // deployer adds a book, should be sucessful
    const transcation = await bookLibraryDeployerContract.addBook("My first Book", 1);
    const transReceipt = await transcation.wait();
    if (transReceipt.status !== 1) {
        console.log("transaction was not successful");
    }
    
    // not deployer adds a book, should be not successult
    try
    {
        // it thorws an exception, no status is returned ?
        console.log("secondary wallet try to add a book");

        const transcation1 = await bookLibraryNotDeployerContract.addBook("My Book", 1);
        // why do we need it in case of an exception ?
        const transReceipt1 = await transcation1.wait();
        
        if (transReceipt1.status !== 1) {
            console.log("transaction was not successful");
        }
    } catch(error)
    {
        console.log("couldnt add a new book because it is not the owner");
    }


    const bookIds1 = await bookLibraryDeployerContract.getAvailableBookIds();
    console.log('all book ids: ' + bookIds1);

    try {
        console.log("deployer try to borrow book with id:0");
        await bookLibraryDeployerContract.borrowBook(0);
    }
    catch (error) {
        console.log("might be already borrowed");
    }

    const bookIds2 = await bookLibraryDeployerContract.getAvailableBookIds();
    console.log('all book ids: ' + bookIds2);
}

run()