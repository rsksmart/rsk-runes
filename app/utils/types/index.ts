export interface FormData {
  nft?: string
  name?: string
  symbol?: string
  premine?: number
  amount?: number
  cap?: number
  divisibility?: number
  address?: string
}

export interface EtchTabProps {
  setRuneProps: Function
  setCommitTxHash: Function
}
