import { RuneId, Runestone, none, some } from 'runelib'
import ecc from '@bitcoinerlab/secp256k1'
import { Psbt, networks, payments } from 'bitcoinjs-lib'
import ECPairFactory, { ECPairAPI, ECPairInterface } from 'ecpair'
import axios from 'axios'
import { toOutputScript } from 'bitcoinjs-lib/src/address'
import { BLOCKSTREAM_BASE_URL } from '@/constants'

export async function mint() {
  const ECPair: ECPairAPI = ECPairFactory(ecc)

  const network = networks.testnet

  const mintstone = new Runestone([], none(), some(new RuneId(1, 0)), some(1))
  const keyPair = ECPair.makeRandom()

  const { address } = payments.p2wpkh({ pubkey: keyPair.publicKey, network })

  console.log('address:', address)

  const utxos = await getUTXOs(address as string)
  console.log(`Using UTXO ${utxos[0].txid}:${utxos[0].vout}`)

  const psbt = new Psbt({ network })

  psbt.addInput({
    hash: utxos[0].txid,
    index: utxos[0].vout,
    witnessUtxo: {
      value: utxos[0].value,
      script: toOutputScript(address as string, network),
    },
  })

  psbt.addOutput({
    script: mintstone.encipher(),
    value: 0,
  })

  psbt.addOutput({
    address: 'tb1pm9rkxwrqddjjyhj8yc0s7gdt4ks5uedgehhaqu93pv9mps8xmdjq07pqgd', // ord address
    value: 10000,
  })

  const fee = 5000

  const change = utxos[0].value - fee - 10000

  psbt.addOutput({
    address: '2N9jgK3Cv8CocHu9ViDvPJhYMmkaeHJojR5', // change address
    value: change,
  })

  await signAndSend(keyPair, psbt, address as string)
}

async function signAndSend(
  keyPair: ECPairInterface,
  psbt: Psbt,
  address: string
) {
  psbt.signAllInputs(keyPair)
  psbt.finalizeAllInputs()

  const tx = psbt.extractTransaction()
  const txHex = tx.toHex()

  const { data } = await axios.post(`${BLOCKSTREAM_BASE_URL}/tx`, txHex)

  console.log('Transaction ID:', data)
}

async function getUTXOs(address: string) {
  const { data: utxos } = await axios.get(UTXO_URL(address))
  console.log(utxos)

  if (!utxos.length) {
    throw Error(`No UTXOs available for address ${address}`)
  } else {
    return utxos
  }
}

const UTXO_URL = (address: string) =>
  `${BLOCKSTREAM_BASE_URL}/address/${address}/utxo`
