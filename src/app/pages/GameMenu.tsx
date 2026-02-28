import React from 'react';
import { useNavigate } from 'react-router';
import { Music, Mic2, MessageSquareQuote, Home } from 'lucide-react';
import { GameCard } from '../components/GameCard';

export function GameMenu() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card shadow-sm border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <h1 className="text-[28px] text-warm-black">
            Juegos
          </h1>
          
          <button
            onClick={() => navigate('/')}
            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-warm-beige-dark transition-colors"
            aria-label="Volver al inicio"
          >
            <Home className="w-7 h-7 text-wine" strokeWidth={2} />
          </button>
        </div>
      </div>
      
      {/* Lista de juegos */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-[22px] text-warm-gray mb-8 leading-relaxed">
          Elige el juego que quieres disfrutar
        </p>
        
        <div className="space-y-6">
          <GameCard
            title="Completar la letra"
            description="Practica las canciones del taller completando las palabras que faltan"
            icon={Music}
            onClick={() => navigate('/songs')}
            iconBgColor="bg-wine/10"
            iconColor="text-wine"
          />
          
          <GameCard
            title="¿Quién cantaba esta canción?"
            description="Adivina qué artista interpretaba las canciones de tu época"
            icon={Mic2}
            onClick={() => navigate('/artist-quiz/instructions')}
            iconBgColor="bg-deep-blue/10"
            iconColor="text-deep-blue"
          />
          
          <GameCard
            title="Completar refranes"
            description="Completa los refranes y dichos populares que todos conocemos"
            icon={MessageSquareQuote}
            onClick={() => navigate('/proverbs/instructions')}
            iconBgColor="bg-olive-green/10"
            iconColor="text-olive-green"
          />
        </div>
      </div>
    </div>
  );
}
