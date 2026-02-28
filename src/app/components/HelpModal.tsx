import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType?: 'complete' | 'order';
}

export function HelpModal({ isOpen, onClose, gameType = 'complete' }: HelpModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-warm-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full hover:bg-warm-beige-dark transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-7 h-7 text-warm-gray" strokeWidth={2} />
        </button>
        
        <h2 className="text-[32px] mb-6 text-warm-black pr-12">
          ¿Cómo jugar?
        </h2>
        
        <div className="space-y-5 mb-8">
          {gameType === 'complete' ? (
            <>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-wine text-warm-white rounded-full flex items-center justify-center text-[20px]">
                  1
                </div>
                <p className="text-[20px] text-warm-black leading-relaxed pt-1">
                  Lee con calma el fragmento de la canción
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-wine text-warm-white rounded-full flex items-center justify-center text-[20px]">
                  2
                </div>
                <p className="text-[20px] text-warm-black leading-relaxed pt-1">
                  Elige la palabra que falta tocando una de las tres opciones
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-wine text-warm-white rounded-full flex items-center justify-center text-[20px]">
                  3
                </div>
                <p className="text-[20px] text-warm-black leading-relaxed pt-1">
                  Si necesitas ayuda, toca el botón "Pista" para ver una sugerencia
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-wine text-warm-white rounded-full flex items-center justify-center text-[20px]">
                  4
                </div>
                <p className="text-[20px] text-warm-black leading-relaxed pt-1">
                  Continúa hasta completar todas las preguntas
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-wine text-warm-white rounded-full flex items-center justify-center text-[20px]">
                  1
                </div>
                <p className="text-[20px] text-warm-black leading-relaxed pt-1">
                  Lee los fragmentos de la canción que están desordenados
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-wine text-warm-white rounded-full flex items-center justify-center text-[20px]">
                  2
                </div>
                <p className="text-[20px] text-warm-black leading-relaxed pt-1">
                  Toca y arrastra cada fragmento para ordenarlos correctamente
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-wine text-warm-white rounded-full flex items-center justify-center text-[20px]">
                  3
                </div>
                <p className="text-[20px] text-warm-black leading-relaxed pt-1">
                  Cuando termines, toca "Verificar" para ver si está correcto
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-center">
          <Button onClick={onClose} variant="primary">
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
}
