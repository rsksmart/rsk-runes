import { IRune } from '@/lib/types/RuneInfo'
import { useRouter } from 'next/navigation';
import React from 'react'
import { Button } from '../ui/button';
import { ROUTER } from '@/constants';
import { useAuth } from '@/app/context/AuthContext';

function RuneItem({ rune }: { rune: IRune }) {
  const route = useRouter();
  const { setRune } = useAuth();

  const handleRouter = (rune: IRune) => {
    setRune(rune);
    route.push(ROUTER.RUNES_TO_BTC);
  }

  return (
    <div className='flex justify-between items-center border border-input my-3 p-2 h-16 rounded-lg'>
      <div className='flex flex-col justify-start items-start h-full'>
          <div className='text-gray-500'>Name</div>
          <div className='text-sm'>{ rune.name }</div>
        </div>
        <div className='flex flex-col justify-start items-start h-full'>
          <div className='text-gray-500'>Symbol</div>
          <div className='text-sm'>{ rune.symbol }</div>
        </div>
        <div className='flex flex-col justify-start items-start h-full'>
          <div className='text-gray-500'>Amount</div>
          <div className='text-sm'>{ rune.maxSupply }</div>
        </div>
        <div className='flex gap-2'>
          <Button type='button' size={'sm'} onClick={() => handleRouter(rune)}>Sent to BTC</Button>
          <Button type='button' size={'sm'} disabled onClick={() => route.push(ROUTER.MINT)}>Mint</Button>
        </div>
    </div>
  )
}

export default RuneItem
