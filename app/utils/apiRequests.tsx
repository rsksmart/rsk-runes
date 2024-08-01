import { toast } from 'react-toastify'

export const getRequest = async (url: string) => {
  try {
    const response = await fetch(url)
    const json = await response.json()
    return json
  } catch (error) {
    toast.error(`Error on request: ${error}`)
    return { error: error }
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
    toast.error(`Error on request: ${error}`)
    return { error: error }
  }
}
