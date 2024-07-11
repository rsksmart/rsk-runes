// app/api/etch-rune/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {
  getRuneIdByName,
  getConfirmations,
  transferTx,
  init,
  //@ts-ignore
} from 'bc-runes-js'

export async function POST(request: NextRequest) {
  const data = await request.json()
  try {
    const { action, amount, to, runeId } = data
    const taprootAddress = process.env.NEXT_PUBLIC_TAPROOT_ADDRESS
    const wif = process.env.NEXT_PUBLIC_WIF
    const initVariables = {
      taprootAddress,
      wif,
      feePerVByte: 120,
    }
    init(initVariables)
    switch (action) {
      case 'transferRune':
        const txHash = await transferTx([{ amount, to, runeId }])
        return NextResponse.json({ txHash })
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    switch (action) {
      case 'getIdByName':
        const runeName = searchParams.get('name')
        if (!runeName) {
          return NextResponse.json(
            { error: 'Name query parameter is required' },
            { status: 400 }
          )
        }
        const runeId = await getRuneIdByName(runeName)
        return NextResponse.json({ runeId })
      case 'getConfirmations':
        const txHash = searchParams.get('txHash')
        if (!txHash) {
          return NextResponse.json(
            { error: 'txHash query parameter is required' },
            { status: 400 }
          )
        }
        const confirmations = await getConfirmations(txHash)
        return NextResponse.json({ confirmations })
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
