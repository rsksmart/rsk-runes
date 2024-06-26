'use client'
import RLogin from "@rsksmart/rlogin";
/*
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
*/
import { trezorProviderOptions } from "@rsksmart/rlogin-trezor-provider";
import { ledgerProviderOptions } from "@rsksmart/rlogin-ledger-provider";
const rpcUrls = {
  30: "https://public-node.rsk.co",
  31: "https://public-node.testnet.rsk.co"
};

const supportedChains = Object.keys(rpcUrls).map(Number);

export const rLogin = new RLogin({
  providerOptions: {
    /*
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: rpcUrls
      }
    },
    portis: {
      package: Portis,
      options: {
        id: "a1c8672b-7b1c-476b-b3d0-41c27d575920",
        network: {
          nodeUrl: "https://public-node.testnet.rsk.co",
          chainId: 31
        }
      }
    },
    */
    "custom-ledger": ledgerProviderOptions,
    "custom-trezor": {
      ...trezorProviderOptions,
      options: {
        manifestEmail: "info@iovlabs.org",
        manifestAppUrl: "https://basic-sample.rlogin.identity.rifos.org/"
      }
    }
  },
  rpcUrls,
  supportedChains
});
