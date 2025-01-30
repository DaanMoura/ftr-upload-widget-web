import * as Collapsible from '@radix-ui/react-collapsible'
import { UploadWidgetDropzone } from './UploadWidgetDropzone'
import { UploadWidgetHeader } from './UploadWidgetHeader'
import { UploadWidgetUploadList } from './UploadWidgetUploadList'
import { useState } from 'react'
import { UploadWidgetMinimizedButton } from './UploadWidgetMinimizedButton'

export const UploadWidget = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)

  return (
    <Collapsible.Root onOpenChange={setIsWidgetOpen}>
      <div className="bg-zinc-900 w-[360px] overflow-hidden rounded-xl shadow-shape">
        {!isWidgetOpen && <UploadWidgetMinimizedButton />}

        <Collapsible.Content>
          <UploadWidgetHeader />

          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />
            <div className="box-content h-px border-t bg-zinc-800 border-black/50" />
            <UploadWidgetUploadList />
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  )
}
