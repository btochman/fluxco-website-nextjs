import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ScrapedTransformer {
  id: string;
  source_id: string | null;
  external_id: string | null;
  type: 'new' | 'refurbished';
  category: string;
  capacity: string;
  capacity_kva: number | null;
  voltage: string | null;
  manufacturer: string | null;
  location: string | null;
  feoc_compliant: boolean | null;
  price: string | null;
  price_numeric: number | null;
  quantity: number | null;
  source_url: string | null;
  is_verified: boolean | null;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryFilters {
  search?: string;
  type?: string;
  category?: string;
  capacityRange?: string;
  feocOnly?: boolean;
}

export function useInventory(filters?: InventoryFilters) {
  return useQuery({
    queryKey: ['inventory', filters],
    queryFn: async () => {
      let query = supabase
        .from('scraped_inventory')
        .select('*')
        .order('scraped_at', { ascending: false });

      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.feocOnly) {
        query = query.eq('feoc_compliant', true);
      }

      if (filters?.capacityRange && filters.capacityRange !== 'all') {
        const [min, max] = parseCapacityRange(filters.capacityRange);
        if (min !== null) {
          query = query.gte('capacity_kva', min);
        }
        if (max !== null) {
          query = query.lte('capacity_kva', max);
        }
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Apply text search client-side (Supabase doesn't support full-text on all columns)
      let results = data as ScrapedTransformer[];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(item =>
          item.manufacturer?.toLowerCase().includes(searchLower) ||
          item.capacity?.toLowerCase().includes(searchLower) ||
          item.voltage?.toLowerCase().includes(searchLower) ||
          item.location?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower)
        );
      }

      return results;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useInventoryStats() {
  return useQuery({
    queryKey: ['inventory-stats'],
    queryFn: async () => {
      // Get total count
      const { count: totalProducts, error: countError } = await supabase
        .from('scraped_inventory')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false);

      if (countError) throw countError;

      // Get counts by type
      const { count: newCount, error: newError } = await supabase
        .from('scraped_inventory')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false)
        .eq('type', 'new');

      if (newError) throw newError;

      const { count: refurbishedCount, error: refurbError } = await supabase
        .from('scraped_inventory')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false)
        .eq('type', 'refurbished');

      if (refurbError) throw refurbError;

      // Get total units (sum of quantity) - fetch all with range
      let allQuantities: { quantity: number | null }[] = [];
      let from = 0;
      const batchSize = 1000;
      
      while (true) {
        const { data: batch, error: batchError } = await supabase
          .from('scraped_inventory')
          .select('quantity')
          .eq('is_hidden', false)
          .range(from, from + batchSize - 1);
        
        if (batchError) throw batchError;
        if (!batch || batch.length === 0) break;
        
        allQuantities = [...allQuantities, ...batch];
        if (batch.length < batchSize) break;
        from += batchSize;
      }

      const totalUnits = allQuantities.reduce((sum, item) => sum + (item.quantity || 1), 0);

      return {
        totalProducts: totalProducts || 0,
        totalUnits,
        newCount: newCount || 0,
        refurbishedCount: refurbishedCount || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useLastScrapedTime() {
  return useQuery({
    queryKey: ['last-scraped'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scrape_logs')
        .select('created_at')
        .eq('status', 'success')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data?.created_at ? new Date(data.created_at) : null;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useRefreshInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('refresh-inventory');

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
      queryClient.invalidateQueries({ queryKey: ['last-scraped'] });
      
      toast.success(`Inventory refreshed: ${data.total_items_added} new, ${data.total_items_updated} updated`);
    },
    onError: (error) => {
      console.error('Failed to refresh inventory:', error);
      toast.error('Failed to refresh inventory. Please try again.');
    },
  });
}

function parseCapacityRange(range: string): [number | null, number | null] {
  switch (range) {
    case '0-500':
      return [0, 500];
    case '500-1000':
      return [500, 1000];
    case '1000-2500':
      return [1000, 2500];
    case '2500-5000':
      return [2500, 5000];
    case '5000-10000':
      return [5000, 10000];
    case '10000+':
      return [10000, null];
    default:
      return [null, null];
  }
}
