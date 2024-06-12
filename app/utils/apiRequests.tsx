interface commitTxData {
  name: string
  action: string
}
export const getRequest = async (url: string) => {
  try {
    const response = await fetch(url)
    const json = await response.json()
    return json
  } catch (error) {
    console.log('Error on getRequest:', error)
    return { error: 'Internal Server Error' }
  }
}
export const postRequest = async (data: commitTxData) => {
  try {
    const response = await fetch('/api/etch-rune', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const json = await response.json()
    return json
  } catch (error) {
    console.log('Error on commitTx:', error)
    return { error: 'Internal Server Error' }
  }
}
