import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { address } from '../address'
import runeFactory from '../abi/RuneFactory.json'
import { toast } from 'react-toastify'

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

export interface UseRuneERC20Props {
  name: string
  symbol: string
  initialSupply: ethers.BigNumberish
  initialOwner: string
  runeID: string
  _mintAmount: ethers.BigNumberish
  _maxSupply: ethers.BigNumberish
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
    const PK = process.env.NEXT_PUBLIC_APP_PK
    const rpcProvider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    )

    if (!rpcProvider || !PK) {
      console.error('Not able to connect to blockchain')
      return
    }
    try {
      const wallet = new ethers.Wallet(PK, rpcProvider)
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        wallet
      )

      setContract(contractInstance)
      console.log('Rune Custom Hook Connected to RSK chain')
    } catch (error) {
      toast.error('Error loading signer on Rune hook')
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
