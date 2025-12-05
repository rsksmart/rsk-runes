import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useAuth } from '@/app/context/AuthContext'

const useConnectWallet = () => {
  const [isError, setIsError] = useState(false)
  const [web3Provider, setWeb3Provider] = useState<
    ethers.BrowserProvider | undefined
  >()
  const { setAddress, setIsLoggedIn } = useAuth()

  const login = useCallback(async () => {
    const { ethereum } = window as any
    try {
      const web3Provider: ethers.BrowserProvider = new ethers.BrowserProvider(
        ethereum
      )
      const signer = await web3Provider.getSigner()
      const address = await signer.getAddress()
      setWeb3Provider(web3Provider)
      setAddress(address)
      setIsLoggedIn(true)
    } catch (error) {
      console.error('Error connecting to wallet', error)
      setIsError(!ethereum)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    login,
    web3Provider,
    isError,
    setIsError,
  }
}

export default useConnectWallet
