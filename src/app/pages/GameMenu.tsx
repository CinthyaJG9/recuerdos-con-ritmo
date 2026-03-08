import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Mic2, MessageSquareQuote, Home } from 'lucide-react';
import { GameCard } from '../components/GameCard';

export function GameMenu() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      
      {/* Header simplificado */}
      <header className="sticky top-0 bg-white shadow-md border-b border-amber-200 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">
            Juegos
          </h1>
          
          <button
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-xl bg-amber-100 hover:bg-amber-200 transition-colors flex items-center justify-center"
            aria-label="Volver al inicio"
          >
            <Home className="w-6 h-6 text-amber-800" />
          </button>
          
        </div>
      </header>
      
      {/* Contenido principal */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Instrucción breve - una sola línea */}
        <p className="text-xl text-amber-700 mb-8">
          Elige un juego:
        </p>
        
        {/* Tarjetas de juego */}
        <div className="space-y-5">
          
          {/* Juego 1: Completar letra */}
          <div 
            onClick={() => navigate('/songs')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-amber-200 hover:border-amber-400 cursor-pointer"
          >
            <div className="flex items-center gap-5">
              
              <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Music className="w-8 h-8 text-amber-700" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-900 mb-1">
                  Completar la letra
                </h2>
                <p className="text-lg text-amber-700">
                  Canciones del taller
                </p>
              </div>
              
            </div>
          </div>
          
          {/* Juego 2: ¿Quién cantaba? */}
          <div 
            onClick={() => navigate('/artist-quiz/instructions')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-amber-200 hover:border-amber-400 cursor-pointer"
          >
            <div className="flex items-center gap-5">
              
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mic2 className="w-8 h-8 text-purple-700" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-900 mb-1">
                  ¿Quién cantaba?
                </h2>
                <p className="text-lg text-amber-700">
                  Adivina el artista
                </p>
              </div>
              
            </div>
          </div>
          
          {/* Juego 3: Completar refranes */}
          <div 
            onClick={() => navigate('/proverbs/instructions')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-amber-200 hover:border-amber-400 cursor-pointer"
          >
            <div className="flex items-center gap-5">
              
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquareQuote className="w-8 h-8 text-blue-700" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-900 mb-1">
                  Completar refranes
                </h2>
                <p className="text-lg text-amber-700">
                  Dichos populares
                </p>
              </div>
              
            </div>
          </div>
          
        </div>

        <p className="text-center text-amber-600 text-base mt-8">
          Todos los juegos son fáciles y divertidos
        </p>
        
      </main>
      
    </div>
  );
}