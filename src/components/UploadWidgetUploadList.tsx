import { motion } from 'motion/react'
import { UploadWidgetUploadItem } from './UploadWidgetUploadItem'
import { useUploads } from '../store/uploads'

export const UploadWidgetUploadList = () => {
  const uploads = useUploads(store => store.uploads)
  const isUploadListEmpty = uploads.size === 0

  return (
    <div className="px-3 flex flex-col gap-3">
      {!isUploadListEmpty && (
        <span className="text-xs font-medium">
          Uploaded files <span className="text-zinc-400">({uploads.size})</span>
        </span>
      )}

      {isUploadListEmpty ? (
        <span className="text-xs text-zinc-400">No uploads added</span>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.075
              }
            }
          }}
          className="flex flex-col gap-2"
        >
          {/* <UploadWidgetUploadItem />
          <UploadWidgetUploadItem />
          <UploadWidgetUploadItem />
          <UploadWidgetUploadItem /> */}
          {Array.from(uploads.entries()).map(([uploadId, upload]) => (
            <UploadWidgetUploadItem key={uploadId} upload={upload} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
