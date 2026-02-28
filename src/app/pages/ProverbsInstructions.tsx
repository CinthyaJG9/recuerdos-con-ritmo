import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MessageSquareQuote } from 'lucide-react';
import { Button } from '../components/Button';

export function ProverbsInstructions() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card shadow-sm border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center gap-4">
          <button
            onClick={() => navigate('/menu')}
            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-warm-beige-dark transition-colors flex-shrink-0"
            aria-label="Volver al menú"
          >
            <ArrowLeft className="w-7 h-7 text-wine" strokeWidth={2} />
          </button>
          
          <h1 className="text-[28px] text-warm-black">
            Completar refranes
          </h1>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-olive-green/10 rounded-3xl mb-6">
            <MessageSquareQuote className="w-14 h-14 text-olive-green" strokeWidth={2} />
          </div>
          
          <h2 className="text-[32px] mb-4 text-warm-black">
            ¿Cómo se juega?
          </h2>
        </div>
        
        <div className="bg-card rounded-2xl p-8 shadow-lg mb-8">
          <div className="space-y-6">
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-olive-green text-warm-white rounded-full flex items-center justify-center text-[22px]">
                1
              </div>
              <p className="text-[22px] text-warm-black leading-relaxed pt-2">
                Verás el inicio de un refrán popular
              </p>
            </div>
            
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-olive-green text-warm-white rounded-full flex items-center justify-center text-[22px]">
                2
              </div>
              <p className="text-[22px] text-warm-black leading-relaxed pt-2">
                Elige cómo termina el refrán entre las opciones
              </p>
            </div>
            
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-olive-green text-warm-white rounded-full flex items-center justify-center text-[22px]">
                3
              </div>
              <p className="text-[22px] text-warm-black leading-relaxed pt-2">
                Lee con calma, seguro los conoces
              </p>
            </div>
            
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-olive-green text-warm-white rounded-full flex items-center justify-center text-[22px]">
                4
              </div>
              <p className="text-[22px] text-warm-black leading-relaxed pt-2">
                Al terminar verás cuántos completaste bien
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-olive-green/10 rounded-xl p-6 mb-8">
          <p className="text-[20px] text-olive-green-dark leading-relaxed text-center">
            Son refranes que hemos escuchado toda la vida. ¡Divierte recordando la sabiduría popular!
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/proverbs/play')}
            className="bg-olive-green text-warm-white hover:bg-olive-green-dark shadow-md rounded-xl transition-all duration-200 active:scale-95 px-10 py-5 min-h-[70px] text-[22px]"
          >
            Comenzar a jugar
          </button>
        </div>
      </div>
    </div>
  );
}
