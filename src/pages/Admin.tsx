import { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  LayoutGrid, 
  List, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { 
  useMaterials, 
  useCreateMaterial, 
  useDeleteMaterial 
} from '@/hooks/useMaterials'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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

export default function Admin() {
  const { user, isAdmin } = useAuth()
  const { data: materialsList, isLoading } = useMaterials()
  const createMaterial = useCreateMaterial()
  const deleteMaterial = useDeleteMaterial()

  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'document' as 'document' | 'video' | 'link',
    category: 'General'
  })

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mb-6" />
          <h1 className="text-3xl font-serif font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            You do not have administrative privileges to access this area. 
            If you believe this is an error, please contact support.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <a href="/catalog">Return to Catalog</a>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await createMaterial.mutateAsync({
        input: formData,
        userId: user.id
      })
      toast.success('Material added successfully!')
      setIsAdding(false)
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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteMaterial.mutateAsync(id)
        toast.success('Material deleted successfully')
      } catch (error) {
        toast.error('Failed to delete material')
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-bold text-foreground">Admin Management</h1>
            <p className="text-muted-foreground">Manage your knowledge base and materials.</p>
          </div>

          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-elegant bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-5 w-5" /> Add New Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl bg-background/95 backdrop-blur-xl border-primary/10 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif font-bold">New Material</DialogTitle>
                <p className="text-sm text-muted-foreground">Add a resource to the Wise Learn catalog.</p>
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
                      onValueChange={(val: any) => setFormData({...formData, type: val})}
                    >
                      <SelectTrigger className="rounded-xl border-primary/20 bg-primary/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document (PDF)</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="link">External Link</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <label className="text-sm font-semibold text-primary/80 ml-1">URL / Source</label>
                  <Input 
                    placeholder="https://..." 
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    required
                    className="rounded-xl border-primary/20 bg-primary/5"
                  />
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
                    disabled={createMaterial.isPending}
                  >
                    {createMaterial.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                    )}
                    Publish to Catalog
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-background/60 backdrop-blur-md rounded-3xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/30 flex justify-between items-center bg-secondary/5">
            <h3 className="font-bold flex items-center gap-2">
              <List className="h-5 w-5 text-primary" /> Active Materials
            </h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Quick search..." className="pl-9 h-9 rounded-full bg-background/50 border-primary/10" />
            </div>
          </div>

          {isLoading ? (
            <div className="p-24 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">Syncing data...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/10">
                <TableRow>
                  <TableHead className="font-bold">Title</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Added On</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialsList?.map((m) => (
                  <TableRow key={m.id} className="group hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="group-hover:text-primary transition-colors">{m.title}</span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-xs">{m.url}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-[10px] border-primary/20 text-primary bg-primary/5">
                        {m.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.category}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(m.id)}
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
    </DashboardLayout>
  )
}
