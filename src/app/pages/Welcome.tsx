import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music2, Heart, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../components/Button';
import { voiceService } from '../data/voiceService';

export function Welcome() {
  const navigate = useNavigate();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasSpoken, setHasSpoken] = useState(false);
  
  const welcomeMessages = [
    "Qué gusto tenerte aquí. ¿Listo para disfrutar de la música que tanto te gusta?",
    "Hola, me da mucho gusto verte. Vamos a recordar juntos grandes canciones.",
    "Bienvenido a tu espacio de música. Aquí puedes jugar y disfrutar a tu ritmo.",
    "Qué bonito que estés aquí. Prepárate para un rato agradable con canciones que conoces."
  ];
  
  const startMessage = "Vamos a empezar. Elige el juego que más te guste, yo te acompañaré.";
  
  const voiceMessages = {
    on: "Listo, ahora te hablaré para ayudarte.",
    off: "Está bien, ya no hablaré. Si me necesitas, solo presiona el botón otra vez."
  };
  
  useEffect(() => {
    if (!hasSpoken && voiceEnabled) {
      const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      setTimeout(() => voiceService.speak(randomMessage), 500);
      setHasSpoken(true);
    }
    
    return () => {
      voiceService.cancel();
    };
  }, []);
  
  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    if (newState) {
      setTimeout(() => voiceService.speak(voiceMessages.on), 100);
    } else {
      setTimeout(() => voiceService.speak(voiceMessages.off), 100);
    }
  };
  
  const handleStart = () => {
    if (voiceEnabled) {
      voiceService.speak(startMessage);
    }
    setTimeout(() => navigate('/menu'), 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4 sm:p-6">
      
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
      
      {/* Tarjeta principal */}
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-10 border-2 border-amber-200">
        
        <div className="text-center">
          
          {/* Logo */}
          <div className="mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 bg-gradient-to-br from-amber-400 to-orange-400 rounded-3xl mb-6 shadow-lg">
              <Music2 className="w-20 h-20 sm:w-24 sm:h-24 text-white" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-900 mb-4 leading-tight">
              Recuerdos con ritmo
            </h1>
            
            <p className="text-xl sm:text-2xl text-amber-700 leading-relaxed max-w-lg mx-auto">
              Practica, juega y disfruta a tu ritmo
            </p>
          </div>
          
          {/* Separador */}
          <div className="w-24 h-1 bg-amber-200 rounded-full mx-auto mb-8 sm:mb-10"></div>
          
          {/* Botón principal */}
          <div className="max-w-md mx-auto mb-8">
            <Button 
              onClick={handleStart}
              variant="primary"
              className="w-full py-6 text-2xl sm:text-3xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Comenzar
            </Button>
          </div>
          
          {/* Mensaje de bienvenida */}
          <div className="max-w-md mx-auto bg-amber-100/50 rounded-2xl p-5 border border-amber-200">
            <p className="text-lg sm:text-xl text-amber-800 leading-relaxed">
              Un espacio para disfrutar y recordar las canciones y refranes que amas
            </p>

            <div className="flex items-center justify-center gap-2 mt-3 text-amber-600">
              <Heart className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span className="text-base">Hecho con cariño para ti</span>
              <Heart className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          
        </div>
        
      </div>
      
    </div>
  );
}