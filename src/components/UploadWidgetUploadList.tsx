import { motion } from 'motion/react'
import { UploadWidgetUploadItem } from './UploadWidgetUploadItem'

export const UploadWidgetUploadList = () => {
  const isUploadListEmpty = false

  return (
    <div className="px-3 flex flex-col gap-3">
      <span className="text-xs font-medium">
        Uploaded files <span className="text-zinc-400">(2)</span>
      </span>

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
          <UploadWidgetUploadItem />
          <UploadWidgetUploadItem />
          <UploadWidgetUploadItem />
          <UploadWidgetUploadItem />
        </motion.div>
      )}
    </div>
  )
}
