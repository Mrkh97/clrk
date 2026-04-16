import { useCallback, useEffect, useRef } from 'react'
import { AlertCircle, CheckCircle, CloudUpload, LoaderCircle } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { apiBaseUrl } from '#/lib/auth-client'
import { useReceiptStore } from '../../stores/useReceiptStore'
import type { ReceiptExtractionResponse } from '../../types'

const TOTAL_SEGMENTS = 20

export default function ReceiptUploadZone() {
  const inputRef = useRef<HTMLInputElement>(null)
  const progressTimerRef = useRef<number | null>(null)
  const {
    uploadState,
    setUploadPhase,
    setUploadProgress,
    setExtractionResult,
    setUploadError,
    resetUpload,
  } = useReceiptStore()

  const stopProgressAnimation = useCallback(() => {
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
  }, [])

  useEffect(() => stopProgressAnimation, [stopProgressAnimation])

  const startProcessing = useCallback((fileName: string) => {
    stopProgressAnimation()
    setUploadPhase('processing', fileName)
    let progress = 12
    setUploadProgress(progress)

    progressTimerRef.current = window.setInterval(() => {
      const nextStep = Math.max(3, Math.round((100 - progress) / 6))
      progress = Math.min(progress + nextStep, 92)
      setUploadProgress(progress)
    }, 140)
  }, [setUploadPhase, setUploadProgress, stopProgressAnimation])

  const extractReceipt = useCallback(async (file: File) => {
    if (uploadState.phase === 'processing') {
      return
    }

    startProcessing(file.name)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${apiBaseUrl}/api/receipts/extract`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
          let message = 'Receipt extraction failed. Please try again.'

          try {
            const errorBody = await response.json() as { error?: string; message?: string }
            if (errorBody.error) {
              message = errorBody.error
            } else if (errorBody.message) {
              message = errorBody.message
            }
          } catch {
            // Ignore parse errors and fall back to a stable message.
        }

        throw new Error(message)
      }

      const payload = await response.json() as ReceiptExtractionResponse
      stopProgressAnimation()
      setUploadProgress(100)
      setExtractionResult(payload.fileName, payload.receipt)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } catch (error) {
      stopProgressAnimation()
      setUploadError(
        file.name,
        error instanceof Error ? error.message : 'Unable to extract this receipt right now.',
      )
    }
  }, [setExtractionResult, setUploadError, setUploadProgress, startProcessing, stopProgressAnimation])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (uploadState.phase === 'processing') {
        return
      }
      const file = e.dataTransfer.files[0]
      if (file) {
        void extractReceipt(file)
      }
    },
    [extractReceipt, uploadState.phase],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (uploadState.phase === 'processing') {
        return
      }
      const file = e.target.files?.[0]
      if (file) {
        void extractReceipt(file)
      }
    },
    [extractReceipt, uploadState.phase],
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
        onClick={() => uploadState.phase !== 'processing' && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && uploadState.phase !== 'processing' && inputRef.current?.click()}
        aria-label="Upload receipt"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
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
              <p className="mt-1 text-xs text-muted-foreground">or click to browse — JPG, PNG, WEBP</p>
            </div>
          </>
        ) : uploadState.phase === 'processing' ? (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
              <LoaderCircle size={26} className="animate-spin" />
            </div>
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
              <p className="mt-1 text-xs text-success">Receipt scanned. Review the extracted details on the right.</p>
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
        ) : uploadState.phase === 'error' ? (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle size={26} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {uploadState.fileName ?? 'Upload failed'}
              </p>
              <p className="mt-1 text-xs text-destructive">
                {uploadState.errorMessage ?? 'We could not extract this receipt.'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs uppercase tracking-wider"
                onClick={(e) => {
                  e.stopPropagation()
                  inputRef.current?.click()
                }}
              >
                Try again
              </Button>
              <Button
                variant="link"
                size="sm"
                className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  resetUpload()
                }}
              >
                Dismiss
              </Button>
            </div>
          </>
        ) : null}
      </div>

      {/* Tips */}
      {(uploadState.phase === 'idle' || uploadState.phase === 'error') && (
        <div className="glass rounded-lg border-l-2 border-l-brand px-4 py-3">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Tips</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· Make sure the receipt is fully visible and not blurry</li>
            <li>· Good lighting improves AI extraction accuracy</li>
            <li>· Supported: JPG, PNG, WEBP, and other common image formats</li>
          </ul>
        </div>
      )}
    </div>
  )
}
