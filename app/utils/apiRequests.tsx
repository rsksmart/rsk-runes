export const getRequest = async (url: string) => {
  try {
    const response = await fetch(url)
    const json = await response.json()
    return json
  } catch (error) {
    return { error: 'Internal Server Error' }
  }
}
export const postRequest = async (url: string, data: any) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const json = await response.json()
    return json
  } catch (error) {
    return { error: 'Internal Server Error' }
  }
}
