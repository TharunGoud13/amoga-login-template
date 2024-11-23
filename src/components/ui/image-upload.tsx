"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false
  })

  const removeImage = () => {
    setPreview(null)
  }

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-6">
        {!preview ? (
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer 
              ${isDragActive ? 'border-primary ' : 'border-muted-foreground/25 hover:border-primary/50'}`}
          >
            <input {...getInputProps()} aria-label="Upload image" />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
            <p className="mt-2 text-sm text-muted-foreground">Drag & drop an image here, or click to select one</p>
          </div>
        ) : (
          <div className="relative">
            <img src={preview} alt="Uploaded image preview" className="w-full h-auto rounded-lg" />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2"
              onClick={removeImage}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

