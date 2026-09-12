"use client"

import { useId, useRef, useState } from "react"
import Image from "next/image"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ImageIcon,
  SpinnerGapIcon,
  TrashIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react/dist/ssr"
import { cn } from "cn"
import { uploadImageToCloudinary } from "@/src/shared/utils/cloudinary"

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  max?: number
  className?: string
  /** aspect-square (avatar/portfolio) hoặc aspect-[4/5] (ảnh tin đăng) — mặc định vuông */
  tileAspect?: "square" | "4/5"
}

/**
 * Upload ảnh thật lên Cloudinary: kéo-thả hoặc chọn nhiều ảnh, preview lưới, sắp xếp lại, xoá.
 * Thay cho input URL text ở portfolio/create-post/edit-post/avatar (xem plan redesign mục 2).
 */
function ImageUpload({
  value,
  onChange,
  max = 10,
  className,
  tileAspect = "square",
}: ImageUploadProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<{ id: string; progress: number }[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remainingSlots = max - value.length - uploading.length

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, Math.max(remainingSlots, 0))

    if (list.length === 0) return
    setError(null)

    for (const file of list) {
      const tempId = `${file.name}-${Date.now()}-${Math.random()}`
      setUploading((prev) => [...prev, { id: tempId, progress: 0 }])

      try {
        const result = await uploadImageToCloudinary(file, (percent) => {
          setUploading((prev) =>
            prev.map((item) => (item.id === tempId ? { ...item, progress: percent } : item))
          )
        })
        onChange([...value, result.secure_url])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Tải ảnh lên thất bại.")
      } finally {
        setUploading((prev) => prev.filter((item) => item.id !== tempId))
      }
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  const aspectClass = tileAspect === "square" ? "aspect-square" : "aspect-[4/5]"

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={url}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border bg-muted",
              aspectClass
            )}
          >
            <Image
              src={url}
              alt={`Ảnh ${index + 1}`}
              fill
              sizes="180px"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  className="rounded-full bg-white/90 p-1.5 text-foreground transition active:scale-90"
                  aria-label="Chuyển ảnh sang trái"
                >
                  <ArrowLeftIcon className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="rounded-full bg-white/90 p-1.5 text-destructive transition active:scale-90"
                aria-label="Xoá ảnh"
              >
                <TrashIcon className="size-3.5" />
              </button>
              {index < value.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  className="rounded-full bg-white/90 p-1.5 text-foreground transition active:scale-90"
                  aria-label="Chuyển ảnh sang phải"
                >
                  <ArrowRightIcon className="size-3.5" />
                </button>
              )}
            </div>
            {index === 0 && (
              <span className="absolute top-1.5 left-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                Ảnh chính
              </span>
            )}
          </div>
        ))}

        {uploading.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/50",
              aspectClass
            )}
          >
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
              <SpinnerGapIcon className="size-5 animate-spin" />
              <span className="text-[11px] tabular-nums">{item.progress}%</span>
            </div>
          </div>
        ))}

        {remainingSlots > 0 && (
          <label
            htmlFor={inputId}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragging(false)
              handleFiles(event.dataTransfer.files)
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary",
              aspectClass,
              isDragging ? "border-primary bg-primary/5 text-primary" : "border-border"
            )}
          >
            {value.length === 0 && uploading.length === 0 ? (
              <ImageIcon className="size-6" />
            ) : (
              <UploadSimpleIcon className="size-5" />
            )}
            <span className="text-[11px]">Thêm ảnh</span>
          </label>
        )}
      </div>

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(event) => {
          if (event.target.files) handleFiles(event.target.files)
          event.target.value = ""
        }}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Kéo-thả hoặc chọn tối đa {max} ảnh. Ảnh đầu tiên là ảnh đại diện/bìa.
      </p>
    </div>
  )
}

export { ImageUpload }
