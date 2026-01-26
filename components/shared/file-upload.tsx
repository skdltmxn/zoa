'use client'

import { useState, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { Upload, File, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onClear: () => void
  selectedFile: File | null
  className?: string
}

export function FileUpload({
  onFileSelect,
  onClear,
  selectedFile,
  className,
}: FileUploadProps): React.ReactElement {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateAndSelectFile = useCallback(
    (file: File): void => {
      setError(null)
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds 5MB limit (${formatFileSize(file.size)})`)
        return
      }
      onFileSelect(file)
    },
    [onFileSelect]
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>): void => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) {
        validateAndSelectFile(file)
      }
    },
    [validateAndSelectFile]
  )

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0]
      if (file) {
        validateAndSelectFile(file)
      }
    },
    [validateAndSelectFile]
  )

  const handleClear = useCallback((): void => {
    setError(null)
    onClear()
  }, [onClear])

  if (selectedFile) {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-4 bg-bg-secondary border border-border-default rounded-lg',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <File className="h-5 w-5 text-accent-primary" />
          <div>
            <p className="text-text-primary font-medium">{selectedFile.name}</p>
            <p className="text-text-muted text-sm">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer',
          isDragging
            ? 'border-accent-primary bg-accent-primary/10'
            : 'border-border-default hover:border-border-focus'
        )}
      >
        <Upload className="h-8 w-8 text-text-muted mb-3" />
        <p className="text-text-secondary text-center mb-2">
          Drag and drop a file here, or click to select
        </p>
        <p className="text-text-muted text-sm">Maximum file size: 5MB</p>
        <input
          type="file"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ position: 'absolute' }}
        />
      </div>
      {error && <p className="text-accent-error text-sm">{error}</p>}
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
