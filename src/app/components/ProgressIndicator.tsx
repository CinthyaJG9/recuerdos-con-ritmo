import React from 'react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <p className="text-[18px] text-warm-gray">
          Pregunta {current} de {total}
        </p>
        <p className="text-[18px] text-wine">
          {Math.round(percentage)}%
        </p>
      </div>
      
      <div className="w-full h-3 bg-warm-beige-dark rounded-full overflow-hidden">
        <div 
          className="h-full bg-wine transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
