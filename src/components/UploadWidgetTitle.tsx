import { UploadCloud } from 'lucide-react'
import { usePendingUploads } from '../store/uploads'

const UploadWidgetTitle = () => {
  const { isThereAnyPendingUploads, globalPercentage } = usePendingUploads()

  return (
    <div className="flex items-center w-[150px] gap-1.5 text-sm font-medium">
      <UploadCloud className="text-zinc-400" />
      {isThereAnyPendingUploads ? (
        <span className="flex items-baseline gap-1">
          Uploading <span className="text-xs text-zinc-400 tabular-nums">{globalPercentage}%</span>
        </span>
      ) : (
        <span>Upload files</span>
      )}
    </div>
  )
}

export default UploadWidgetTitle
