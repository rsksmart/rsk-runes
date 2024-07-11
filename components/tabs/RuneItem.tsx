import { IRune } from '@/lib/types/RuneInfo'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ROUTER } from '@/constants'
import { useAuth } from '@/app/context/AuthContext'

function RuneItem({ rune }: { rune: IRune }) {
  const route = useRouter()
  const { setRune } = useAuth()
  const [isTransferring, setIsTransferring] = useState(false)
  const [bridgeButtonLocked, setBridgeButtonLocked] = useState(false)

  const handleRouter = (rune: IRune) => {
    setRune(rune)
    route.push(ROUTER.RUNES_TO_BTC)
  }

  useEffect(() => {
    const transferRuneInfo = localStorage.getItem('runeToBTCData')
    if (transferRuneInfo) {
      const parsedInfo = JSON.parse(transferRuneInfo)
      if (parsedInfo.runeName === rune.name) {
        setIsTransferring(true)
        setBridgeButtonLocked(false)
      } else {
        if (rune.userBalance === '0') {
          setBridgeButtonLocked(true)
        }
      }
    } else {
      if (rune.userBalance === '0') {
        setBridgeButtonLocked(true)
      }
    }
  }, [])

  return (
    <div className="flex justify-between items-center border border-input my-3 p-2 h-16 rounded-lg">
      <div className="flex flex-col justify-start items-start h-full">
        <div className="text-gray-500">Name</div>
        <div className="text-sm">{rune.name}</div>
      </div>
      <div className="flex flex-col justify-start items-start h-full">
        <div className="text-gray-500">Symbol</div>
        <div className="text-sm">{rune.symbol}</div>
      </div>
      <div className="flex flex-col justify-start items-start h-full">
        <div className="text-gray-500">Amount</div>
        <div className="text-sm">
          {isTransferring
            ? 'Bridge in progress'
            : Number(rune.userBalance) === 0
              ? 'Locked'
              : rune.userBalance}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          size={'sm'}
          onClick={() => handleRouter(rune)}
          disabled={bridgeButtonLocked}
        >
          Bridge to BTC
        </Button>
        <Button
          type="button"
          size={'sm'}
          disabled
          onClick={() => route.push(ROUTER.MINT)}
        >
          Mint
        </Button>
      </div>
    </div>
  )
}

export default RuneItem
