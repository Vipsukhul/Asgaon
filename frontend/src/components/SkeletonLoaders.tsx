import React from 'react';

/**
 * Atomic Skeleton component with modern linear-gradient shimmer light wave.
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-lg ${className}`} />
);

/**
 * Enterprise Card Skeleton matching FeaturedEnterprises.tsx layout
 */
export const EnterpriseCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-stone-200/80 flex flex-col justify-between">
    {/* Image placeholder */}
    <div className="relative h-44 w-full skeleton-shimmer">
      <div className="absolute top-3 left-3 w-20 h-5 rounded-full bg-white/70" />
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70" />
    </div>
    {/* Content */}
    <div className="p-4 flex flex-col gap-2.5 flex-1 justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-5 w-4/5 rounded-md" />
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-2/3 rounded-md" />
      </div>
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-7 w-20 rounded-xl" />
      </div>
    </div>
  </div>
);

export const EnterpriseGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <EnterpriseCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Job Card Skeleton matching JobsBoardSection.tsx layout
 */
export const JobCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200/80 flex flex-col justify-between">
    <div className="space-y-3">
      {/* Badges bar */}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
      {/* Title & Employer */}
      <div className="space-y-1.5">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
      {/* Description Snippet */}
      <div className="space-y-1 pt-1">
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-5/6 rounded-md" />
      </div>
      {/* Wage Pill */}
      <div className="pt-2">
        <Skeleton className="h-7 w-32 rounded-xl" />
      </div>
    </div>
    {/* Bottom Action */}
    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
      <Skeleton className="h-4 w-24 rounded-md" />
      <Skeleton className="h-8 w-28 rounded-xl" />
    </div>
  </div>
);

export const JobGridSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <JobCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Sarkari Yojana Scheme Card Skeleton matching GovtSchemesSection.tsx layout
 */
export const SchemeCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200/80 flex flex-col justify-between">
    <div>
      {/* Title & Category */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      {/* Description */}
      <div className="space-y-1.5 mb-4">
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-4/5 rounded-md" />
      </div>
      {/* Required Docs Box */}
      <div className="bg-[#faf6ee] p-3.5 rounded-xl border border-[#efe7dc] space-y-2 mb-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3.5 w-28 rounded-md" />
        </div>
        <div className="space-y-1.5 pl-2">
          <Skeleton className="h-3 w-40 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />
          <Skeleton className="h-3 w-36 rounded-md" />
        </div>
      </div>
    </div>
    {/* Bottom Actions */}
    <div className="mt-2 pt-3 border-t border-[#efe7dc] flex items-center justify-between gap-2">
      <Skeleton className="h-4 w-32 rounded-md" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SchemeGridSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <SchemeCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Mandi Ticker Item Skeleton matching LiveMandiTicker.tsx
 */
export const MandiTickerSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white p-3.5 rounded-xl border border-[#efe7dc] shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <Skeleton className="h-6 w-24 rounded-md" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-3 w-10 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Announcement / Notice Skeleton matching Official Alerts & Admin Notices
 */
export const AnnouncementCardSkeleton: React.FC = () => (
  <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col gap-2.5">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
      <Skeleton className="h-4 w-24 rounded-md" />
    </div>
    <Skeleton className="h-5 w-3/4 rounded-md" />
    <div className="space-y-1">
      <Skeleton className="h-3.5 w-full rounded-md" />
      <Skeleton className="h-3.5 w-4/5 rounded-md" />
    </div>
    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
      <Skeleton className="h-3.5 w-28 rounded-md" />
      <Skeleton className="h-6 w-16 rounded-lg" />
    </div>
  </div>
);

export const AnnouncementListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <AnnouncementCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Admin Table Skeleton for Users, Grievances, Businesses
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white rounded-2xl border border-[#e8e2d9] overflow-hidden shadow-xs">
    {/* Table Header */}
    <div className="bg-[#f7f3ea] px-4 py-3 border-b border-[#e8e2d9] flex items-center justify-between gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-24 rounded-md" />
      ))}
    </div>
    {/* Table Rows */}
    <div className="divide-y divide-stone-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-4 w-28 rounded-md hidden sm:block" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Comprehensive Page Suspense Fallback Skeleton with header, hero banner, and cards grid
 */
export const PageSuspenseFallback: React.FC = () => (
  <div className="min-h-[70vh] max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fade-in">
    {/* Top breadcrumb & title shimmer */}
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded-md" />
        <span className="text-stone-300">/</span>
        <Skeleton className="h-4 w-28 rounded-md" />
      </div>
      <Skeleton className="h-8 w-64 rounded-xl" />
      <Skeleton className="h-4 w-96 max-w-full rounded-md" />
    </div>

    {/* Hero Banner Shimmer */}
    <div className="w-full h-44 sm:h-56 rounded-3xl skeleton-shimmer relative overflow-hidden p-6 flex flex-col justify-end">
      <div className="space-y-2 max-w-md">
        <div className="h-6 w-3/4 rounded-lg bg-white/60" />
        <div className="h-4 w-1/2 rounded-lg bg-white/50" />
      </div>
    </div>

    {/* Filter Pills Shimmer */}
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-xl" />
      ))}
    </div>

    {/* Cards Grid Shimmer */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <SchemeCardSkeleton key={i} />
      ))}
    </div>
  </div>
);
