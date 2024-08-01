export interface FormData {
  name?: string
  symbol?: string
  premine?: number
  amount?: number
  cap?: number
  address?: string
}
export interface FormDataRuneToBTC {
  name: string
  amount: string
  address: string
}

export interface EtchTabProps {
  setRuneProps: Function
  setCommitTxHash: Function
  isNft: boolean
  setIsNft: Function
}
