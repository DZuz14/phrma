import React, { useState, useMemo, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { usePrescriptions } from './context/PrescriptionsContext';
import { initialPrescriptions } from './data/mockPrescriptions';
import { toast } from 'sonner';

/**
 * Prescription Filters Component
 * Allows filtering prescriptions by category and status
 */
export const PrescriptionFilters: React.FC = () => {
  const { setPrescriptions } = usePrescriptions();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  /**
   * Memoized categories array
   * Combines 'All' with unique categories from prescriptions
   */
  const categories = useMemo(
    () => ['All', ...new Set(initialPrescriptions.map((p) => p.category))],
    []
  );

  // Apply filters whenever any filter state changes
  useEffect(() => {
    try {
      let result = [...initialPrescriptions];

      // Apply category filter
      if (filterCategory !== 'All') {
        result = result.filter((p) => p.category === filterCategory);
      }
      // Apply status filter
      if (filterActive !== null) {
        result = result.filter((p) => p.active === filterActive);
      }
      // Sort alphabetically
      result.sort((a, b) => a.name.localeCompare(b.name));
      setPrescriptions(result);
    } catch (error) {
      console.error('Filter application error:', error);
      toast.error('Failed to apply filters');
      handleResetFilters();
    }
  }, [filterCategory, filterActive, setPrescriptions]);

  // When the reset button is clicked, reset the filters to the initial state
  const handleResetFilters = () => {
    try {
      setFilterCategory('All');
      setFilterActive(null);
      setPrescriptions(
        [...initialPrescriptions].sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch (error) {
      console.error('Filter reset error:', error);
      toast.error('Failed to reset filters');
    }
  };

  return (
    <div className="bg-indigo-800 rounded-lg shadow-lg mb-4 md:mb-6 p-3 md:p-4 border-2 border-indigo-400">
      <h2 className="text-white/90 font-medium tracking-tight text-base md:text-lg mb-3">
        Prescription Filters
      </h2>
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-100/75 to-transparent mb-4" />

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 items-start sm:items-center">
        {/* Category Filter */}
        <div className="w-full sm:w-auto space-y-1 md:space-y-1.5">
          <Label
            htmlFor="category-filter"
            className="text-white/90 text-sm md:text-base"
          >
            Category:
          </Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger
              id="category-filter"
              className="w-full sm:w-[180px] bg-indigo-600 text-white border-indigo-600 text-sm md:text-base"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto space-y-1 md:space-y-1.5">
          <Label
            htmlFor="status-filter"
            className="text-white/90 text-sm md:text-base"
          >
            Status:
          </Label>
          <Select
            value={filterActive === null ? 'All' : filterActive.toString()}
            onValueChange={(value) =>
              setFilterActive(value === 'All' ? null : value === 'true')
            }
          >
            <SelectTrigger
              id="status-filter"
              className="w-full sm:w-[180px] bg-indigo-600 text-white border-indigo-600 text-sm md:text-base"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters Button */}
        <div className="mt-2 w-full sm:w-auto space-y-1 md:space-y-1.5">
          <Label className="text-transparent">Reset</Label>
          <button
            onClick={handleResetFilters}
            className="w-full sm:w-[120px] h-[40px] bg-indigo-600 text-white text-sm rounded hover:bg-indigo-500 transition-colors border-2 border-indigo-400 flex items-center justify-center cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
