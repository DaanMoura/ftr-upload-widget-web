import * as Progress from '@radix-ui/react-progress'
import { motion } from 'motion/react'
import { Download, ImageUp, Link2, RefreshCcw, X } from 'lucide-react'
import { Button } from './ui/Button'
import { formatBytes } from '../utils/format-bytes'
import type { Upload } from '../types/upload'
import { useUploads } from '../store/uploads'
import { useCallback, useMemo } from 'react'
import { calculateProgress } from '../utils/progress'

const CircleSeparator = () => <div className="size-1 rounded-full mb-0.5 bg-zinc-700" />

interface UploadWidgetUploadItemProps {
  upload: Upload
}

export const UploadWidgetUploadItem = ({ upload }: UploadWidgetUploadItemProps) => {
  const { cancelUpload } = useUploads()

  const progress = useMemo(
    () =>
      upload.compressedSizeInBytes
        ? calculateProgress(upload.uploadSizeInBytes, upload.compressedSizeInBytes)
        : 0,
    [upload]
  )

  const onCopyClick = useCallback(() => {
    if (!upload.remoteUrl) return
    navigator.clipboard.writeText(upload.remoteUrl)
  }, [upload])

  return (
    <motion.div
      // initial={{ scale: 0.6 }}
      // animate={{ scale: 1 }}
      // transition={{ type: 'tween', duration: 0.3 }}
      variants={{
        hidden: { opacity: 0, scale: 0.6 },
        visible: { opacity: 1, scale: 1 }
      }}
      className="px-3 py-2 rounded-lg flex flex-col gap-3 shadow-shape-content bg-white/2 relative overflow-hidden"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium flex items-center gap-1 max-w-[200px]">
          <ImageUp className="size-3 text-zinc-300" />
          <span>{upload.name}</span>
        </span>

        <span className="text-xxs text-zinc-400 flex gap-1.5 items-center">
          <span className="line-through">{formatBytes(upload.originalSizeInBytes)}</span>
          <CircleSeparator />
          <span>
            {formatBytes(upload.compressedSizeInBytes ?? upload.uploadSizeInBytes)}
            <span className="text-green-400 ml-1">-94%</span>
          </span>
          <CircleSeparator />

          {upload.status === 'success' && <span>100%</span>}
          {upload.status === 'progress' && <span className="tabular-nums">{progress}%</span>}
          {upload.status === 'error' && <span className="text-red-400">Error</span>}
          {upload.status === 'canceled' && <span className="text-amber-400">Canceled</span>}
        </span>
      </div>

      <Progress.Root
        value={upload.status === 'progress' ? progress : 100}
        data-status={upload.status}
        className="group bg-zinc-800 rounded full h-1 overflow-hidden"
      >
        <Progress.Indicator
          className="bg-indigo-500 h-1 transition-all group-data-[status=success]:bg-green-400 
          group-data-[status=error]:bg-red-400 group-data-[status=canceled]:bg-amber-400"
          style={{ width: upload.status === 'progress' ? `${progress}%` : '100%' }}
        />
      </Progress.Root>

      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
        <Button size="icon-sm" disabled={upload.status !== 'success'}>
          <Download />
          <span className="sr-only">Download compressed image</span>
        </Button>

        <Button disabled={!upload.remoteUrl} onClick={onCopyClick} size="icon-sm">
          <Link2 />
          <span className="sr-only">Copy remote URL</span>
        </Button>

        <Button disabled={!['canceled', 'error'].includes(upload.status)} size="icon-sm">
          <RefreshCcw />
          <span className="sr-only">Retry upload</span>
        </Button>

        <Button
          disabled={upload.status !== 'progress'}
          size="icon-sm"
          onClick={() => cancelUpload(upload.id)}
        >
          <X />
          <span className="sr-only">Cancel upload</span>
        </Button>
      </div>
    </motion.div>
  )
}
