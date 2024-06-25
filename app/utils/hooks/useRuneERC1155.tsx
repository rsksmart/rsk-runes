import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { address } from '../address'
import runeFactory from '../abi/RuneFactory.json'
import rune1155 from '../abi/Rune1155.json'
import { toast } from 'react-toastify'
import { IRune } from '@/lib/types/RuneInfo'
import { useAuth } from '@/app/context/AuthContext'

const CONTRACT_ADDRESS = address.erc1155Token
const ABI = rune1155.abi
export interface UseRuneERC1155Props {
  name: string
}
export const useRuneERC1155 = () => {
  const [txHash, setTxHash] = useState<string | null>(null)
  const [items, setItems] = useState<IRune[] | null>([])
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const { provider, address: walletAddress } = useAuth();


  useEffect(() => {
    connectToBlockchain()
  }, [])
  const connectToBlockchain = async () => {
    // const PK = process.env.NEXT_PUBLIC_APP_PK
    // const rpcProvider = new ethers.JsonRpcProvider(
    //   process.env.NEXT_PUBLIC_RPC_URL
    // )

    // if (!rpcProvider || !PK) {
    //   console.error('Not able to connect to blockchain')
    //   return
    // }
    try {
      const signer = await provider?.getSigner();
      console.log('signer: ', signer);
      // const wallet = new ethers.Wallet(PK, rpcProvider)
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      )
      setContract(contractInstance)
      console.log('Rune Custom Hook Connected to RSK chain')
    } catch (error) {
      toast.error('Error loading signer on Rune hook')
    }
  }

  const onMintFungible = async () => {
    try {
    } catch (error) {}
  }
  const onMintNonFungible = async () => {
    try {
    } catch (error) {}
  }
  const getItemsByAddress = async () => {
    try {
      console.log('contract is ', contract)

      if (!contract) return
      console.log('walletAddress: ', walletAddress);
      const items = await contract.getUserTokens(walletAddress)
      console.log('items', items)
      console.log('items', items.length)
      if (items.length === 0) return null
      console.log('item 0', items[0]?.toString() ?? 'no items')
      let itemsArray: IRune[] = []
      for (const item of items) {
        const itemInfo = await contract.getTokenInfo(item)
        console.log('itemInfo', itemInfo)
        const newItem: IRune = {
          uri: itemInfo[0],
          name: itemInfo[1],
          symbol: itemInfo[2],
          maxSupply: itemInfo[3].toString(),
          currentSupply: itemInfo[4].toString(),
          defaultMintAmount: itemInfo[5].toString(),
          tokenId: item.toString(),
        }
        console.log('newItem', newItem)
        itemsArray.push(itemInfo)
      }
      console.log('itemsArray length', itemsArray.length)
      console.log('item 0 is', itemsArray[0])
      console.log('item 0 name is', itemsArray[0].name)
      setItems(itemsArray)
    } catch (error) {
      console.error('error on fetching ', error)
    }
  }
  return {
    txHash,
    onMintFungible,
    onMintNonFungible,
    getItemsByAddress,
    items,
    contract,
  }
}
