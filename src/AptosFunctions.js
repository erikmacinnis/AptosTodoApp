import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey, AccountAddress } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

async function getAccount() {
    const derivationPath = window.env.DERIVATION_PATH
    const seedPhrase = window.env.MNEMONIC_PHRASE

    const privKey = await Ed25519PrivateKey.fromDerivationPath(derivationPath, seedPhrase)
    const account = await Account.fromPrivateKey({privateKey: privKey})

    return account
}

async function createCollection() {
    const collectionName = window.env.COLLECTION_NAME
    const description = window.env.COLLECTION_DESCRIPTION
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

async function mintCollectionToken() {
    const collectionName = window.env.COLLECTION_NAME
    const nftUri = window.env.NFT_URI
    const nftName = window.env.NFT_NAME
    const nftDescription = window.env.NFT_DESCRIPTION

    const account = await getAccount();

    const mintTokenTransaction = await aptos.mintDigitalAssetTransaction({
        creator: account,
        collection: collectionName,
        description: nftDescription,
        name: nftName,
        uri: nftUri,
    });

    const mintTokenTx =  await aptos.signAndSubmitTransaction({
        signer: account,
        transaction: mintTokenTransaction,
    });

    await aptos.waitForTransaction({transactionHash:mintTokenTx.hash});

    console.log(mintTokenTx)
}

async function transferLatestNft(address) {
    const account = await getAccount();

    const bobAddr = AccountAddress.fromStringStrict(address)

    const digitalAssets = await aptos.getAccountOwnedTokens({
        accountAddress: account.accountAddress,
    });

    const transferTransaction = await aptos.transferDigitalAssetTransaction({
        sender: account,
        digitalAssetAddress: digitalAssets[digitalAssets.length - 1].token_data_id,
        recipient: bobAddr,
    });

    const transferTx = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction: transferTransaction,
    });

    await aptos.waitForTransaction({transactionHash: transferTx.hash,});

    console.log(transferTx)
}

// transferLatestNft('0x1833f88bba3718fce4e62045b9a30071292309b2206d98457e0ea4594ea2dabe')

async function mintAndTransfer(address) {
    await mintCollectionToken()
    await transferLatestNft(address)
}

export default mintAndTransfer