import logo from '@/app/assets/img/logo.svg';

function Navbar() {
  return (
    <nav className='w-full py-4 px-6'>
      <img src={logo.src} alt="logo" />
    </nav>
  )
}

export default Navbar
