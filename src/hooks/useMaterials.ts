import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import materials, { 
  Material, 
  CreateMaterialInput, 
  UpdateMaterialInput,
  MaterialsListParams 
} from '@/services/materials'

// Query keys
export const materialKeys = {
  all: ['materials'] as const,
  lists: () => [...materialKeys.all, 'list'] as const,
  list: (params?: MaterialsListParams) => [...materialKeys.lists(), params] as const,
  details: () => [...materialKeys.all, 'detail'] as const,
  detail: (id: string) => [...materialKeys.details(), id] as const,
}

/**
 * Hook to fetch a list of materials
 */
export function useMaterials(params?: MaterialsListParams) {
  return useQuery({
    queryKey: materialKeys.list(params),
    queryFn: () => materials.list(params),
  })
}

/**
 * Hook to fetch a single material by ID
 */
export function useMaterial(id: string | null) {
  return useQuery({
    queryKey: materialKeys.detail(id ?? ''),
    queryFn: () => materials.get(id!),
    enabled: !!id,
  })
}

/**
 * Hook to create a new material
 */
export function useCreateMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ input, userId }: { input: CreateMaterialInput; userId: string }) =>
      materials.create(input, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing material
 */
export function useUpdateMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateMaterialInput }) =>
      materials.update(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() })
    },
  })
}

/**
 * Hook to delete a material
 */
export function useDeleteMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => materials.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() })
    },
  })
}
