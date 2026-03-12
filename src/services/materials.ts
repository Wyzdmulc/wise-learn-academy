import { blink } from '@/blink/client'

export type MaterialType = 'document' | 'video' | 'link'

export interface Material {
  id: string
  userId: string
  type: MaterialType
  title: string
  description?: string
  url: string
  thumbnail?: string
  category?: string
  isUserContribution: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateMaterialInput {
  type: MaterialType
  title: string
  description?: string
  url: string
  thumbnail?: string
  category?: string
  isUserContribution?: boolean
}

export interface UpdateMaterialInput {
  type?: MaterialType
  title?: string
  description?: string
  url?: string
  thumbnail?: string
 category?: string
  isUserContribution?: boolean
}

export interface MaterialsListParams {
  where?: {
    userId?: string
    type?: MaterialType
    category?: string
    isUserContribution?: boolean
  }
  orderBy?: {
    createdAt?: 'asc' | 'desc'
    title?: 'asc' | 'desc'
  }
  limit?: number
  offset?: number
}

const materials = {
  /**
   * List materials with optional filtering and pagination
   */
  async list(params?: MaterialsListParams): Promise<Material[]> {
    const query: Record<string, unknown> = {}
    
    if (params?.where) {
      const where: Record<string, unknown> = {}
      
      if (params.where.userId) where.userId = params.where.userId
      if (params.where.type) where.type = params.where.type
      if (params.where.category) where.category = params.where.category
      if (params.where.isUserContribution !== undefined) {
        where.isUserContribution = params.where.isUserContribution ? "1" : "0"
      }
      
      if (Object.keys(where).length > 0) {
        query.where = where
      }
    }
    
    if (params?.orderBy) {
      query.orderBy = params.orderBy
    }
    
    if (params?.limit) {
      query.limit = params.limit
    }
    
    if (params?.offset) {
      query.offset = params.offset
    }

    const result = await blink.db.materials.list(query)
    return result as Material[]
  },

  /**
   * Get a single material by ID
   */
  async get(id: string): Promise<Material | null> {
    const result = await blink.db.materials.get(id)
    return result as Material | null
  },

  /**
   * Create a new material
   */
  async create(input: CreateMaterialInput, userId: string): Promise<Material> {
    const material = await blink.db.materials.create({
      userId,
      type: input.type,
      title: input.title,
      description: input.description,
      url: input.url,
      thumbnail: input.thumbnail,
      category: input.category,
      isUserContribution: input.isUserContribution ? 1 : 0
    })
    return material as Material
  },

  /**
   * Update an existing material
   */
  async update(id: string, input: UpdateMaterialInput): Promise<Material> {
    const updateData: Record<string, unknown> = {}
    
    if (input.type !== undefined) updateData.type = input.type
    if (input.title !== undefined) updateData.title = input.title
    if (input.description !== undefined) updateData.description = input.description
    if (input.url !== undefined) updateData.url = input.url
    if (input.thumbnail !== undefined) updateData.thumbnail = input.thumbnail
    if (input.category !== undefined) updateData.category = input.category
    if (input.isUserContribution !== undefined) {
      updateData.isUserContribution = input.isUserContribution ? 1 : 0
    }
    
    const result = await blink.db.materials.update(id, updateData)
    return result as Material
  },

  /**
   * Delete a material
   */
  async delete(id: string): Promise<void> {
    await blink.db.materials.delete(id)
  }
}

export default materials
