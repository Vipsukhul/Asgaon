import type { MandiPrice } from '../types';

interface LiveMandiTickerProps {
  prices: MandiPrice[];
  onViewAllMandi: () => void;
}

export const LiveMandiTicker: React.FC<LiveMandiTickerProps> = ({ prices, onViewAllMandi }) => {
  return (
    <section className="w-full bg-[#f9f3ea] rounded-2xl p-4 sm:p-5 shadow-xs mb-10 border border-[#e8e2d9]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#003629] text-[20px]">trending_up</span>
          <span className="font-heading font-extrabold text-[15px] text-[#003629]">
            LIVE MANDI BHAAV (पुणे - हवेली बाजार समिती दर)
          </span>
          <span className="text-[12px] text-[#707974] hidden md:inline">
            • Updated Today, 6:30 AM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#707974] hidden lg:inline">
            Official APMC Weights • Rates per Quintal (100 kg)
          </span>
          <button
            onClick={onViewAllMandi}
            className="text-[12px] text-[#a63b00] font-bold hover:underline flex items-center"
          >
            <span>Full APMC Sheet</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {prices.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-3.5 shadow-xs border border-[#e8e2d9] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <div>
                <div className="font-heading font-bold text-[14px] text-[#1d1b16] leading-tight">
                  {item.commodityName}
                </div>
                <div className="text-[11px] text-[#707974]">{item.variety}</div>
              </div>

              {item.trend === 'up' && (
                <span className="inline-flex items-center text-[10px] font-extrabold bg-[#baeed9] text-[#002117] px-1.5 py-0.5 rounded">
                  +{item.priceChange}
                </span>
              )}
              {item.trend === 'down' && (
                <span className="inline-flex items-center text-[10px] font-extrabold bg-[#ffdad6] text-[#93000a] px-1.5 py-0.5 rounded">
                  {item.priceChange}
                </span>
              )}
              {item.trend === 'stable' && (
                <span className="inline-flex items-center text-[10px] font-bold bg-[#f3ede4] text-[#404945] px-1.5 py-0.5 rounded">
                  Stable
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-[#f3ede4]">
              <div className="font-heading font-extrabold text-[18px] text-[#003629]">
                ₹{item.modalPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] font-medium text-[#707974]">
                / {item.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
