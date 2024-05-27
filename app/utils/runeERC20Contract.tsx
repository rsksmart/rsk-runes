import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { address } from './address';
import runeFactory from './abi/RuneFactory.json';

const CONTRACT_ADDRESS = address.factory;
const ABI = runeFactory.abi;

interface Params {
  name: string;
  symbol: string;
  initialSupply: ethers.BigNumberish;
  initialOwner: string;
  salt: string;
}

type Props = {
  name: string;
  symbol: string;
  initialSupply: ethers.BigNumberish;
  initialOwner: string;
};

export function RuneERC20({
  name,
  symbol,
  initialOwner,
  initialSupply,
}: Props) {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [params, setParams] = useState<Params | null>(null);
  const PRIVATE_KEY = process.env.REACT_APP_PK;
  const RPC_URL = process.env.REACT_APP_RPC_URL;

  const connectToBlockchain = async () => {
    const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY ?? '', rpcProvider);
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    setProvider(rpcProvider);
    setWallet(wallet);
    setContract(contractInstance);
  };

  const getTokenAddress = async () => {
    if (!contract) return;

    const salt = generateSalt();

    const tokenAddress = await contract.getTokenAddress(
      name,
      symbol,
      initialSupply,
      initialOwner,
      salt
    );
    setTokenAddress(tokenAddress);
    setParams({ name, symbol, initialSupply, initialOwner, salt });
  };

  function generateSalt(): string {
    const randomString = new Date().toISOString() + Math.random().toString();
    const salt = ethers.id(randomString);
    console.log('Generated salt:', salt);
    return salt;
  }

  return (
    <div>
      <h1>Runes</h1>
    </div>
  );
}
