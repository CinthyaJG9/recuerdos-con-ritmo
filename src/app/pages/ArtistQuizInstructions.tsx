import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic2, Home, Calendar } from 'lucide-react';

export function ArtistQuizInstructions() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md border-b border-amber-200 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/menu')}
              className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
              aria-label="Volver al menú"
            >
              <ArrowLeft className="w-7 h-7 text-amber-800" />
            </button>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">
              ¿Quién cantaba?
            </h1>
          </div>
          
          <button
            onClick={() => navigate('/menu')}
            className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
            aria-label="Ir al inicio"
          >
            <Home className="w-7 h-7 text-amber-800" />
          </button>
          
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl mb-4 shadow-lg">
            <Mic2 className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-3">
            ¿Cómo se juega?
          </h2>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 border-2 border-amber-200">
          
          <div className="space-y-6">
            
            <div className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
                1
              </div>
              <div className="flex-1 pt-2">
                <p className="text-2xl text-amber-900 leading-relaxed">
                  Verás el título de una canción
                </p>
              </div>
            </div>
            
            <div className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
                2
              </div>
              <div className="flex-1 pt-2">
                <p className="text-2xl text-amber-900 leading-relaxed">
                  Elige qué artista la cantaba
                </p>
              </div>
            </div>
            
            <div className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
                3
              </div>
              <div className="flex-1 pt-2">
                <p className="text-2xl text-amber-900 leading-relaxed">
                  Canciones de los 60s, 70s y 80s
                </p>
              </div>
            </div>
            
            <div className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
                4
              </div>
              <div className="flex-1 pt-2">
                <p className="text-2xl text-amber-900 leading-relaxed">
                  La pista te ayudará a recordar
                </p>
              </div>
            </div>
            
          </div>
          
        </div>
        
        <div className="bg-purple-50 rounded-2xl p-6 mb-8 border border-purple-200">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calendar className="w-8 h-8 text-purple-600" />
            <p className="text-xl text-purple-800 font-bold">
              Décadas: 60s · 70s · 80s
            </p>
          </div>
          <p className="text-lg text-purple-700 text-center">
            Grandes hits en español e inglés. ¡Pon a prueba tu memoria musical!
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/artist-quiz/play')}
            className="w-full sm:w-auto px-12 py-6 bg-amber-600 hover:bg-amber-700 text-white text-2xl sm:text-3xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4"
          >
            <Mic2 className="w-8 h-8" />
            Comenzar a jugar
          </button>
        </div>
        
      </main>
    </div>
  );
}