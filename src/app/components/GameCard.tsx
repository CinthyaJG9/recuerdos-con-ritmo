import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  iconBgColor?: string;
  iconColor?: string;
}

export function GameCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  iconBgColor = 'bg-wine/10',
  iconColor = 'text-wine'
}: GameCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 border-2 border-transparent hover:border-wine/30 text-left"
    >
      <div className="flex items-start gap-6">
        <div className={`flex-shrink-0 w-20 h-20 ${iconBgColor} rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-11 h-11 ${iconColor}`} strokeWidth={2} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-[26px] mb-3 text-warm-black leading-tight">
            {title}
          </h3>
          <p className="text-[20px] text-warm-gray leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
