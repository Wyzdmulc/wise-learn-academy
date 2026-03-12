import { useState, useRef } from 'react'
import { 
  Plus, 
  Loader2, 
  CheckCircle2, 
  Upload,
  FileText,
  X
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

interface AddMaterialDialogProps {
  isUserContribution: boolean
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddMaterialDialog({ 
  isUserContribution, 
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: AddMaterialDialogProps) {
  const { user } = useAuth()
  const createMaterial = useCreateMaterial()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = setControlledOpen ?? setInternalOpen
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'document' as 'document' | 'video' | 'link',
    category: 'General'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await createMaterial.mutateAsync({
        input: {
          ...formData,
          isUserContribution
        },
        userId: user.id
      })
      toast.success(isUserContribution 
        ? 'Your contribution has been submitted for review!' 
        : 'Material added successfully!')
      setOpen(false)
      setFormData({
        title: '',
        description: '',
        url: '',
        type: 'document',
        category: 'General'
      })
    } catch (error) {
      toast.error('Failed to add material. Please try again.')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const extension = file.name.split('.').pop()
      const timestamp = Date.now()
      const path = `uploads/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      
      const { publicUrl } = await blink.storage.upload(
        file,
        path,
        {
          onProgress: (percent) => setUploadProgress(percent)
        }
      )

      // Auto-fill the source URL
      setFormData(prev => ({
        ...prev,
        url: publicUrl,
        // Auto-generate title from filename if empty
        title: prev.title || file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ')
      }))

      toast.success('PDF uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload PDF. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const isRestrictedType = isUserContribution

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-full shadow-elegant bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-5 w-5" /> Add New Material
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl bg-background/95 backdrop-blur-xl border-primary/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-bold">
            {isUserContribution ? 'Share with Community' : 'New Material'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isUserContribution 
              ? 'Contribute a document to enrich the learning library.'
              : 'Add a resource to the Wise Learn catalog.'}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary/80 ml-1">Material Title</label>
            <Input 
              placeholder="E.g. Advanced TypeScript Patterns" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              className="rounded-xl border-primary/20 bg-primary/5 focus-visible:ring-primary shadow-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary/80 ml-1">Type</label>
              <Select 
                value={formData.type} 
                onValueChange={(val: 'document' | 'video' | 'link') => setFormData({...formData, type: val})}
                disabled={isRestrictedType}
              >
                <SelectTrigger className="rounded-xl border-primary/20 bg-primary/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {isRestrictedType ? (
                    <SelectItem value="document">Document (PDF)</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="document">Document (PDF)</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="link">External Link</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {isRestrictedType && (
                <p className="text-[10px] text-muted-foreground ml-1">
                  Contributors can only upload documents
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary/80 ml-1">Category</label>
              <Input 
                placeholder="E.g. Engineering" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="rounded-xl border-primary/20 bg-primary/5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary/80 ml-1">
              {formData.type === 'document' ? 'Source File' : 'URL / Source'}
            </label>
            
            {formData.type === 'document' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 flex-1"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF
                      </>
                    )}
                  </Button>
                  {formData.url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFormData({ ...formData, url: '' })}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {formData.url && (
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-primary truncate flex-1">
                      {formData.url.split('/').pop()}
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  </div>
                )}
                
                {isUploading && (
                  <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <Input 
                placeholder="https://..." 
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                required
                className="rounded-xl border-primary/20 bg-primary/5"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary/80 ml-1">Description</label>
            <Textarea 
              placeholder="Briefly explain what this resource covers..." 
              className="h-24 resize-none rounded-xl border-primary/20 bg-primary/5"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full rounded-xl h-12 bg-primary shadow-elegant"
              disabled={createMaterial.isPending || isUploading}
            >
              {createMaterial.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="h-5 w-5 mr-2" />
              )}
              {isUserContribution ? 'Submit Contribution' : 'Publish to Catalog'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
