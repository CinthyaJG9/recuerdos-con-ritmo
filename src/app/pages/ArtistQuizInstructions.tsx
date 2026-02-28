import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Mic2 } from 'lucide-react';
import { Button } from '../components/Button';

export function ArtistQuizInstructions() {
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
            ¿Quién cantaba?
          </h1>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-deep-blue/10 rounded-3xl mb-6">
            <Mic2 className="w-14 h-14 text-deep-blue" strokeWidth={2} />
          </div>
          
          <h2 className="text-[32px] mb-4 text-warm-black">
            ¿Cómo se juega?
          </h2>
        </div>
        
        <div className="bg-card rounded-2xl p-8 shadow-lg mb-8">
          <div className="space-y-6">
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-deep-blue text-warm-white rounded-full flex items-center justify-center text-[22px]">
                1
              </div>
              <p className="text-[22px] text-warm-black leading-relaxed pt-2">
                Te mostraremos el título de una canción famosa
              </p>
            </div>
            
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-deep-blue text-warm-white rounded-full flex items-center justify-center text-[22px]">
                2
              </div>
              <p className="text-[22px] text-warm-black leading-relaxed pt-2">
                Elige entre las opciones quién la cantaba
              </p>
            </div>
            
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-deep-blue text-warm-white rounded-full flex items-center justify-center text-[22px]">
                3
              </div>
              <p className="text-[22px] text-warm-black leading-relaxed pt-2">
                Toma tu tiempo, no hay prisa
              </p>
            </div>
            
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-deep-blue text-warm-white rounded-full flex items-center justify-center text-[22px]">
                4
              </div>
              <p className="text-[22px] text-warm-black leading-relaxed pt-2">
                Al final verás cuántas adivinaste
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-deep-blue/10 rounded-xl p-6 mb-8">
          <p className="text-[20px] text-deep-blue-dark leading-relaxed text-center">
            Son canciones que seguramente conoces y has escuchado muchas veces. ¡Disfruta recordando!
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate('/artist-quiz/play')}
            variant="secondary"
          >
            Comenzar a jugar
          </Button>
        </div>
      </div>
    </div>
  );
}
