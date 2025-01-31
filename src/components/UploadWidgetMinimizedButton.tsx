import * as Collapsible from '@radix-ui/react-collapsible'
import { Maximize2 } from 'lucide-react'
import UploadWidgetTitle from './UploadWidgetTitle'

export const UploadWidgetMinimizedButton = () => {
  return (
    <Collapsible.Trigger className="group w-full bg-white/2 py-3 px-5 flex items-center justify-between gap-5 cursor-pointer">
      <UploadWidgetTitle />
      <Maximize2 className="text-zinc-400 group-hover:text-zinc-100" />
    </Collapsible.Trigger>
  )
}
