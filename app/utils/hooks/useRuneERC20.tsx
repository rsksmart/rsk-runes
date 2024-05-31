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
  _mintAmount: ethers.BigNumberish
  _maxSupply: ethers.BigNumberish
}

interface UseRuneERC20Props {
  name?: string
  symbol?: string
  initialSupply?: ethers.BigNumberish
  initialOwner?: string
  runeID?: string
  _mintAmount?: ethers.BigNumberish
  _maxSupply?: ethers.BigNumberish
}

export const useRuneERC20 = ({
  name,
  symbol,
  initialOwner,
  initialSupply,
  runeID,
  _mintAmount,
  _maxSupply,
}: UseRuneERC20Props) => {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null)
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [tokenAddress, setTokenAddress] = useState<string | null>(null)
  const [params, setParams] = useState<Params | null>(null)
  const [salt, setSalt] = useState<string | null>(null)
  const [txStatus, setTxStatus] = useState<string | null>(null)
  const [loadingCreateRune, setLoadingCreateRune] = useState<boolean>(false)
  const [createReceipt, setCreateReceipt] = useState<any | null>(null)
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
    console.log(
      'Params:',
      name,
      symbol,
      initialSupply,
      initialOwner,
      salt,
      _mintAmount,
      _maxSupply
    )

    try {
      const tokenAddress = await contract.getTokenAddress(
        name,
        symbol,
        initialSupply,
        initialOwner,
        salt,
        _mintAmount,
        _maxSupply
      )
      setTokenAddress(tokenAddress)
      setParams({
        name: name!,
        symbol: symbol!,
        initialSupply: initialSupply!,
        initialOwner: initialOwner!,
        salt,
        _mintAmount: _mintAmount!,
        _maxSupply: _maxSupply!,
      })
    } catch (error) {
      console.error('Error getting token address:', error)
    }
  }

  const createRune = async () => {
    console.log('Creating rune')
    if (!contract || !params) return
    const {
      name,
      symbol,
      initialSupply,
      initialOwner,
      salt,
      _mintAmount,
      _maxSupply,
    } = params

    console.log(
      'Creating rune with params:',
      name,
      symbol,
      initialSupply,
      initialOwner,
      salt,
      _mintAmount,
      _maxSupply
    )

    try {
      setLoadingCreateRune(true)
      setTxStatus('pending')
      const transaction = await contract.createRune(
        name,
        symbol,
        initialSupply,
        initialOwner,
        runeID,
        salt,
        _mintAmount,
        _maxSupply
      )

      console.log('Transaction sent:', transaction)
      console.log('Transaction hash:', transaction.hash)

      const receipt = await transaction.wait()
      console.log('Transaction confirmed:', receipt)

      if (receipt.status === 1) {
        console.log('Rune created successfully:', receipt)
        setTxStatus('success')
        setCreateReceipt(receipt)
      } else {
        console.error('Transaction failed:', receipt)
        setTxStatus('error')
      }
      setLoadingCreateRune(false)
    } catch (error) {
      console.error('Error creating rune:', error)
      setLoadingCreateRune(false)
      setTxStatus('error')
    }
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
    loadingCreateRune,
    txStatus,
    createReceipt,
  }
}
