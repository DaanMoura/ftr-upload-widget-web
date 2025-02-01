export type UploadStatus = 'progress' | 'success' | 'error' | 'canceled'

export type Upload = {
  id: string
  name: string
  file: File
  status: UploadStatus
  abortController: AbortController
  originalSizeInBytes: number
  uploadSizeInBytes: number
}
