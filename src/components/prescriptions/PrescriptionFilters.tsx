import React, { useState, useMemo } from 'react';
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
  React.useEffect(() => {
    let result = [...initialPrescriptions].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    if (filterCategory !== 'All')
      result = result.filter((p) => p.category === filterCategory);
    if (filterActive !== null)
      result = result.filter((p) => p.active === filterActive);

    setPrescriptions(result);
  }, [filterCategory, filterActive, setPrescriptions]);

  return (
    <div className="bg-indigo-800 p-4 rounded-lg shadow-lg mb-6">
      <h2 className="text-white tracking-wide font-medium text-lg mb-3">
        Filters
      </h2>
      <div className="flex flex-wrap gap-4 items-center">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category-filter" className="text-white">
            Category
          </Label>
          {/* Select component for category filter */}
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger
              id="category-filter"
              className="w-[180px] bg-indigo-600 text-white border-indigo-600"
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
        <div className="space-y-2">
          <Label htmlFor="status-filter" className="text-white">
            Status
          </Label>
          {/* Select component for status filter */}
          <Select
            value={filterActive === null ? 'All' : filterActive.toString()}
            onValueChange={(value) =>
              setFilterActive(value === 'All' ? null : value === 'true')
            }
          >
            <SelectTrigger
              id="status-filter"
              className="w-[180px] bg-indigo-600 text-white border-indigo-600"
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
        <div className="space-y-2">
          <Label className="text-transparent">Reset</Label>
          <button
            onClick={() => {
              setFilterCategory('All');
              setFilterActive(null);
              setPrescriptions(
                [...initialPrescriptions].sort((a, b) =>
                  a.name.localeCompare(b.name)
                )
              );
            }}
            className="p-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
