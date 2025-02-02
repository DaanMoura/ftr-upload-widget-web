import * as ScrollArea from '@radix-ui/react-scroll-area'

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
          Uploaded files <span className="text-zinc-400 tabular-nums">({uploads.size})</span>
        </span>
      )}

      {isUploadListEmpty ? (
        <span className="text-xs text-zinc-400">No uploads added</span>
      ) : (
        <ScrollArea.Root className="overflow-hidden">
          <ScrollArea.Viewport className="max-h-[400px]">
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
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex touch-none select-none bg-zinc-800 p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-zinc-600 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      )}
    </div>
  )
}
