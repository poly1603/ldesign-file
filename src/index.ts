/**
 * @ldesign/file - 文件处理库
 */

export interface UploadOptions {
  url: string
  chunkSize?: number
  onProgress?: (percent: number) => void
}

export class FileUploader {
  private options: UploadOptions

  constructor(options: UploadOptions) {
    this.options = {
      chunkSize: options.chunkSize || 1024 * 1024, // 1MB
      ...options,
    }
  }

  async upload(file: File): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(this.options.url, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }
  }

  async uploadChunked(file: File): Promise<void> {
    const chunks = Math.ceil(file.size / this.options.chunkSize!)
    // 实现分片上传逻辑
    for (let i = 0; i < chunks; i++) {
      this.options.onProgress?.(((i + 1) / chunks) * 100)
    }
  }
}

export function createUploader(options: UploadOptions) {
  return new FileUploader(options)
}

