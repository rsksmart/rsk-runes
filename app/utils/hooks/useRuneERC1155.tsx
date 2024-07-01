import { useEffect, useState } from 'react'
import { ethers, BigNumberish } from 'ethers'
import rune1155 from '../abi/Rune1155.json'
import { toast } from 'react-toastify'
import { IRune } from '@/lib/types/RuneInfo'
import { useAuth } from '@/app/context/AuthContext'

export interface UseRuneERC1155Props {
  uri: string
  name: string
  symbol: string
  receiver: string
  premine?: number
  amount?: number
  cap?: number
  divisibility?: number
}
export interface FreezeTxData {
  runeName: string
  amount: BigNumberish
  receiver: string
  freezeTxHash?: string
  transferRuneTxHash?: string
}
export const useRuneERC1155 = () => {
  const [txHash, setTxHash] = useState<string | null>(null)
  const [runes, setRunes] = useState<IRune[] | null>([])
  const [txStatus, setTxStatus] = useState<string | null>(null)
  const [txFreezeStatus, setTxFreezeStatus] = useState<string | null>(null)
  const { address: walletAddress } = useAuth()

  const PK = process.env.NEXT_PUBLIC_APP_PK!
  const RPC_URL = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  )
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!
  const ABI = rune1155.abi

  const wallet = new ethers.Wallet(PK, RPC_URL)
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    wallet
  )

  if (!PK) {
    throw new Error('Set private key')
  }
  if (!RPC_URL) {
    throw new Error('Set network RPC url')
  }
  if (!CONTRACT_ADDRESS) {
    throw new Error('Set RuneToken contract address')
  }
  if (!contract) {
    throw new Error(`Error instantiating contract ${CONTRACT_ADDRESS}`)
  }
  if (!wallet) {
    throw new Error('Error instantiating a wallet with given private key and RPC url')
  }

  const mintNonFungible = async (runeData: UseRuneERC1155Props) => {
    try {
      const { uri, name, symbol, receiver } = runeData
      setTxStatus('processing')
      const txResponse = await contract.mintNonFungible(
        `${uri} TODO: retrieve and save metadata`,
        name,
        symbol,
        receiver
      )
      const { hash } = await txResponse.wait()
      if (hash) setTxStatus('success')
      return hash
    } catch (error) {
      console.log({ error })
    }
  }

  const freezeNonFungible = async (runeName: string) => {
    try {
      setTxFreezeStatus('processing')
      const txResponse = await contract.freezeTokens(
        runeName,
        '1',
        walletAddress
      )
      const { hash } = await txResponse.wait()
      setTxFreezeStatus('success')
      return hash
    } catch (error) {
      console.log('error on freezing token', error)
      toast.error('Error on freezing token')
    }
  }

  const getUserRunes = async () => {
    try {
      const items = await contract.getUserTokens(walletAddress)
      if (items.length === 0) return null
      let runes: IRune[] = []
      for (const item of items) {
        const runeInfo = await contract.getTokenInfo(item, walletAddress)
        const newItem: IRune = {
          uri: runeInfo[0],
          name: runeInfo[1],
          symbol: runeInfo[2],
          maxSupply: runeInfo[3].toString(),
          currentSupply: runeInfo[4].toString(),
          defaultMintAmount: runeInfo[5].toString(),
          userBalance: runeInfo[6][1].toString(),
          tokenId: item.toString(),
        }
        runes.push(newItem)
      }
      console.log('itemsArray', runes)
      console.log('item 0 is', runes[0])
      setRunes(runes)
    } catch (error) {
      console.error('error on fetching ', error)
    }
  }
  return {
    txHash,
    mintNonFungible,
    getUserRunes,
    freezeNonFungible,
    runes,
    contract,
    txStatus,
    txFreezeStatus,
  }
}
