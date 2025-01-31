import * as Progress from '@radix-ui/react-progress'
import { motion } from 'motion/react'
import { Download, ImageUp, Link2, RefreshCcw, X } from 'lucide-react'
import { Button } from './ui/Button'

const CircleSeparator = () => <div className="size-1 rounded-full mb-0.5 bg-zinc-700" />

export const UploadWidgetUploadItem = () => {
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
        <span className="text-xs font-medium flex items-center gap-1">
          <ImageUp className="size-3 text-zinc-300" />
          <span>screenshot.png</span>
        </span>

        <span className="text-xxs text-zinc-400 flex gap-1.5 items-center">
          <span className="line-through">3MB</span>
          <CircleSeparator />
          <span>
            300KB
            <span className="text-green-400 ml-1">-94%</span>
          </span>
          <CircleSeparator />
          <span>45%</span>
        </span>
      </div>

      <Progress.Root className="bg-zinc-800 rounded full h-1 overflow-hidden">
        <Progress.Indicator className="bg-indigo-500 h-1" style={{ width: '45%' }} />
      </Progress.Root>

      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
        <Button size="icon-sm">
          <Download />
          <span className="sr-only">Download compressed image</span>
        </Button>

        <Button size="icon-sm">
          <Link2 />
          <span className="sr-only">Copy remote URL</span>
        </Button>

        <Button size="icon-sm">
          <RefreshCcw />
          <span className="sr-only">Retry upload</span>
        </Button>

        <Button size="icon-sm">
          <X />
          <span className="sr-only">Cancel upload</span>
        </Button>
      </div>
    </motion.div>
  )
}
