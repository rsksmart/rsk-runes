import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { address } from '../address'
import runeFactory from '../abi/RuneFactory.json'

const CONTRACT_ADDRESS = address.factory
const ABI = runeFactory.abi

interface Params {
  name: string
  symbol: string
  initialSupply: ethers.BigNumberish
  initialOwner: string
  salt: string
}

interface UseRuneERC20Props {
  name: string
  symbol: string
  initialSupply: ethers.BigNumberish
  initialOwner: string
  runeID: string
}

export const useRuneERC20 = ({
  name,
  symbol,
  initialOwner,
  initialSupply,
  runeID,
}: UseRuneERC20Props) => {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null)
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [tokenAddress, setTokenAddress] = useState<string | null>(null)
  const [params, setParams] = useState<Params | null>(null)
  const [salt, setSalt] = useState<string | null>(null)

  useEffect(() => {
    connectToBlockchain()
  }, [])

  const connectToBlockchain = async () => {
    console.log('Connecting to blockchain')
    const PK =
      process.env.REACT_APP_PK ||
      '29b4170eb971bb80429774eb210b0096e14ec40908bf8dcb31ff49894149b1e8'
    const rpcProvider = new ethers.JsonRpcProvider(
      process.env.REACT_APP_RPC_URL ||
        'https://go.getblock.io/2d127e75326e46c8b6a3d1b83dc9d666'
    )

    if (!rpcProvider || !PK) {
      console.error('Could not connect to blockchain')
      return
    }
    try {
      const wallet = new ethers.Wallet(PK, rpcProvider)
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        wallet
      )

      setProvider(rpcProvider)
      setWallet(wallet)
      setContract(contractInstance)
      console.log('Connected to blockchain')
    } catch (error) {
      console.log('Error loading signer:', error)
    }
  }

  const getTokenAddress = async () => {
    if (!contract) return

    const salt = generateSalt()
    setSalt(salt)
    console.log('Getting token address')
    console.log('Params:', name, symbol, initialSupply, initialOwner, salt)

    try {
      const tokenAddress = await contract.getTokenAddress(
        name,
        symbol,
        initialSupply,
        initialOwner,
        salt
      )
      setTokenAddress(tokenAddress)
      setParams({ name, symbol, initialSupply, initialOwner, salt })
    } catch (error) {
      console.error('Error getting token address:', error)
    }
  }

  const createRune = async () => {
    console.log('Creating rune')
    if (!contract || !params) return

    const { name, symbol, initialSupply, initialOwner, salt } = params
    console.log(
      'Creating rune with params:',
      name,
      symbol,
      initialSupply,
      initialOwner,
      salt
    )
    const newcontract = await contract.createRune(
      name,
      symbol,
      initialSupply,
      initialOwner,
      runeID,
      salt
    )
  }

  const generateSalt = (): string => {
    const randomString = new Date().toISOString() + Math.random().toString()
    const salt = ethers.id(randomString)
    console.log('Generated salt:', salt)
    return salt
  }

  return {
    tokenAddress,
    getTokenAddress,
    createRune,
    connectToBlockchain,
  }
}
