import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Mic2, MessageSquareQuote, Home, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';

export function GameMenu() {
  const navigate = useNavigate();
  const { voiceEnabled, toggleVoice, speak } = useVoice();
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);
  
  const welcomeMessages = [
    "Aquí puedes elegir el juego que más te guste. Tenemos tres opciones para ti.",
    "Bienvenido al menú de juegos. ¿Qué te gustaría jugar hoy?",
    "Selecciona el juego que prefieras. Todos son fáciles y divertidos.",
    "¿Listo para jugar? Elige entre completar letras, adivinar artistas o completar refranes."
  ];
  
  const gameMessages = {
    complete: "Excelente elección. Vamos a completar la letra de una canción. Escúchala primero y luego elige la palabra que falta.",
    artist: "Muy bien. Vamos a adivinar quién cantaba cada canción. Te daré pistas si las necesitas.",
    proverbs: "Qué bonito. Vamos a completar refranes populares. Son dichos que seguramente conoces."
  };
  
  const helpMessage = "En cada juego encontrarás pistas si te atoras. También puedes usar el botón de voz para desactivarme si prefieres silencio.";
  
  // Bienvenida al cargar el menú
  useEffect(() => {
    if (voiceEnabled && !hasSpokenWelcome) {
      const timer = setTimeout(() => {
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        speak(randomMessage);
        setHasSpokenWelcome(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [voiceEnabled]);
  
  const handleGameSelect = (gameType: 'complete' | 'artist' | 'proverbs') => {
    speak(gameMessages[gameType]);
    setTimeout(() => {
      if (gameType === 'complete') {
        navigate('/songs');
      } else if (gameType === 'artist') {
        navigate('/artist-quiz/instructions');
      } else if (gameType === 'proverbs') {
        navigate('/proverbs/instructions');
      }
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      
      {/* Botón de voz flotante */}
      <button
        onClick={toggleVoice}
        className={`fixed top-4 right-4 w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-all z-20 ${
          voiceEnabled 
            ? 'bg-amber-500 hover:bg-amber-600 text-white' 
            : 'bg-gray-300 hover:bg-gray-400 text-gray-600'
        }`}
        aria-label={voiceEnabled ? "Desactivar voz" : "Activar voz"}
      >
        {voiceEnabled ? (
          <Volume2 className="w-6 h-6" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </button>
      
      <header className="sticky top-0 bg-white shadow-md border-b border-amber-200 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">Juegos</h1>
          <button
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-xl bg-amber-100 hover:bg-amber-200 transition-colors flex items-center justify-center"
            aria-label="Volver al inicio"
          >
            <Home className="w-6 h-6 text-amber-800" />
          </button>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-xl text-amber-700 mb-8">Elige un juego:</p>
        
        <div className="space-y-5">
          <div onClick={() => handleGameSelect('complete')} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-amber-200 hover:border-amber-400 cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Music className="w-8 h-8 text-amber-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-900 mb-1">Completar la letra</h2>
                <p className="text-lg text-amber-700">Canciones del taller</p>
              </div>
            </div>
          </div>
          
          <div onClick={() => handleGameSelect('artist')} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-amber-200 hover:border-amber-400 cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mic2 className="w-8 h-8 text-purple-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-900 mb-1">¿Quién cantaba?</h2>
                <p className="text-lg text-amber-700">Adivina el artista</p>
              </div>
            </div>
          </div>
          
          <div onClick={() => handleGameSelect('proverbs')} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-amber-200 hover:border-amber-400 cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquareQuote className="w-8 h-8 text-blue-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-900 mb-1">Completar refranes</h2>
                <p className="text-lg text-amber-700">Dichos populares</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-amber-600 text-base mt-8">Todos los juegos son fáciles y divertidos</p>
        
        <div className="text-center mt-6">
          <button onClick={() => speak(helpMessage)} className="text-blue-600 hover:text-blue-800 underline text-lg">
            ¿Necesitas ayuda?
          </button>
        </div>
      </main>
    </div>
  );
}