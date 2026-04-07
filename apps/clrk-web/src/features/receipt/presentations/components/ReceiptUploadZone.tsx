import { useCallback, useRef } from 'react'
import { CloudUpload, CheckCircle } from 'lucide-react'
import { useReceiptStore } from '../../stores/useReceiptStore'

const TOTAL_SEGMENTS = 20

export default function ReceiptUploadZone() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { uploadState, setUploadPhase, setUploadProgress, resetUpload } = useReceiptStore()

  const simulateProcessing = useCallback((fileName: string) => {
    setUploadPhase('processing', fileName)
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setUploadPhase('complete', fileName)
      }
    }, 80)
  }, [setUploadPhase, setUploadProgress])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) simulateProcessing(file.name)
    },
    [simulateProcessing],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) simulateProcessing(file.name)
    },
    [simulateProcessing],
  )

  const filledSegments = Math.round((uploadState.progress / 100) * TOTAL_SEGMENTS)

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        className={`relative flex min-h-56 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-colors ${
          uploadState.phase === 'dragging'
            ? 'border-[#D71921] bg-[#D71921]/5'
            : 'border-[#CCCCCC] bg-white hover:border-[#999999]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setUploadPhase('dragging') }}
        onDragLeave={() => { if (uploadState.phase === 'dragging') setUploadPhase('idle') }}
        onDrop={handleDrop}
        onClick={() => uploadState.phase === 'idle' && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload receipt"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="sr-only"
          onChange={handleFileChange}
        />

        {uploadState.phase === 'idle' || uploadState.phase === 'dragging' ? (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F5F5]">
              <CloudUpload size={24} className="text-[#666666]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#000]">Drop your receipt here</p>
              <p className="mt-1 text-xs text-[#666666]">or click to browse — JPG, PNG, PDF</p>
            </div>
          </>
        ) : uploadState.phase === 'processing' ? (
          <>
            <p className="nd-mono text-xs uppercase tracking-widest text-[#666666]">
              Processing
            </p>
            <div className="flex gap-1">
              {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                <span
                  key={i}
                  className="h-4 w-2 rounded-sm transition-all duration-150"
                  style={{
                    background: '#D71921',
                    opacity: i < filledSegments ? 1 : 0.15,
                  }}
                />
              ))}
            </div>
            <p className="nd-mono text-xs text-[#999999]">
              {uploadState.progress}%
            </p>
          </>
        ) : uploadState.phase === 'complete' ? (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4A9E5C]/10">
              <CheckCircle size={28} className="text-[#4A9E5C]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#000]">{uploadState.fileName}</p>
              <p className="mt-1 text-xs text-[#4A9E5C]">Receipt scanned successfully</p>
            </div>
            <button
              className="nd-mono mt-1 text-xs uppercase tracking-wider text-[#999999] underline hover:text-[#666]"
              onClick={(e) => { e.stopPropagation(); resetUpload() }}
            >
              Upload another
            </button>
          </>
        ) : null}
      </div>

      {/* Tips */}
      {uploadState.phase === 'idle' && (
        <div className="rounded-lg border-l-2 border-[#D71921] bg-white px-4 py-3">
          <p className="nd-mono text-xs uppercase tracking-widest text-[#D71921]">Tips</p>
          <ul className="mt-2 space-y-1 text-xs text-[#666666]">
            <li>· Make sure the receipt is fully visible and not blurry</li>
            <li>· Good lighting improves AI extraction accuracy</li>
            <li>· Supported: photos, scans, PDF receipts</li>
          </ul>
        </div>
      )}
    </div>
  )
}
