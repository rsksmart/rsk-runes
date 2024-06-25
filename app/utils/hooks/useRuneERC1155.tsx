import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { address } from '../address'
import rune1155 from '../abi/Rune1155.json'
import { toast } from 'react-toastify'
import { Rune } from '@/lib/types/RuneInfo'

const CONTRACT_ADDRESS = address.erc1155Token
const ABI = rune1155.abi
export interface UseRuneERC1155Props {
  uri: string
  name: string
  symbol: string
  receiver: string
}

export const useRuneERC1155 = () => {
  const [txHash, setTxHash] = useState<string | null>(null)
  const [runes, setRunes] = useState<Rune[] | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  //replace for useAuth wallet address
  const [user, setUser] = useState("")

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

      if (!contractInstance) {
        throw new Error('There was a problem retrieving RuneToken contract.')
      } else if (!wallet) {
        throw new Error('There was a problem connecting with Metamask.')
      }

      //replace for useAuth wallet address
      setUser(wallet.address)
      setContract(contractInstance)
      console.log('Rune Custom Hook Connected to RSK chain')
    } catch (error) {
      toast.error('Error loading signer on Rune hook')
    }
  }

  const mintNonFungible = async (runeData: UseRuneERC1155Props) => {
    try {
      const {
        uri,
        name,
        symbol,
        receiver
      } = runeData

      const txResponse = await contract!.mintNonFungible(`${uri} TODO: retrieve and save metadata`, name, symbol, receiver)
      const { hash } = await txResponse.wait()

      return hash
    } catch (error) {
      console.log({ error })
    }
  }

  const getUserRunes = async () => {
    try {
      console.log('contract is ', contract)

      if (!contract) return
      const items = await contract.getUserTokens(user)
      console.log('items', items)
      console.log('items', items.length)
      if (items.length === 0) return null
      console.log('item 0', items[0]?.toString() ?? 'no items')
      let runes: Rune[] = []
      for (const item of items) {
        const runeInfo = await contract.getTokenInfo(item, user)
        console.log('itemInfo', runeInfo)
        const newItem: Rune = {
          uri: runeInfo[0],
          name: runeInfo[1],
          symbol: runeInfo[2],
          maxSupply: runeInfo[3].toString(),
          currentSupply: runeInfo[4].toString(),
          defaultMintAmount: runeInfo[5].toString(),
          userBalance: runeInfo[6].toString(),
          tokenId: item.toString(),
        }
        console.log('newItem', newItem)
        runes.push(runeInfo)
      }
      console.log('itemsArray', runes)
      console.log('item 0 is', runes[0])
      console.log('item 0 name is', runes[0].name)
      setRunes(runes)
    } catch (error) {
      console.error('error on fetching ', error)
    }
  }
  return {
    txHash,
    mintNonFungible,
    getUserRunes,
    runes,
    contract
  }
}
