import { useEffect, useState } from 'react'
interface IRunes {
  name: string
  symbol: string
  address: string
}

const RUNES: IRunes[] = [
  {
    name: 'Runes 1',
    symbol: 'ZB-1',
    address: ''
  },
  {
    name: 'Runes 2',
    symbol: 'ZB-2',
    address: ''
  },
  {
    name: 'Runes 3',
    symbol: 'ZB-3',
    address: ''
  }
]

export const useFetchRunes = () => {

  const [runes, setRunes] = useState<IRunes[]>();

  const getRunesRootstock = () => {
    setRunes(RUNES);
  }
  const getRuneByAddress = (address: string) => {
    return RUNES.filter((r) => r.address === address);
  }

  useEffect(() => {
    getRunesRootstock()
  }, [])
  return {
    runes,
    getRuneByAddress
  }
}
