import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

const RUNES = [
  {
    name: 'Runes 1',
    symbol: 'ZB-1',
  },
  {
    name: 'Runes 2',
    symbol: 'ZB-2',
  },
  {
    name: 'Runes 3',
    symbol: 'ZB-3',
  }
]
function RunesList() {
  return (
    <div className='my-10 w-full'>
      <Card>
        <CardHeader>
          <CardTitle>Runes List</CardTitle>
        </CardHeader>
        <CardContent>
          {
            RUNES.map((r) => (
              <div className='flex justify-between items-center border border-input my-3 p-2 rounded-lg'>
                <div>
                  <div className='text-gray-500'>Name</div>
                  <div className='text-sm'>{ r.name }</div>
                </div>
                <div>
                  <div className='text-gray-500'>Symbol</div>
                  <div className='text-sm'>{ r.symbol }</div>
                </div>
                <div className='flex gap-2'>
                  <Button type='button' size={'sm'}>Sent to BTC</Button>
                  <Button type='button' size={'sm'}>Mint</Button>
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
