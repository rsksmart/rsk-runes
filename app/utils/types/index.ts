export interface FormData {
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
  setRevealTxHash: Function
  setCommitTxHash: Function
}
