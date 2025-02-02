import { create } from 'zustand'
import { enableMapSet } from 'immer'
import { immer } from 'zustand/middleware/immer'
import type { Upload, UploadStatus } from '../types/upload'
import { uploadFileToStorage } from '../http/upload-file-to-storage'
import { CanceledError } from 'axios'
import { calculateProgress } from '../utils/progress'
import { useShallow } from 'zustand/shallow'
import { compressImage } from '../utils/compress-image'

type UploadsState = {
  uploads: Map<string, Upload>
  addUploads: (files: File[]) => void
  cancelUpload: (uploadId: string) => void
  retryUpload: (uploadId: string) => void
}

enableMapSet()

export const useUploads = create<UploadsState, [['zustand/immer', never]]>(
  immer((set, get) => {
    const updateUpload = async (uploadId: string, data: Partial<Upload>) => {
      const upload = get().uploads.get(uploadId)
      if (!upload) return

      set(state => {
        state.uploads.set(uploadId, {
          ...upload,
          ...data
        })
      })
    }

    const processUpload = async (uploadId: string) => {
      const upload = get().uploads.get(uploadId)
      if (!upload) return

      const abortController = new AbortController()

      updateUpload(uploadId, {
        uploadSizeInBytes: 0,
        compressedSizeInBytes: undefined,
        remoteUrl: undefined,
        status: 'progress',
        abortController
      })

      const [compressError, compressedFile] = await compressImage({
        file: upload.file,
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.8
      })

      if (compressError) {
        updateUpload(uploadId, { status: 'error' })
        return
      }

      updateUpload(uploadId, { compressedSizeInBytes: compressedFile.size })

      const [error, uploadResponse] = await uploadFileToStorage(
        {
          file: compressedFile,
          onProgress: sizeInBytes => {
            updateUpload(uploadId, { uploadSizeInBytes: sizeInBytes })
          }
        },
        { signal: abortController.signal }
      )

      let status: UploadStatus = 'success'
      if (error) {
        status = 'error'
        if (error instanceof CanceledError) {
          status = 'canceled'
        }
        return
      }

      updateUpload(uploadId, { status, remoteUrl: uploadResponse.url })
    }

    const addUploads = (files: File[]) => {
      for (const file of files) {
        const uploadId = crypto.randomUUID()

        const upload: Upload = {
          id: uploadId,
          name: file.name,
          file,
          status: 'progress',
          originalSizeInBytes: file.size,
          uploadSizeInBytes: 0
        }

        set(state => {
          state.uploads.set(uploadId, upload)
        })

        processUpload(uploadId)
      }
    }

    const cancelUpload = (uploadId: string) => {
      const upload = get().uploads.get(uploadId)
      if (!upload) return

      upload.abortController?.abort()
    }

    const retryUpload = (uploadId: string) => {
      processUpload(uploadId)
    }

    return {
      uploads: new Map(),
      addUploads,
      cancelUpload,
      retryUpload
    }
  })
)

export const usePendingUploads = () => {
  return useUploads(
    useShallow(store => {
      const isThereAnyPendingUploads = Array.from(store.uploads.values()).some(
        upload => upload.status === 'progress'
      )

      if (!isThereAnyPendingUploads) {
        return {
          isThereAnyPendingUploads,
          globalPercentage: 100
        }
      }

      const { total, uploaded } = Array.from(store.uploads.values()).reduce(
        (acc, upload) => {
          if (upload.compressedSizeInBytes) {
            acc.uploaded += upload.uploadSizeInBytes
          }

          acc.total += upload.compressedSizeInBytes || upload.originalSizeInBytes

          return acc
        },
        { total: 0, uploaded: 0 }
      )

      const globalPercentage = calculateProgress(uploaded, total)

      return {
        isThereAnyPendingUploads,
        globalPercentage
      }
    })
  )
}
