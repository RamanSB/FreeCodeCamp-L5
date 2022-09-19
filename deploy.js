const fs = require("fs-extra");
const ethers = require("ethers");
const dotenv = require("dotenv");
/**
 * In this file I will use the (solc) compiled solidity smart contract (SimpleStorage.sol)'s ABI & Binaries
 * to deploy the smart contract to the mock blockchain network running locally via Ganache.
 *
 * Ganache will have a RPC URL that we can use to link with ethers.js to hook in to the mock blockchain
 * and deploy our smart contracts there.
 */

// Let's define our main method (it will have to be async so we can allow for promises to be resolved.)
dotenv.config();
const RPC_URL = process.env.RPC_URL;

async function main() {
    // The below 2 files only exist because we have used solc (solidity compiler) to compile our Smart contract - SimpleStorage.sol
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf8"
    );
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    );

    // Let's connect ethers (js) to our Ganache mock blockchain network.
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    // Let's create a wallet from a private key (picking a random wallet from Ganache's accounts).
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Let's create our contract
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    // Deploy the contract
    const contract = await contractFactory.deploy();
    // Deployment of a contract is a transaction. Let's wait for a single block confirmation after deployment.
    const deploymentReceipt = await contract.deployTransaction.wait(1);
    console.log(`Contract has been deployed to ${contract.address}`);

    // interacting directly with the public functions on the smart contract.
    let favoriteNumber = await contract.retrieve(); // gasless function (view & pure functions are gasless when invoked outside of a contract).
    console.log(`Current Favorite Number: ${favoriteNumber}`);
    let transactionResponse = await contract.store("98121241221412515");
    await transactionResponse.wait();
    favoriteNumber = await contract.retrieve();
    console.log(`New Favorite Number: ${favoriteNumber}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
