'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  filters?: FilterConfig[];
  onClear?: () => void;
  className?: string;
}

export function FilterBar({ search, filters = [], onClear, className }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const hasActiveFilters =
    (search?.value && search.value.length > 0) ||
    filters.some((f) => f.value !== '' && f.value !== 'all');

  return (
    <div data-testid="filter-bar" className={cn('space-y-3', className)}>
      {/* Top row: search + toggle */}
      <div className="flex items-center gap-2">
        {search && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
            <input
              data-testid="filter-bar-search"
              type="text"
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder={search.placeholder ?? 'Search…'}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        )}

        {filters.length > 0 && (
          <button
            data-testid="filter-bar-toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-border transition-colors',
              expanded ? 'bg-primary-light text-primary border-primary' : 'hover:bg-surface-alt text-foreground-secondary',
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary ml-0.5" aria-label="active filters" />
            )}
          </button>
        )}

        {hasActiveFilters && onClear && (
          <button
            data-testid="filter-bar-clear"
            onClick={onClear}
            className="flex items-center gap-1 text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* Expanded filters row */}
      {expanded && filters.length > 0 && (
        <div data-testid="filter-bar-expanded" className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col gap-0.5">
              <label htmlFor={`filter-${filter.key}`} className="text-xs text-foreground-muted px-1">
                {filter.label}
              </label>
              <select
                id={`filter-${filter.key}`}
                data-testid={`filter-select-${filter.key}`}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-1.5 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
