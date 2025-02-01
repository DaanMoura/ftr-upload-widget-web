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
  processUpload: (uploadId: string) => Promise<void>
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

      const [compressError, compressedFile] = await compressImage({
        file: upload.file,
        maxWidth: 200,
        maxHeight: 200,
        quality: 0.5
      })

      if (compressError) {
        updateUpload(uploadId, { status: 'error' })
        return
      }

      updateUpload(uploadId, { compressedSizeInBytes: compressedFile.size })

      const [error] = await uploadFileToStorage(
        {
          file: compressedFile,
          onProgress: sizeInBytes => {
            updateUpload(uploadId, { uploadSizeInBytes: sizeInBytes })
          }
        },
        { signal: upload.abortController.signal }
      )

      let status: UploadStatus = 'success'
      if (error) {
        status = 'error'
        if (error instanceof CanceledError) {
          status = 'canceled'
        }
      }

      updateUpload(uploadId, { status })
    }

    const addUploads = (files: File[]) => {
      for (const file of files) {
        const uploadId = crypto.randomUUID()
        const abortController = new AbortController()

        const upload: Upload = {
          id: uploadId,
          name: file.name,
          file,
          status: 'progress',
          abortController,
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

      upload.abortController.abort()
    }

    return {
      uploads: new Map(),
      addUploads,
      processUpload,
      cancelUpload
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
            acc.total += upload.compressedSizeInBytes
            acc.uploaded += upload.uploadSizeInBytes
          }

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
