import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import RuneItem from './RuneItem'
import { useRuneERC1155 } from '@/app/utils/hooks/useRuneERC1155'
import { useEffect, useRef } from 'react'

function RunesList() {
  const { getUserRunes, runes, contract } = useRuneERC1155();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchRunes()
    intervalRef.current = setInterval(fetchRunes, 30000);
    return () => clearInterval(intervalRef.current!);
  }, [contract]);
  
  const fetchRunes = async () => {
    await getUserRunes()
  }
  return (
    <div className='my-10 w-full'>
      <Card>
        <CardHeader>
          <CardTitle>Runes List</CardTitle>
        </CardHeader>
        <CardContent>
          {
            runes?.length === 0 ?
              <div className='flex justify-center text-2xl text-gray-500 italic'>
                No runes
              </div>
            :
            runes?.map((rune, i) => (
              <RuneItem key={i} rune={rune} />
            ))
          }
        </CardContent>
      </Card>
    </div>
  )
}

export default RunesList
