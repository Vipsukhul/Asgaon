import React from 'react';

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
                <span className="material-symbols-outlined text-[14px] text-[#a0aaa5] select-none">
                  chevron_right
                </span>
              )}
              {isLast || item.active || !item.onClick ? (
                <span className="font-semibold text-[#1d1b16] flex items-center gap-1">
                  {index === 0 && (
                    <span className="material-symbols-outlined text-[15px] text-[#006a4e]">home</span>
                  )}
                  <span>{item.label}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-[#003629] hover:underline font-medium text-[#55605a] transition-colors flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#003629] rounded px-1 -mx-1"
                >
                  {index === 0 && (
                    <span className="material-symbols-outlined text-[15px]">home</span>
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
