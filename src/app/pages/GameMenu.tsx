import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Mic2, MessageSquareQuote, Home } from 'lucide-react';
import { GameCard } from '../components/GameCard';

export function GameMenu() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card shadow-md border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <h1 className="text-[28px] text-warm-black">
            Juegos
          </h1>
          
          <button
            onClick={() => navigate('/')}
            className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-peach/20 transition-colors"
            aria-label="Volver al inicio"
          >
            <Home className="w-7 h-7 text-coral" strokeWidth={2} />
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
            iconBgColor="bg-coral/15"
            iconColor="text-coral"
          />
          
          <GameCard
            title="¿Quién cantaba esta canción?"
            description="Adivina qué artista interpretaba las canciones de tu época"
            icon={Mic2}
            onClick={() => navigate('/artist-quiz/instructions')}
            iconBgColor="bg-lavender/20"
            iconColor="text-lavender-dark"
          />
          
          <GameCard
            title="Completar refranes"
            description="Completa los refranes y dichos populares que todos conocemos"
            icon={MessageSquareQuote}
            onClick={() => navigate('/proverbs/instructions')}
            iconBgColor="bg-sky-blue/20"
            iconColor="text-sky-blue-dark"
          />
        </div>
      </div>
    </div>
  );
}
