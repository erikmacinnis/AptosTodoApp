import { Aptos, AptosConfig, Network, Account$1, PrivateKey } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

export default aptos;
