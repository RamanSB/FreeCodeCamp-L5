# Ethers SimpleStorage

This project demonstrates the following:

### <u>Compilation of Solidity Files</u>

Solidity files (file extension .sol) can be compiled in our JS project by using the solcjs node module.
If we are not globally installing the solcjs module, we can invoke:

<pre>yarn solcjs --abi --binary --include-path node_modules/ --base-path . -o . SmartContract.sol</pre>

The contract we are compiling in this project is from our prior lesson - <code>SimpleStorage.sol</code>

The --abi and --binary flags allow us to generate both the .abi and .binary files, these will be required by <code>ethers.js</code> when creating our contract.
<br/><br/>

### <u>Ethers</u>

ethers.js is a library that allows us to intreact with the ethereum blockchain or any EVM compatiable blockchain network.

To connect to a specific network we require the following:

<li>
 RPC_URL
</li>
<li>
 Private key (of an account on the network corresponding to the RPC_URL)
</li>

Using the <code>fs-extra/fs</code> library we can read our compiled abi/binary files in to a variable.

<pre>
const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf8"
    );
const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
);
</pre>

We can also create a providers object & our wallet object - the providers object simply accepts the RPC_URL and the wallet object accepts both a Private Key & the providers object.

Using the 3 following items:

<li>ABI</li>
<li>Binary</li>
<li>Wallet (Implicitly linked to our provider)</li>
<br/>
We can deploy a contract to any network we would like.

<pre>
// Let's create our contract
const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
// Deploy the contract
const contract = await contractFactory.deploy();
// Deployment of a contract is a transaction. Let's wait for a single block confirmation after deployment.
const deploymentReceipt = await contract.deployTransaction.wait(1);
console.log(`Contract has been deployed to ${contract.address}`);
</pre>

We can now access any of the functions on the smart contract via the <code>contract</code> reference. Note to use the await keyword when making any calls on the smart contract as we will want to wait for the transaction associated with interacting with the smart contract to be complete/confirmed.
<br/><br/>

### <u>JS Tricks</u>

Standard <code>.env</code> (dotenv) to hide confidential data - always use an encrypted private key when deploying to mainnets <a href="https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/5">(refer back to pledge)</a>.

Linter, using <code>prettier</code> - <code>.prettierrc</code> file can be used to override format styles - this takes a higher precedence then the format options defined in the "Open User Settings (JSON)".

<code>package.json</code> can have custom scripts such that we can invoke a lengthy command such as the solcjs compilation command within a single command keyword.

Async/Await basics learnt, async functions return promises and for us to get the value from those promises we will need to await the async function calls.
Not doing so, will leave us with a promise which may be in either of the following states:

<li>pending</li>
<li>fulfilled</li>
<li>rejected</li>
<li>settled</li>
<br/><br/>

### <u>Blockchain Basics</u>

Learnt that once we deploy a contract we should await a block confirmation before invoking any other functions on the smart contract - this ensures the contract has been deployed.

When deploying a contract (before we wait for a block confirmation) we have the transaction associated with the deployment, however when we wait (await) for a single block confirmation we receive the transaction / deployment receipt. Patrick (course instructor) emphasises a strong distinction between the two. An easy way to identify the transaction receipt is if we see the 'gasUsed' term (a receipt is a log of a transaction made in the past - hence 'gas<b><u>Used</u></b>').
<br/><br/>

### <u>Others</u>

Learnt to use <code>Ganache</code> to simulate a mock blockchain network.
