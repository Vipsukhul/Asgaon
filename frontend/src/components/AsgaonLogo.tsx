import React from 'react';

interface AsgaonLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AsgaonLogo: React.FC<AsgaonLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { img: 'w-8 h-8', title: 'text-[16px]', sub: 'text-[9px]' },
    md: { img: 'w-10 h-10', title: 'text-[19px]', sub: 'text-[10px]' },
    lg: { img: 'w-14 h-14', title: 'text-[22px]', sub: 'text-[11px]' },
    xl: { img: 'w-20 h-20', title: 'text-[26px]', sub: 'text-[12px]' }
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 ${onClick ? 'cursor-pointer select-none group' : ''} ${className}`}
    >
      <div className={`relative ${current.img} rounded-full overflow-hidden shrink-0 shadow-xs border border-[#baeed9]/40 bg-white ring-2 ring-[#003629]/10 group-hover:ring-[#003629]/30 transition-all`}>
        <img
          src="/asgaon-logo.png"
          alt="Asgaon Gram Panchayat Official Logo"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-heading font-extrabold tracking-tight text-[#003629] leading-none ${current.title}`}>
              Asgaon
            </span>
            <span className="text-[10px] font-bold text-[#006a4e] bg-[#baeed9]/60 px-1.5 py-0.2 rounded-full border border-[#baeed9]">
              असगाव
            </span>
          </div>
          <span className={`uppercase font-bold tracking-wider text-[#a63b00] mt-0.5 ${current.sub}`}>
            Gram Panchayat • Pauni
          </span>
        </div>
      )}
    </div>
  );
};
