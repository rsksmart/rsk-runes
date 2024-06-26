import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { IRune } from '@/lib/types/RuneInfo'

function RunesList({ items }: { items:IRune[] }) {
  const route = useRouter();
  return (
    <div className='my-10 w-full'>
      <Card>
        <CardHeader>
          <CardTitle>Runes List</CardTitle>
        </CardHeader>
        <CardContent>
          {
            items?.length === 0 ?
              <div className='flex justify-center text-2xl text-gray-500 italic'>
                No runes
              </div>
            :
            items?.map((r, i) => (
              <div key={i} className='flex justify-between items-center border border-input my-3 p-2 h-16 rounded-lg'>
                <div className='flex flex-col justify-start items-start h-full'>
                  <div className='text-gray-500'>Name</div>
                  <div className='text-sm'>{ r.name }</div>
                </div>
                <div className='flex flex-col justify-start items-start h-full'>
                  <div className='text-gray-500'>Symbol</div>
                  <div className='text-sm'>{ r.symbol }</div>
                </div>
                <div className='flex flex-col justify-start items-start h-full'>
                  <div className='text-gray-500'>Amount</div>
                  <div className='text-sm'>{ r.maxSupply }</div>
                </div>
                <div className='flex gap-2'>
                  <Button type='button' size={'sm'} onClick={() => route.push('/runes/runes-to-btc')}>Sent to BTC</Button>
                  <Button type='button' size={'sm'} onClick={() => route.push('/runes/mint')}>Mint</Button>
                </div>
              </div>
            ))
          }
        </CardContent>
      </Card>
    </div>
  )
}

export default RunesList
