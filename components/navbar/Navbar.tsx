import logo from '@/app/assets/img/logo.svg'
import { useAuth } from '@/app/context/AuthContext'
import MetamaskIcon from '../icons/MetamaskIcon'

function Navbar() {
  const { address, logout } = useAuth()

  const formatAddress = () => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
  }

  return (
    <nav className="w-full p-6 flex justify-between">
      <img src={logo.src} alt="logo" />
      {address && (
        <div className="flex gap-4">
          <div className="bg-white flex items-center gap-4 rounded-md text-black px-2 py-1">
            <MetamaskIcon className="w-5 h-5" />
            {formatAddress()}
          </div>
          <button
            onClick={logout}
            className="bg-card border border-border rounded-md px-4 hover:opacity-90"
          >
            logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
