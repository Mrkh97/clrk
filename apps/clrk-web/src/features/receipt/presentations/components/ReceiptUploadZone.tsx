import { useCallback, useRef } from 'react'
import { CloudUpload, CheckCircle } from 'lucide-react'
import { Button } from '#/components/ui/button'
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
            ? 'border-brand bg-brand-muted'
            : 'glass border-border hover:border-muted-foreground'
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
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
              <CloudUpload size={24} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Drop your receipt here</p>
              <p className="mt-1 text-xs text-muted-foreground">or click to browse — JPG, PNG, PDF</p>
            </div>
          </>
        ) : uploadState.phase === 'processing' ? (
          <>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Processing
            </p>
            <div className="flex gap-1">
              {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                <span
                  key={i}
                  className={`h-4 w-2 rounded-sm transition-all duration-150 ${
                    i < filledSegments ? 'bg-brand' : 'bg-brand/15'
                  }`}
                />
              ))}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {uploadState.progress}%
            </p>
          </>
        ) : uploadState.phase === 'complete' ? (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle size={28} className="text-success" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{uploadState.fileName}</p>
              <p className="mt-1 text-xs text-success">Receipt scanned successfully</p>
            </div>
            <Button
              variant="link"
              size="sm"
              className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground"
              onClick={(e) => { e.stopPropagation(); resetUpload() }}
            >
              Upload another
            </Button>
          </>
        ) : null}
      </div>

      {/* Tips */}
      {uploadState.phase === 'idle' && (
        <div className="glass rounded-lg border-l-2 border-l-brand px-4 py-3">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Tips</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· Make sure the receipt is fully visible and not blurry</li>
            <li>· Good lighting improves AI extraction accuracy</li>
            <li>· Supported: photos, scans, PDF receipts</li>
          </ul>
        </div>
      )}
    </div>
  )
}
