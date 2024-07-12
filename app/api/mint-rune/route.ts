import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL
const provider = new ethers.JsonRpcProvider(rpcUrl!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const hash = searchParams.get('hash')

    switch (action) {
      case 'isTxConfirmed':
        const receipt = await provider.getTransactionReceipt(hash!)
        const confirmations = await receipt?.confirmations()

        return NextResponse.json(confirmations! > 0, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
