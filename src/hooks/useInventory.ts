import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, InventoryItem } from '@/lib/supabase';
import { toast } from 'sonner';

export interface InventoryFilters {
  search?: string;
  type?: string;
  category?: string;
  capacityRange?: string;
  feocOnly?: boolean;
}

// Parse capacity string like "1500 kVA" to number
function parseCapacityKva(capacity: string): number {
  const match = capacity.match(/(\d+(?:,\d+)?)\s*(?:kVA|MVA)/i);
  if (!match) return 0;
  let value = parseInt(match[1].replace(',', ''), 10);
  if (capacity.toLowerCase().includes('mva')) {
    value *= 1000;
  }
  return value;
}

export function useInventory(filters?: InventoryFilters) {
  return useQuery({
    queryKey: ['inventory', filters],
    queryFn: async () => {
      let query = supabase
        .from('inventory')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.feocOnly) {
        query = query.eq('feoc_compliant', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Inventory fetch error:', error);
        return [];
      }

      let results = data as InventoryItem[];

      // Apply capacity range filter client-side
      if (filters?.capacityRange && filters.capacityRange !== 'all') {
        const [min, max] = parseCapacityRange(filters.capacityRange);
        results = results.filter(item => {
          const kva = parseCapacityKva(item.capacity);
          if (min !== null && kva < min) return false;
          if (max !== null && kva > max) return false;
          return true;
        });
      }

      // Apply text search client-side
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(item =>
          item.sku?.toLowerCase().includes(searchLower) ||
          item.manufacturer?.toLowerCase().includes(searchLower) ||
          item.capacity?.toLowerCase().includes(searchLower) ||
          item.voltage?.toLowerCase().includes(searchLower) ||
          item.location?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower) ||
          item.model?.toLowerCase().includes(searchLower)
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
      // Get all inventory items for stats
      const { data, error } = await supabase
        .from('inventory')
        .select('type, quantity')
        .eq('available', true);

      if (error) {
        console.error('Stats fetch error:', error);
        return {
          totalProducts: 0,
          totalUnits: 0,
          newCount: 0,
          refurbishedCount: 0,
        };
      }

      const items = data || [];
      const totalProducts = items.length;
      const totalUnits = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const newCount = items.filter(i => i.type === 'new').length;
      const refurbishedCount = items.filter(i => i.type === 'refurbished').length;

      return {
        totalProducts,
        totalUnits,
        newCount,
        refurbishedCount,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useLastScrapedTime() {
  return useQuery({
    queryKey: ['last-scraped'],
    queryFn: async () => {
      // Get the most recent updated_at from inventory
      const { data, error } = await supabase
        .from('inventory')
        .select('updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return new Date(data.updated_at);
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useRefreshInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // For now, just invalidate queries to refresh from DB
      // In the future, this could call an edge function to scrape new inventory
      return { total_items_added: 0, total_items_updated: 0 };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
      queryClient.invalidateQueries({ queryKey: ['last-scraped'] });

      toast.success('Inventory refreshed');
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
