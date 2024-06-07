// app/api/etch-rune/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {
  commitTx,
  waitForTxToMature,
  revealTx,
  findUtxo,
  waitForTxToBeConfirmed,
  getRuneIdByName,
} from 'bc-runes-js'

export async function POST(request: NextRequest) {
  const data = await request.json()
  console.log(data)

  const PAYMENT_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_ADDRESS
  const ORDINALS_ADDRESS = process.env.NEXT_PUBLIC_ORDINALS_ADDRESS
  const WIF = process.env.NEXT_PUBLIC_WIF

  try {
    const {
      revealTxHash,
      commitTxHash,
      name,
      symbol,
      premine,
      amount,
      cap,
      address,
      divisibility,
    } = data

    if (revealTxHash) {
      await waitForTxToBeConfirmed(revealTxHash)
    } else if (commitTxHash) {
      await waitForTxToMature(commitTxHash)
    } else {
      const commitData = await commitTx({ name })
      const { commitTxHash, scriptP2trAddress, tapLeafScript } = commitData
      await waitForTxToMature(commitTxHash)
      const commitUtxo = await findUtxo(scriptP2trAddress, commitTxHash)
      commitUtxo.tapLeafScript = tapLeafScript
      const { revealTxHash } = await revealTx({
        commitUtxo,
        name,
        amount,
        cap,
        symbol,
        divisibility,
        premine,
      })
      await waitForTxToBeConfirmed(revealTxHash)
      return NextResponse.json({ revealTxHash })
    }
  } catch (error) {
    console.log('Error on submit:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
