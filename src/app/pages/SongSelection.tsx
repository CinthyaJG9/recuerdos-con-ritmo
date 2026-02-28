import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Home } from 'lucide-react';
import { songs } from '../data/songs';
import { SongCard } from '../components/SongCard';

export function SongSelection() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card shadow-sm border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/menu')}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-warm-beige-dark transition-colors flex-shrink-0"
              aria-label="Volver al menú"
            >
              <ArrowLeft className="w-7 h-7 text-wine" strokeWidth={2} />
            </button>
            
            <h1 className="text-[28px] text-warm-black">
              Completar la letra
            </h1>
          </div>
          
          <button
            onClick={() => navigate('/menu')}
            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-warm-beige-dark transition-colors"
            aria-label="Ir al menú"
          >
            <Home className="w-7 h-7 text-wine" strokeWidth={2} />
          </button>
        </div>
      </div>
      
      {/* Lista de canciones */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-[20px] text-warm-gray mb-8 leading-relaxed">
          Elige la canción que quieres practicar hoy
        </p>
        
        <div className="space-y-4">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onClick={() => navigate(`/game-type/${song.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}