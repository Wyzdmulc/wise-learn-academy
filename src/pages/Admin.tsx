import { useState, useMemo } from 'react'
import {
  Trash2,
  Edit3,
  Search,
  List,
  Loader2,
  AlertCircle,
  FileText,
  Video,
  Link2,
  LayoutDashboard,
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  X,
} from 'lucide-react'
import {
  useMaterials,
  useDeleteMaterial,
  useUpdateMaterial,
} from '@/hooks/useMaterials'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { AddMaterialDialog } from '@/components/materials/AddMaterialDialog'
import { toast } from 'sonner'
import { Material } from '@/services/materials'

const TYPE_ICONS: Record<string, React.ReactNode> = {
  document: <FileText className="h-3.5 w-3.5" />,
  video: <Video className="h-3.5 w-3.5" />,
  link: <Link2 className="h-3.5 w-3.5" />,
}

const CATEGORIES = [
  'General', 'Mathematics', 'Science', 'Technology', 'Engineering',
  'Arts & Humanities', 'Social Studies', 'Language & Literature',
  'Business & Economics', 'Health & Medicine', 'History', 'Philosophy',
  'Computer Science', 'Law', 'Other',
]

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="bg-background/70 backdrop-blur-md rounded-2xl border border-border/40 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

interface EditDialogProps {
  material: Material | null
  open: boolean
  onClose: () => void
}

function EditMaterialDialog({ material, open, onClose }: EditDialogProps) {
  const updateMaterial = useUpdateMaterial()
  const [formData, setFormData] = useState({
    title: material?.title ?? '',
    description: material?.description ?? '',
    url: material?.url ?? '',
    thumbnail: material?.thumbnail ?? '',
    category: material?.category ?? 'General',
    type: material?.type ?? 'document',
  })

  // Sync when material changes
  useState(() => {
    if (material) {
      setFormData({
        title: material.title,
        description: material.description ?? '',
        url: material.url,
        thumbnail: material.thumbnail ?? '',
        category: material.category ?? 'General',
        type: material.type,
      })
    }
  })

  const handleSave = async () => {
    if (!material) return
    try {
      await updateMaterial.mutateAsync({ id: material.id, input: formData })
      toast.success('Material updated successfully!')
      onClose()
    } catch {
      toast.error('Failed to update material.')
    }
  }

  if (!material) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl border-primary/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif font-bold flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" /> Edit Material
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary/80 ml-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl border-primary/20 bg-primary/5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-primary/80 ml-1">Type</label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as 'document' | 'video' | 'link' })}
              >
                <SelectTrigger className="rounded-xl border-primary/20 bg-primary/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="link">External Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-primary/80 ml-1">Category</label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger className="rounded-xl border-primary/20 bg-primary/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary/80 ml-1">URL</label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="rounded-xl border-primary/20 bg-primary/5 font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary/80 ml-1">Thumbnail URL</label>
            <Input
              placeholder="https://..."
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="rounded-xl border-primary/20 bg-primary/5"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-primary/80 ml-1">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-20 resize-none rounded-xl border-primary/20 bg-primary/5"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMaterial.isPending}
            className="rounded-xl bg-primary"
          >
            {updateMaterial.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Admin() {
  const { isAdmin } = useAuth()
  const { data: materialsList, isLoading } = useMaterials()
  const deleteMaterial = useDeleteMaterial()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [editTarget, setEditTarget] = useState<Material | null>(null)

  const filtered = useMemo(() => {
    if (!materialsList) return []
    return materialsList.filter((m) => {
      const matchSearch =
        !search ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        (m.category ?? '').toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'all' || m.type === typeFilter
      return matchSearch && matchType
    })
  }, [materialsList, search, typeFilter])

  const stats = useMemo(() => {
    const all = materialsList ?? []
    return {
      total: all.length,
      documents: all.filter((m) => m.type === 'document').length,
      videos: all.filter((m) => m.type === 'video').length,
      links: all.filter((m) => m.type === 'link').length,
      contributions: all.filter((m) => Number(m.isUserContribution) > 0).length,
    }
  }, [materialsList])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this material? This cannot be undone.')) return
    try {
      await deleteMaterial.mutateAsync(id)
      toast.success('Material deleted')
    } catch {
      toast.error('Failed to delete material')
    }
  }

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mb-6" />
          <h1 className="text-3xl font-serif font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            You do not have administrative privileges to access this area.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <a href="/catalog">Return to Catalog</a>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Content Manager</h1>
            <p className="text-muted-foreground">Upload, edit, and manage all learning materials.</p>
          </div>
          <AddMaterialDialog
            isUserContribution={false}
            trigger={
              <Button className="rounded-full shadow-elegant bg-primary hover:bg-primary/90 px-6">
                + Add New Material
              </Button>
            }
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<BookOpen className="h-6 w-6" />} label="Total Materials" value={stats.total} />
          <StatCard icon={<FileText className="h-6 w-6" />} label="Documents" value={stats.documents} />
          <StatCard icon={<Video className="h-6 w-6" />} label="Videos" value={stats.videos} />
          <StatCard icon={<TrendingUp className="h-6 w-6" />} label="User Contributions" value={stats.contributions} sub={`${stats.links} links`} />
        </div>

        {/* Table */}
        <div className="bg-background/60 backdrop-blur-md rounded-3xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary/5">
            <h3 className="font-bold flex items-center gap-2 text-lg">
              <List className="h-5 w-5 text-primary" /> All Materials
              <Badge variant="secondary" className="ml-1 text-xs">{filtered.length}</Badge>
            </h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Type filter */}
              <div className="flex rounded-lg overflow-hidden border border-primary/15 text-xs">
                {['all', 'document', 'video', 'link'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 capitalize font-medium transition-all ${
                      typeFilter === t
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-primary/10'
                    }`}
                  >
                    {t === 'all' ? 'All' : t}
                  </button>
                ))}
              </div>
              {/* Search */}
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 rounded-full bg-background/50 border-primary/10 pr-8"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-24 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">Loading materials…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="font-semibold text-muted-foreground">No materials found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {search ? 'Try a different search term' : 'Add your first material using the button above'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/10">
                <TableRow>
                  <TableHead className="font-bold pl-6">Title</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold hidden md:table-cell">Category</TableHead>
                  <TableHead className="font-bold hidden md:table-cell">Source</TableHead>
                  <TableHead className="font-bold hidden sm:table-cell">Added</TableHead>
                  <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id} className="group hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium pl-6">
                      <div className="flex flex-col">
                        <span className="group-hover:text-primary transition-colors line-clamp-1 font-semibold">
                          {m.title}
                        </span>
                        {m.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-xs">
                            {m.description}
                          </span>
                        )}
                        {Number(m.isUserContribution) > 0 && (
                          <Badge variant="outline" className="w-fit mt-1 text-[9px] border-amber-400/40 text-amber-600 bg-amber-50">
                            User Contribution
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="capitalize text-xs border-primary/20 text-primary bg-primary/5 flex items-center gap-1 w-fit"
                      >
                        {TYPE_ICONS[m.type]}
                        {m.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell text-sm">
                      {m.category ?? '—'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary/70 hover:text-primary truncate max-w-[160px] block underline underline-offset-2"
                        title={m.url}
                      >
                        {m.url.length > 40 ? m.url.slice(0, 40) + '…' : m.url}
                      </a>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell text-sm">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:bg-primary/10"
                          onClick={() => setEditTarget(m)}
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(m.id)}
                          title="Delete"
                          disabled={deleteMaterial.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <EditMaterialDialog
        material={editTarget}
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
      />
    </DashboardLayout>
  )
}
