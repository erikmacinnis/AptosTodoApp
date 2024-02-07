require('dotenv').config();
const { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey, AccountAddress } = require("@aptos-labs/ts-sdk");

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

async function getAccount() {
    const derivationPath = process.env.DERIVATION_PATH
    const seedPhrase = process.env.MNEMONIC_PHRASE

    const privKey = await Ed25519PrivateKey.fromDerivationPath(derivationPath, seedPhrase)
    const account = await Account.fromPrivateKey({privateKey: privKey})

    return account
}

async function createCollection() {
    const collectionName = process.env.COLLECTION_NAME
    const description = process.env.COLLECTION_DESCRIPTION
    const account = await getAccount();

    const createCollectionTransaction = await aptos.createCollectionTransaction({
        creator: account,
        description: description,
        name: collectionName,
        uri: '',
    })

    const createCollectionTx = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction: createCollectionTransaction,
    });

    await aptos.waitForTransaction({transactionHash:createCollectionTx.hash});

    console.log(createCollectionTx)
}

createCollection()