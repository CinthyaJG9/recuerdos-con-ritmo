import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquareQuote, Home, HelpCircle, Mic, Volume2 } from 'lucide-react';

export function ProverbsInstructions() {
  const navigate = useNavigate();
  const [showTips, setShowTips] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      
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
              Completar refranes
            </h1>
          </div>
          
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
            aria-label="Consejos"
          >
            <HelpCircle className="w-7 h-7 text-blue-700" />
          </button>
          
        </div>
      </header>

      {showTips && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Consejos útiles:</h3>
            
            <div className="space-y-4 text-lg">
              <div className="flex gap-3 items-start">
                <Mic className="w-6 h-6 text-orange-500 flex-shrink-0" />
                <p className="text-amber-700">Puedes responder con voz</p>
              </div>
              
              <div className="flex gap-3 items-start">
                <Volume2 className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <p className="text-amber-700">Habla claramente</p>
              </div>
              
              <div className="flex gap-3 items-start">
                <span className="text-2xl"></span>
                <p className="text-amber-700">Usa la pista si no recuerdas</p>
              </div>
              
              <div className="flex gap-3 items-start">
                <span className="text-2xl"></span>
                <p className="text-amber-700">Tómate tu tiempo</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowTips(false)}
              className="mt-6 w-full py-4 bg-amber-600 text-white text-xl font-bold rounded-xl hover:bg-amber-700 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-amber-400 to-orange-400 rounded-3xl mb-4 shadow-lg">
            <MessageSquareQuote className="w-16 h-16 text-white" strokeWidth={1.5} />
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
                  Verás el inicio de un refrán popular
                </p>
              </div>
            </div>
            
            <div className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
                2
              </div>
              <div className="flex-1 pt-2">
                <p className="text-2xl text-amber-900 leading-relaxed">
                  Elige cómo termina entre las opciones
                </p>
              </div>
            </div>
            
            <div className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
                3
              </div>
              <div className="flex-1 pt-2">
                <p className="text-2xl text-amber-900 leading-relaxed">
                  Responde con voz o tocando la opción
                </p>
              </div>
            </div>
            
            <div className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
                4
              </div>
              <div className="flex-1 pt-2">
                <p className="text-2xl text-amber-900 leading-relaxed">
                  Al terminar verás cuántos acertaste
                </p>
              </div>
            </div>
            
          </div>
          
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/proverbs/play')}
            className="w-full sm:w-auto px-12 py-6 bg-amber-600 hover:bg-amber-700 text-white text-2xl sm:text-3xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4"
          >
            <MessageSquareQuote className="w-8 h-8" />
            Comenzar a jugar
          </button>
        </div>
        
      </main>
    </div>
  );
}