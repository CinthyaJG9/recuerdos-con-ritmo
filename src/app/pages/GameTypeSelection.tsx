import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, CheckCircle2, Shuffle } from 'lucide-react';
import { songs } from '../data/songs';
import { Button } from '../components/Button';

export function GameTypeSelection() {
  const navigate = useNavigate();
  const { songId } = useParams<{ songId: string }>();
  const song = songs.find(s => s.id === songId);
  
  if (!song) {
    navigate('/songs');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card shadow-sm border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center gap-4">
          <button
            onClick={() => navigate('/songs')}
            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-warm-beige-dark transition-colors flex-shrink-0"
            aria-label="Volver a canciones"
          >
            <ArrowLeft className="w-7 h-7 text-wine" strokeWidth={2} />
          </button>
          
          <div>
            <h1 className="text-[28px] text-warm-black leading-tight">
              {song.title}
            </h1>
            <p className="text-[18px] text-warm-gray">
              {song.artist}
            </p>
          </div>
        </div>
      </div>
      
      {/* Opciones de juego */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-[26px] text-warm-black mb-8 text-center">
          ¿Cómo quieres practicar?
        </h2>
        
        <div className="space-y-6">
          {/* Completar letra */}
          <div 
            onClick={() => navigate(`/game/${songId}/complete`)}
            className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-wine/30 active:scale-98"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-wine/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-wine" strokeWidth={2} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-[26px] mb-3 text-warm-black">
                  Completar la letra
                </h3>
                <p className="text-[20px] text-warm-gray leading-relaxed mb-3">
                  Lee fragmentos de la canción y elige la palabra que falta
                </p>
                <div className="inline-flex items-center gap-2 bg-olive-green/10 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-olive-green rounded-full"></div>
                  <span className="text-[18px] text-olive-green-dark">Nivel Fácil</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ordenar fragmentos */}
          <div 
            className="bg-card rounded-2xl p-8 shadow-lg border-2 border-warm-gray-light/30 opacity-60 cursor-not-allowed"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-warm-gray-light/10 rounded-xl flex items-center justify-center">
                <Shuffle className="w-9 h-9 text-warm-gray-light" strokeWidth={2} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-[26px] mb-3 text-warm-gray">
                  Ordenar fragmentos
                </h3>
                <p className="text-[20px] text-warm-gray-light leading-relaxed mb-3">
                  Organiza las frases en el orden correcto de la canción
                </p>
                <div className="inline-flex items-center gap-2 bg-warm-gray-light/10 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-warm-gray-light rounded-full"></div>
                  <span className="text-[18px] text-warm-gray-light">Próximamente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            onClick={() => navigate('/songs')}
            variant="outline"
            size="medium"
          >
            Elegir otra canción
          </Button>
        </div>
      </div>
    </div>
  );
}
