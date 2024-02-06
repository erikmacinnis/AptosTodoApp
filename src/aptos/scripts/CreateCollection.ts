const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } = require("@aptos-labs/ts-sdk");

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

const derivationPath = "m/44'/637'/0'/0'/0'"
const mnemonicPhrase = 'drum car expand april six category group illness second garden wet acoustic'

function getAccount2() {
    // Get the current directory of the script
    const currentDir = __dirname;

    // Build the full path to the config file
    const filePath = path.join(currentDir, '../.aptos/config.yaml');

    // Read the YAML file
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Parse the YAML file into a JavaScript object
    const config = yaml.load(fileContents);

    console.log(config.profiles.default.private_key)
    
    // const privateKey = new PrivateKey(config.profiles.default.private_key)

    // console.log(privateKey)
}

async function generateAccount() { 
    const alice = Account.generate();

    await aptos.fundAccount({
        accountAddress: alice.accountAddress,
        amount: 100_000_000,
      });

    return alice
}

async function main() {
    console.log('here')
    const privateKey = Ed25519PrivateKey.fromDerivationPath(derivationPath, mnemonicPhrase)
    console.log(privateKey);
    const alice = await Account.fromPrivateKey({privateKey})
    console.log(alice.accountAddress.toString());
    // const alice = await generateAccount();
    // const bob = await generateAccount()

    // console.log(alice.accountAddress.toString())

    // const collectionName = 'todo-aptos'

    // const createCollectionTransaction = await aptos.createCollectionTransaction({
    //     creator: alice,
    //     description: 'nfts for a todo app',
    //     name: collectionName,
    //     uri: '',
    // })

    // const createCollectionTx = await aptos.signAndSubmitTransaction({
    //     signer: alice,
    //     transaction: createCollectionTransaction,
    // });

    // await aptos.waitForTransaction({transactionHash:createCollectionTx.hash});

    // console.log(createCollectionTx)

    // const mintTokenTransaction = await aptos.mintDigitalAssetTransaction({
    //     creator: alice,
    //     collection: collectionName,
    //     description: 'token for nft for todo app',
    //     name: 'CompletedTodo',
    //     uri: '',
    // });

    // const mintTokenTx =  await aptos.signAndSubmitTransaction({
    //     signer: alice,
    //     transaction: mintTokenTransaction,
    // });

    // await aptos.waitForTransaction({transactionHash:mintTokenTx.hash});

    // console.log(mintTokenTx)
}

main()

