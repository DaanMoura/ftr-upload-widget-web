import * as Collapsible from '@radix-ui/react-collapsible'
import { Minimize2 } from 'lucide-react'
import { Button } from './ui/Button'
import UploadWidgetTitle from './UploadWidgetTitle'

export const UploadWidgetHeader = () => {
  return (
    <div className="flex items-center justify-between w-full p-4 py-2 border-b bg-white/2 border-zinc-800">
      <UploadWidgetTitle />
      <Collapsible.Trigger asChild>
        <Button size="icon" className="-mr-2">
          <Minimize2 />
        </Button>
      </Collapsible.Trigger>
    </div>
  )
}
