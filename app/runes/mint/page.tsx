import BackIcon from '@/components/icons/BackIcon'
import MintTab from '@/components/tabs/MintTab'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div className="w-[50%]">
      <Link href={'/runes'}>
        <BackIcon className="w-10 h-7 fill-white my-4" />
      </Link>
      <MintTab />
    </div>
  )
}

export default page
