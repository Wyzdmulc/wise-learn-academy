import { useState } from 'react'
import { 
  Trash2, 
  Edit3, 
  Search, 
  List, 
  Loader2,
  AlertCircle
} from 'lucide-react'
import { 
  useMaterials, 
  useDeleteMaterial 
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
import { AddMaterialDialog } from '@/components/materials/AddMaterialDialog'
import { toast } from 'sonner'

export default function Admin() {
  const { isAdmin } = useAuth()
  const { data: materialsList, isLoading } = useMaterials()
  const deleteMaterial = useDeleteMaterial()

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

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-bold text-foreground">Admin Management</h1>
            <p className="text-muted-foreground">Manage your knowledge base and materials.</p>
          </div>

          <AddMaterialDialog
            isUserContribution={false}
            trigger={
              <Button className="rounded-full shadow-elegant bg-primary hover:bg-primary/90">
                Add New Material
              </Button>
            }
          />
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
