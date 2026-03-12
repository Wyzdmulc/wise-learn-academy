import { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  PlayCircle, 
  FileText, 
  ExternalLink, 
  ChevronRight,
  Loader2,
  X,
  Maximize2,
  Download
} from 'lucide-react'
import { useMaterials } from '@/hooks/useMaterials'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

type MaterialType = 'document' | 'video' | 'link'

export default function Catalog() {
  const { materials, isLoading } = useMaterials()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<MaterialType | 'all'>('all')
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)

  const filteredMaterials = useMemo(() => {
    if (!materials) return []
    return materials.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                           m.description?.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === 'all' || m.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [materials, search, typeFilter])

  const getIcon = (type: MaterialType) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-5 w-5 text-red-500" />
      case 'document': return <FileText className="h-5 w-5 text-blue-500" />
      case 'link': return <ExternalLink className="h-5 w-5 text-primary" />
    }
  }

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-bold text-foreground">Learning Catalog</h1>
            <p className="text-muted-foreground">Explore our collection of expert-led materials.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search materials..." 
                className="pl-10 rounded-full border-primary/20 bg-background/50 backdrop-blur-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val as any)}>
              <SelectTrigger className="w-full sm:w-40 rounded-full border-primary/20 bg-background/50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="link">Links</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium">Curating your knowledge base...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-24 bg-secondary/20 rounded-3xl border border-dashed border-primary/30">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">No materials found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            <Button variant="link" className="text-primary mt-4" onClick={() => {setSearch(''); setTypeFilter('all')}}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map((material) => (
              <Card 
                key={material.id} 
                className="group relative overflow-hidden border-border/50 bg-background/60 backdrop-blur-sm hover:shadow-elegant transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 uppercase tracking-wider text-[10px] py-0.5 px-2">
                      {material.type}
                    </Badge>
                    <div className="p-2 bg-secondary/50 rounded-lg">
                      {getIcon(material.type as MaterialType)}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                    {material.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 h-10 mt-2">
                    {material.description || 'No description provided.'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow pt-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Added {new Date(material.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 border-t border-border/30">
                  <Button 
                    className="w-full rounded-xl bg-primary shadow-sm group-hover:shadow-elegant transition-all"
                    onClick={() => setSelectedMaterial(material)}
                  >
                    View Material
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Viewer Dialog */}
        <Dialog open={!!selectedMaterial} onOpenChange={() => setSelectedMaterial(null)}>
          <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl">
            <DialogHeader className="p-6 border-b border-border/30 absolute top-0 w-full z-20 bg-background/80 backdrop-blur-md">
              <div className="flex items-center justify-between pr-8">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    {selectedMaterial && getIcon(selectedMaterial.type as MaterialType)}
                  </div>
                  <div className="text-left">
                    <DialogTitle className="text-2xl font-serif font-bold text-foreground truncate max-w-md">
                      {selectedMaterial?.title}
                    </DialogTitle>
                    <DialogDescription className="text-xs font-medium uppercase tracking-widest text-primary">
                      {selectedMaterial?.type} • Wise Learn Academy
                    </DialogDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-24 h-[calc(85vh-6rem)] w-full relative group">
              {selectedMaterial?.type === 'video' && getYouTubeId(selectedMaterial.url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(selectedMaterial.url)}?autoplay=1&rel=0`}
                  title={selectedMaterial.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : selectedMaterial?.type === 'video' ? (
                <video 
                  src={selectedMaterial.url} 
                  controls 
                  className="w-full h-full object-contain bg-black"
                />
              ) : selectedMaterial?.type === 'document' ? (
                <iframe
                  src={`${selectedMaterial.url}#toolbar=0`}
                  title={selectedMaterial.title}
                  className="w-full h-full border-0 bg-secondary/20"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-6">
                  <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 shadow-inner">
                    <ExternalLink className="h-20 w-20 text-primary mb-6 mx-auto opacity-50" />
                    <h3 className="text-2xl font-serif font-bold mb-4">External Resource</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                      This material is hosted on an external platform. Click the button below to access it in a new window.
                    </p>
                    <Button asChild size="lg" className="rounded-full h-14 px-10 text-lg bg-primary shadow-elegant">
                      <a href={selectedMaterial?.url} target="_blank" rel="noopener noreferrer">
                        Open Resource <ExternalLink className="ml-2 h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
