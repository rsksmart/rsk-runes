import { ECPairFactory, ECPairAPI } from 'ecpair'
import { RuneId, Runestone, none, some } from 'runelib'
import ecc from '@bitcoinerlab/secp256k1'

export async function mint() {
  const ECPair: ECPairAPI = ECPairFactory(ecc)
  const mintstone = new Runestone([], none(), some(new RuneId(1, 0)), some(1))

  const keyPair = ECPair.fromWIF(yourKey, network)

  const { address } = payments.p2wpkh({ pubkey: keyPair.publicKey, network })

  console.log('address:', address)

  const utxos = await waitUntilUTXO(address as string)
  console.log(`Using UTXO ${utxos[0].txid}:${utxos[0].vout}`)

  const psbt = new Psbt({ network })
  psbt.addInput({
    hash: utxos[0].txid,
    index: utxos[0].vout,
    witnessUtxo: {
      value: utxos[0].value,
      script: Address.toOutputScript(address as string, network),
    },
  })

  psbt.addOutput({
    script: mintstone.encipher(),
    value: 0,
  })

  psbt.addOutput({
    address: ord_address, // ord address
    value: 10000,
  })

  const fee = 5000

  const change = utxos[0].value - fee - 10000

  psbt.addOutput({
    address: change_address, // change address
    value: change,
  })

  await signAndSend(keyPair, psbt, address as string)
}
