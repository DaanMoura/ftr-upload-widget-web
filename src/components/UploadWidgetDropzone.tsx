import { useDropzone } from 'react-dropzone'
import { motion } from 'motion/react'
import CircularProgressBar from './ui/CircularProgressBar'
import { useUploads } from '../store/uploads'

export const UploadWidgetDropzone = () => {
  const { addUploads } = useUploads()

  const isThereAnyPendingUpload = false
  const uploadGlobalPercentage = 66

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    onDragEnter() {
      console.log('onDragEnter')
    },
    onDrop(acceptedFiles) {
      console.log({ acceptedFiles })
      addUploads(acceptedFiles)
    }
    // onDrop: acceptedFiles => {
    //   console.log({ acceptedFiles })
    //   addUploads(acceptedFiles)
    // }
  })

  return (
    <motion.div
      className="px-3 flex flex-col gap-3"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'tween', duration: 0.2 }}
    >
      <div
        data-active={isDragActive}
        className="cursor-pointer text-zinc-400 bg-black/20 p-5 
          rounded-lg border border-zinc-700 border-dashed 
          h-32 flex flex-col items-center justify-center gap-1 
          hover:border-zinc-600 transition-colors
          data-[active=true]:bg-indigo-500/10 data-[active=true]:border-indigo-500 data-[active=true]:text-indigo-400
          "
        {...getRootProps()}
      >
        <input type="file" {...getInputProps()} />

        {isThereAnyPendingUpload ? (
          <div className="flex flex-col items-center gap-2.5">
            <CircularProgressBar progress={uploadGlobalPercentage} size={56} strokeWidth={4} />
            <span className="text-xs">Uploading 2 files...</span>
          </div>
        ) : (
          <>
            <span className="text-xs">Drop your files here or</span>
            <span className="text-xs underline">click to open picker</span>
          </>
        )}
      </div>

      <span className="text-xxs text-zinc-400">Only PNG and JPEG files area supported.</span>
    </motion.div>
  )
}
