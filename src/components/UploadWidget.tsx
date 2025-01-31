import * as Collapsible from '@radix-ui/react-collapsible'
import { motion, useCycle } from 'motion/react'

import { UploadWidgetDropzone } from './UploadWidgetDropzone'
import { UploadWidgetHeader } from './UploadWidgetHeader'
import { UploadWidgetUploadList } from './UploadWidgetUploadList'
import { UploadWidgetMinimizedButton } from './UploadWidgetMinimizedButton'

const TRANSITION_DURATION = 0.15

export const UploadWidget = () => {
  const [isWidgetOpen, toggleWidgetOpen] = useCycle(false, true)

  return (
    <Collapsible.Root onOpenChange={() => toggleWidgetOpen()}>
      <motion.div
        className="bg-zinc-900 w-[360px] overflow-hidden rounded-xl shadow-shape"
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
            height: 'auto',
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
