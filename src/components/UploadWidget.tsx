import * as Collapsible from '@radix-ui/react-collapsible'
import { motion, useCycle } from 'motion/react'

import { UploadWidgetDropzone } from './UploadWidgetDropzone'
import { UploadWidgetHeader } from './UploadWidgetHeader'
import { UploadWidgetUploadList } from './UploadWidgetUploadList'
import { UploadWidgetMinimizedButton } from './UploadWidgetMinimizedButton'
import { usePendingUploads, useUploads } from '../store/uploads'
import { useEffect, useRef, useState } from 'react'

const TRANSITION_DURATION = 0.15

export const UploadWidget = () => {
  const { uploads } = useUploads()

  const { isThereAnyPendingUploads } = usePendingUploads()

  const [isWidgetOpen, toggleWidgetOpen] = useCycle(false, true)

  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: it should react to isWidgetOpen and uploads
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [isWidgetOpen, uploads])

  return (
    <Collapsible.Root onOpenChange={() => toggleWidgetOpen()} asChild>
      <motion.div
        ref={contentRef}
        data-progress={isThereAnyPendingUploads}
        className="bg-zinc-900 w-[360px] overflow-hidden rounded-xl 
          data-[state=open]:shadow-shape border border-transparent animate-border 
          data-[state=closed]:rounded-3xl data-[state=closed]:data-[progress=false]:shadow-shape
          data-[state=closed]:data-[progress=true]:[background:linear-gradient(45deg,#09090B,theme(colors.zinc.900)_50%,#09090B)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.zinc.700/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.zinc.600/.48))_border-box]"
        animate={isWidgetOpen ? 'open' : 'closed'}
        variants={{
          closed: {
            width: 'max-content',
            height: 44,
            transition: {
              duration: TRANSITION_DURATION * 2,
              type: 'spring'
            }
          },
          open: {
            width: 360,
            height: contentHeight,
            transition: {
              duration: TRANSITION_DURATION
            }
          }
        }}
      >
        {!isWidgetOpen && <UploadWidgetMinimizedButton />}

        <Collapsible.Content>
          <UploadWidgetHeader />

          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />
            <div className="box-content h-px border-t bg-zinc-800 border-black/50" />
            <UploadWidgetUploadList />
          </div>
        </Collapsible.Content>
      </motion.div>
    </Collapsible.Root>
  )
}
