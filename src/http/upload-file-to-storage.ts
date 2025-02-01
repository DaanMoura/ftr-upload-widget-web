import axios from 'axios'
import { ErrorGuard } from '../types/error-guard'

const API_URL = 'http://localhost:3333'

interface UploadFileToStorageParams {
  file: File
}

interface UploadResponse {
  url: string
}

export const uploadFileToStorage = async ({
  file
}: UploadFileToStorageParams): Promise<ErrorGuard<UploadResponse>> => {
  const data = new FormData()
  data.append('file', file)

  try {
    const response = await axios.post<{ url: string }>(API_URL + '/uploads', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return [undefined, { url: response.data.url }]
  } catch (error) {
    return [error, undefined]
  }
}
