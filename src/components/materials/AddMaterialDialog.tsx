import { useState, useRef, useCallback } from 'react'
import {
  Plus,
  Loader2,
  CheckCircle2,
  Upload,
  FileText,
  Video,
  Link2,
  X,
  FilePlus2,
  Youtube,
  CloudUpload,
} from 'lucide-react'
import { useCreateMaterial } from '@/hooks/useMaterials'
import { useAuth } from '@/hooks/useAuth'
import { blink } from '@/blink/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AddMaterialDialogProps {
  isUserContribution: boolean
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type MaterialType = 'document' | 'video' | 'link'

const CATEGORIES = [
  'General',
  'Mathematics',
  'Science',
  'Technology',
  'Engineering',
  'Arts & Humanities',
  'Social Studies',
  'Language & Literature',
  'Business & Economics',
  'Health & Medicine',
  'History',
  'Philosophy',
  'Computer Science',
  'Law',
  'Other',
]

const TYPE_TABS: { value: MaterialType; label: string; icon: React.ReactNode }[] = [
  { value: 'document', label: 'Document', icon: <FileText className="h-4 w-4" /> },
  { value: 'video', label: 'Video', icon: <Video className="h-4 w-4" /> },
  { value: 'link', label: 'Link', icon: <Link2 className="h-4 w-4" /> },
]

function isYouTubeUrl(url: string) {
  return /(?:youtube\.com|youtu\.be)/.test(url)
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

export function AddMaterialDialog({
  isUserContribution,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: AddMaterialDialogProps) {
  const { user } = useAuth()
  const createMaterial = useCreateMaterial()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = setControlledOpen ?? setInternalOpen

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [videoInputMode, setVideoInputMode] = useState<'upload' | 'url'>('url')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    thumbnail: '',
    type: (isUserContribution ? 'document' : 'document') as MaterialType,
    category: 'General',
  })

  const resetForm = () => {
    setFormData({ title: '', description: '', url: '', thumbnail: '', type: 'document', category: 'General' })
    setUploadedFileName('')
    setUploadProgress(0)
    setIsUploading(false)
    setVideoInputMode('url')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.url && formData.type !== 'document') {
      toast.error('Please provide a URL or upload a file.')
      return
    }
    if (formData.type === 'document' && !formData.url) {
      toast.error('Please upload a PDF document.')
      return
    }

    try {
      await createMaterial.mutateAsync({
        input: {
          ...formData,
          isUserContribution,
        },
        userId: user.id,
      })
      toast.success(
        isUserContribution ? 'Your contribution has been submitted!' : 'Material published to catalog!'
      )
      setOpen(false)
      resetForm()
    } catch {
      toast.error('Failed to add material. Please try again.')
    }
  }

  const uploadFile = useCallback(
    async (file: File, expectedTypes: string[], maxMB: number) => {
      if (!expectedTypes.includes(file.type)) {
        toast.error(`Invalid file type. Accepted: ${expectedTypes.join(', ')}`)
        return
      }
      if (file.size > maxMB * 1024 * 1024) {
        toast.error(`File must be under ${maxMB}MB`)
        return
      }

      setIsUploading(true)
      setUploadProgress(0)

      try {
        const ext = file.name.split('.').pop()
        const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { publicUrl } = await blink.storage.upload(file, path, {
          onProgress: (p) => setUploadProgress(p),
        })

        const cleanName = file.name
          .replace(/\.[^.]+$/, '')
          .replace(/[-_]/g, ' ')

        setFormData((prev) => ({
          ...prev,
          url: publicUrl,
          title: prev.title || cleanName,
        }))
        setUploadedFileName(file.name)
        toast.success('File uploaded successfully!')
      } catch (err) {
        console.error(err)
        toast.error('Upload failed. Please try again.')
      } finally {
        setIsUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    []
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (formData.type === 'document') {
      uploadFile(file, ['application/pdf'], 50)
    } else if (formData.type === 'video') {
      uploadFile(file, ['video/mp4', 'video/webm', 'video/ogg'], 200)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (!file) return
      if (formData.type === 'document') {
        uploadFile(file, ['application/pdf'], 50)
      } else if (formData.type === 'video') {
        uploadFile(file, ['video/mp4', 'video/webm', 'video/ogg'], 200)
      }
    },
    [formData.type, uploadFile]
  )

  const handleVideoUrlChange = (url: string) => {
    const thumb = isYouTubeUrl(url) ? getYouTubeThumbnail(url) : null
    setFormData((prev) => ({
      ...prev,
      url,
      thumbnail: thumb || prev.thumbnail,
    }))
  }

  const isRestrictedType = isUserContribution
  const activeType = formData.type

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) resetForm()
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-full shadow-elegant bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-5 w-5" /> Add New Material
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[560px] rounded-3xl bg-background/95 backdrop-blur-xl border-primary/10 shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-border/30 bg-gradient-to-br from-primary/5 to-transparent">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold flex items-center gap-2">
              <FilePlus2 className="h-6 w-6 text-primary" />
              {isUserContribution ? 'Share with Community' : 'Add New Material'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isUserContribution
                ? 'Contribute a document to enrich the learning library.'
                : 'Publish a resource to the Wise Learn catalog.'}
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Type Tabs — admin only gets all types */}
          {!isRestrictedType && (
            <div className="flex rounded-xl overflow-hidden border border-primary/15 bg-primary/5 p-1 gap-1">
              {TYPE_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setFormData((p) => ({ ...p, type: tab.value, url: '', thumbnail: '' }))
                    setUploadedFileName('')
                  }}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
                    activeType === tab.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary/80 ml-1">Title *</label>
            <Input
              placeholder="E.g. Advanced TypeScript Patterns"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="rounded-xl border-primary/20 bg-primary/5 focus-visible:ring-primary"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary/80 ml-1">Category</label>
            <Select
              value={formData.category}
              onValueChange={(val) => setFormData({ ...formData, category: val })}
            >
              <SelectTrigger className="rounded-xl border-primary/20 bg-primary/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Source — varies by type */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary/80 ml-1">
              {activeType === 'document' && 'Upload PDF *'}
              {activeType === 'video' && 'Video Source *'}
              {activeType === 'link' && 'External URL *'}
            </label>

            {/* DOCUMENT — drag-and-drop PDF upload */}
            {activeType === 'document' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />

                {!formData.url ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      'relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200',
                      isDragging
                        ? 'border-primary bg-primary/10 scale-[1.01]'
                        : 'border-primary/25 bg-primary/5 hover:border-primary/50 hover:bg-primary/10'
                    )}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        <p className="text-sm font-medium text-primary">Uploading… {uploadProgress}%</p>
                        <div className="w-full h-2 bg-primary/15 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <CloudUpload className="h-10 w-10 text-primary/60" />
                        <div className="text-center">
                          <p className="text-sm font-semibold text-foreground">Drop PDF here or click to browse</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF only · Max 50 MB</p>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">{uploadedFileName}</p>
                      <p className="text-xs text-muted-foreground truncate">{formData.url.split('/').pop()}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={() => {
                        setFormData((p) => ({ ...p, url: '' }))
                        setUploadedFileName('')
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* VIDEO — toggle between URL and file upload */}
            {activeType === 'video' && (
              <div className="space-y-3">
                {/* Sub-toggle */}
                <div className="flex rounded-lg overflow-hidden border border-primary/15 bg-primary/5">
                  <button
                    type="button"
                    onClick={() => { setVideoInputMode('url'); setFormData((p) => ({ ...p, url: '', thumbnail: '' })); setUploadedFileName('') }}
                    className={cn(
                      'flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
                      videoInputMode === 'url' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-primary/10'
                    )}
                  >
                    <Youtube className="h-3.5 w-3.5" /> YouTube / URL
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVideoInputMode('upload'); setFormData((p) => ({ ...p, url: '', thumbnail: '' })); setUploadedFileName('') }}
                    className={cn(
                      'flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
                      videoInputMode === 'upload' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-primary/10'
                    )}
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload File
                  </button>
                </div>

                {videoInputMode === 'url' ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="https://youtube.com/watch?v=... or https://..."
                      value={formData.url}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      className="rounded-xl border-primary/20 bg-primary/5"
                    />
                    {formData.thumbnail && (
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
                        <img src={formData.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Youtube className="h-12 w-12 text-red-500 drop-shadow-lg" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {!formData.url ? (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          'flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200',
                          isDragging
                            ? 'border-primary bg-primary/10'
                            : 'border-primary/25 bg-primary/5 hover:border-primary/50 hover:bg-primary/10'
                        )}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-sm font-medium text-primary">Uploading… {uploadProgress}%</p>
                            <div className="w-full h-2 bg-primary/15 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </>
                        ) : (
                          <>
                            <Video className="h-10 w-10 text-primary/60" />
                            <div className="text-center">
                              <p className="text-sm font-semibold text-foreground">Drop video here or click to browse</p>
                              <p className="text-xs text-muted-foreground mt-1">MP4, WebM, OGG · Max 200 MB</p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <Video className="h-8 w-8 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-primary truncate">{uploadedFileName}</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                          onClick={() => { setFormData((p) => ({ ...p, url: '' })); setUploadedFileName('') }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* LINK — external URL */}
            {activeType === 'link' && (
              <div className="space-y-3">
                <Input
                  placeholder="https://example.com/article"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  className="rounded-xl border-primary/20 bg-primary/5"
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground ml-1">Thumbnail URL (optional)</label>
                  <Input
                    placeholder="https://example.com/thumbnail.jpg"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="rounded-xl border-primary/20 bg-primary/5 text-sm"
                  />
                  {formData.thumbnail && (
                    <div className="rounded-xl overflow-hidden aspect-video bg-muted mt-2">
                      <img
                        src={formData.thumbnail}
                        alt="thumbnail preview"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary/80 ml-1">Description</label>
            <Textarea
              placeholder="Briefly explain what this resource covers..."
              className="h-24 resize-none rounded-xl border-primary/20 bg-primary/5"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 pb-8 pt-2 border-t border-border/20 bg-gradient-to-t from-primary/5 to-transparent">
          <DialogFooter>
            <Button
              type="submit"
              form=""
              className="w-full rounded-xl h-12 bg-primary shadow-elegant hover:bg-primary/90 text-base font-semibold"
              disabled={createMaterial.isPending || isUploading}
              onClick={handleSubmit}
            >
              {createMaterial.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="h-5 w-5 mr-2" />
              )}
              {isUserContribution ? 'Submit Contribution' : 'Publish to Catalog'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
