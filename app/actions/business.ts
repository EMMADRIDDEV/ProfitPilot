'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

type BusinessData = {
  business_name: string
  business_email?: string
  business_phone?: string
  business_address?: string
  business_type?: string
  registration_number?: string
  tax_id?: string
  industry?: string
}

type ItemData = {
  product_name: string
  product_code?: string
  category?: string
  quantity_in_stock: number
  reorder_level?: number
  unit_cost?: number
  selling_price?: number
  supplier_name?: string
  supplier_contact?: string
}

async function getUserId() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value
  if (!userId) return null
  // If user IDs are numeric (BIGINT), convert to Number for DB comparisons
  return /^[0-9]+$/.test(userId) ? Number(userId) : userId
}

export async function createBusiness(businessData: BusinessData) {
  const supabase = await createClient()
  const userId = await getUserId()

  if (!userId) {
    return { success: false, error: 'User not authenticated' }
  }

  console.log('[Business] createBusiness called for user_id:', userId, 'businessData:', businessData)

  try {
    const { data, error } = await supabase
      .from('businesses')
      .insert({
        user_id: userId,
        ...businessData,
      })
      .select()
      .single()

    console.log('[Business] createBusiness result:', { data, error })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[Business] Error creating business:', error)
    return { success: false, error: 'Failed to create business' }
  }
}

export async function updateBusiness(businessId: string, updates: Partial<BusinessData>) {
  const supabase = await createClient()
  const userId = await getUserId()

  if (!userId) {
    return { success: false, error: 'User not authenticated' }
  }

  try {
    const { data, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', businessId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[Business] Error updating business:', error)
    return { success: false, error: 'Failed to update business' }
  }
}

export async function getBusiness() {
  const supabase = await createClient()
  const userId = await getUserId()

  if (!userId) {
    return null
  }

  console.log('[Business] getBusiness called for user_id:', userId)

  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    console.log('[Business] getBusiness query result:', { data, error })

    if (error && error.code !== 'PGRST116') {
      console.error('[Business] Error fetching business:', error)
      return null
    }

    return data || null
  } catch (error) {
    console.error('[Business] Error fetching business:', error)
    return null
  }
}

export async function addSale(businessId: string, saleData: {
  sale_date: string
  product_name: string
  quantity: number
  unit_price: number
  total_amount: number
  payment_method?: string
  notes?: string
}) {
  const supabase = await createClient()
  const userId = await getUserId()

  if (!userId) {
    return { success: false, error: 'User not authenticated' }
  }

  try {
    const { data, error } = await supabase
      .from('sales')
      .insert({
        business_id: businessId,
        ...saleData,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[Sales] Error adding sale:', error)
    return { success: false, error: 'Failed to add sale' }
  }
}

export async function getSales(businessId: string, startDate?: string, endDate?: string) {
  const supabase = await createClient()

  try {
    let query = supabase
      .from('sales')
      .select('*')
      .eq('business_id', businessId)
      .order('sale_date', { ascending: false })

    if (startDate) {
      query = query.gte('sale_date', startDate)
    }

    if (endDate) {
      query = query.lte('sale_date', endDate)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('[Sales] Error fetching sales:', error)
    return { success: false, error: 'Failed to fetch sales', data: [] }
  }
}

export async function addInventoryItem(businessId: string, itemData: ItemData) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('inventory')
      .insert({
        business_id: businessId,
        ...itemData,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[Inventory] Error adding item:', error)
    return { success: false, error: 'Failed to add inventory item' }
  }
}

export async function getInventory(businessId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('business_id', businessId)
      .order('product_name', { ascending: true })

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('[Inventory] Error fetching inventory:', error)
    return { success: false, error: 'Failed to fetch inventory', data: [] }
  }
}

export async function updateInventoryItem(itemId: string, updates: Partial<ItemData>) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[Inventory] Error updating item:', error)
    return { success: false, error: 'Failed to update inventory item' }
  }
}

export async function addExpense(businessId: string, expenseData: {
  expense_date: string
  category: string
  description?: string
  amount: number
  payment_method?: string
}) {
  const supabase = await createClient()

  console.log('[Expenses] addExpense called for businessId:', businessId, 'expenseData:', expenseData)

  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        business_id: businessId,
        ...expenseData,
      })
      .select()
      .single()

      console.log('[Expenses] addExpense result:', { data, error })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[Expenses] Error adding expense:', error)
    return { success: false, error: 'Failed to add expense' }
  }
}

export async function getExpenses(businessId: string, startDate?: string, endDate?: string) {
  const supabase = await createClient()

  try {
    let query = supabase
      .from('expenses')
      .select('*')
      .eq('business_id', businessId)
      .order('expense_date', { ascending: false })

    if (startDate) {
      query = query.gte('expense_date', startDate)
    }

    if (endDate) {
      query = query.lte('expense_date', endDate)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('[Expenses] Error fetching expenses:', error)
    return { success: false, error: 'Failed to fetch expenses', data: [] }
  }
}
