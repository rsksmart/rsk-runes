// app/api/etch-rune/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import {
  commitTx,
  revealTx,
  findUtxo,
  getRuneIdByName,
  init,
  getConfirmations,
  //@ts-ignore
} from 'bc-runes-js'

export async function POST(request: NextRequest) {
  const data = await request.json()
  console.log('data in post request is ', data)

  try {
    const {
      action,
      name,
      symbol,
      premine,
      amount,
      cap,
      divisibility,
      tapLeafScript,
    } = data
    const deserializedTapLeafScript = tapLeafScript?.map((item: any) => ({
      controlBlock: Buffer.from(item.controlBlock, 'base64'),
      leafVersion: item.leafVersion,
      script: Buffer.from(item.script, 'base64'),
    }))

    const {
      data: { 1: feePerVByte },
    } = await axios.get('https://blockstream.info/testnet/api/fee-estimates')

    const initVariables = {
      taprootAddress: process.env.NEXT_PUBLIC_TAPROOT_ADDRESS ?? '',
      wif: process.env.NEXT_PUBLIC_WIF ?? '',
      feePerVByte: Math.ceil(feePerVByte),
    }
    console.log('initVariables:', initVariables)

    init(initVariables)
    console.log('Initiated correctly')

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
      case 'revealTx':
        const commitUtxo = await findUtxo(
          data.scriptP2trAddress,
          data.commitTxHash
        )
        console.log('commitUtxo:', commitUtxo)
        console.log(data)
        commitUtxo.tapLeafScript = deserializedTapLeafScript
        const { revealTxHash } = await revealTx({
          commitUtxo,
          name,
          amount,
          cap,
          symbol,
          divisibility,
          premine,
        })
        return NextResponse.json({ revealTxHash })
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
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
        const hasRuneByID = await getRuneIdByName(name)
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
