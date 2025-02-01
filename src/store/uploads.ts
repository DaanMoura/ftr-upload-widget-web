import { create } from 'zustand'
import { enableMapSet } from 'immer'
import { immer } from 'zustand/middleware/immer'
import type { Upload } from '../types/upload'
import { uploadFileToStorage } from '../http/upload-file-to-storage'

type UploadsState = {
  uploads: Map<string, Upload>
  addUploads: (files: File[]) => void
  cancelUpload: (uploadId: string) => void
  processUpload: (uploadId: string) => Promise<void>
}

enableMapSet()

export const useUploads = create<UploadsState, [['zustand/immer', never]]>(
  immer((set, get) => {
    const processUpload = async (uploadId: string) => {
      const upload = get().uploads.get(uploadId)
      if (!upload) return

      const [error] = await uploadFileToStorage(
        { file: upload.file },
        { signal: upload.abortController.signal }
      )

      if (error) {
        set(state => {
          state.uploads.set(uploadId, {
            ...upload,
            status: 'error'
          })
        })
        return
      }

      set(state => {
        state.uploads.set(uploadId, {
          ...upload,
          status: 'success'
        })
      })
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
          abortController
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

      set(state => {
        state.uploads.set(uploadId, {
          ...upload,
          status: 'canceled'
        })
      })
    }

    return {
      uploads: new Map(),
      addUploads,
      processUpload,
      cancelUpload
    }
  })
)
