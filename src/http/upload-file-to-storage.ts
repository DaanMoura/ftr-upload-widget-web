import axios from 'axios'
import { ErrorGuard } from '../types/error-guard'

const API_URL = 'http://localhost:3333'

interface UploadFileToStorageParams {
  file: File
  onProgress: (sizeInBytes: number) => void
}

interface UploadFileToStorageOptions {
  signal?: AbortSignal
}

interface UploadResponse {
  url: string
}

export const uploadFileToStorage = async (
  { file, onProgress }: UploadFileToStorageParams,
  opts?: UploadFileToStorageOptions
): Promise<ErrorGuard<UploadResponse>> => {
  const data = new FormData()
  data.append('file', file)

  try {
    const response = await axios.post<{ url: string }>(API_URL + '/uploads', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      signal: opts?.signal,
      onUploadProgress: progressEvent => {
        onProgress(progressEvent.loaded)
      }
    })

    return [undefined, { url: response.data.url }]
  } catch (error) {
    return [error as never, undefined]
  }
}
