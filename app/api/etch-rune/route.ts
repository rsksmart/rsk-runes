// app/api/etch-rune/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {
  commitTx,
  waitForTxToMature,
  revealTx,
  findUtxo,
  waitForTxToBeConfirmed,
  getRuneIdByName,
  init,
  generateAddresses,
  getConfirmations,
  //@ts-ignore
} from 'bc-runes-js'

export async function POST(request: NextRequest) {
  const data = await request.json()
  console.log('data in post request is ', data)

  const PAYMENT_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_ADDRESS
  const ORDINALS_ADDRESS = process.env.NEXT_PUBLIC_ORDINALS_ADDRESS
  const WIF = process.env.NEXT_PUBLIC_WIF

  try {
    const {
      action,
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

    switch (action) {
      case 'commitTx':
        console.log('commitTx:', name)
        const commitData = await commitTx({ name })
        const { commitTxHash, scriptP2trAddress, tapLeafScript } = commitData
        console.log('committxhash:', commitTxHash)
        console.log('scriptP2trAddress:', scriptP2trAddress)
        console.log('tapLeafScript:', tapLeafScript)
        return NextResponse.json({
          commitTxHash,
          scriptP2trAddress,
          tapLeafScript,
        })
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (revealTxHash) {
      await waitForTxToBeConfirmed(revealTxHash)
    } else if (commitTxHash) {
      await waitForTxToMature(commitTxHash)
    } else {
      const commitData = await commitTx({ name })
      const { commitTxHash, scriptP2trAddress, tapLeafScript } = commitData
      //espera y validación
      await waitForTxToMature(commitTxHash) //este no lo usaría si lo actualizamos en el front con getConfirmations()
      //
      //cuando tenga más de 6 confirmaciones
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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    switch (action) {
      case 'getByname':
        const name = searchParams.get('name')
        console.log('name in the GET request:', name)
        if (!name) {
          return NextResponse.json(
            { error: 'Name query parameter is required' },
            { status: 400 }
          )
        }
        console.log('name:', name)

        const hasRuneByID = await getRuneIdByName(name)
        console.log('hasRuneByID:', hasRuneByID)

        if (hasRuneByID && hasRuneByID[0]) {
          return NextResponse.json({
            message: `The name (${name}) is already in use`,
            hasRuneByID: hasRuneByID[0],
          })
        } else {
          return NextResponse.json({
            message: `The name (${name}) is valid`,
            hasRuneByID: null,
          })
        }
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
    console.log('Error on getByname:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
