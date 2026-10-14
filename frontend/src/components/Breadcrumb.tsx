import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  rightBadge?: React.ReactNode;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, rightBadge }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[12px] text-[#707974] gap-2 py-1">
      <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-[#a0aaa5] select-none shrink-0" />
              )}
              {isLast || item.active || !item.onClick ? (
                <span className="font-semibold text-[#1d1b16] flex items-center gap-1">
                  {index === 0 && (
                    <Home className="w-3.5 h-3.5 text-[#14532d] shrink-0" />
                  )}
                  <span>{item.label}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-[#166534] hover:underline font-medium text-[#55605a] transition-colors flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#166534] rounded px-1 -mx-1"
                >
                  {index === 0 && (
                    <Home className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{item.label}</span>
                </button>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {rightBadge && (
        <div className="shrink-0">
          {rightBadge}
        </div>
      )}
    </div>
  );
};
