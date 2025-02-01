import { create } from 'zustand'
import { enableMapSet } from 'immer'
import { immer } from 'zustand/middleware/immer'
import type { Upload } from '../types/upload'
import { uploadFileToStorage } from '../http/upload-file-to-storage'

type UploadsState = {
  uploads: Map<string, Upload>
  addUploads: (files: File[]) => void
}

enableMapSet()

export const useUploads = create<UploadsState, [['zustand/immer', never]]>(
  immer((set, get) => {
    const processUpload = async (uploadId: string) => {
      const upload = get().uploads.get(uploadId)
      if (!upload) return

      await uploadFileToStorage({ file: upload.file })
    }

    const addUploads = (files: File[]) => {
      for (const file of files) {
        const uploadId = crypto.randomUUID()
        const upload: Upload = {
          name: file.name,
          file
        }

        set(state => {
          state.uploads.set(uploadId, upload)
        })

        processUpload(uploadId)
      }
    }

    return {
      uploads: new Map(),
      addUploads,
      processUpload
    }
  })
)
