import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Music2, Award, Clock, Home, Trophy, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';

export function SessionSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { track, correct, total, artist, gameType, voiceAlreadySpoken } = location.state || { 
    track: '', 
    artist: '', 
    correct: 0, 
    total: 0,
    gameType: 'complete',
    voiceAlreadySpoken: false
  };
  
  const { voiceEnabled, toggleVoice, speak , isToggling} = useVoice();
  const [hasSpoken, setHasSpoken] = useState(voiceAlreadySpoken);
  
  const percentage = Math.round((correct / total) * 100);
  
  const getMessage = () => {
    if (percentage === 100) {
      return {
        title: 'Excelente',
        subtitle: 'Conoces perfectamente esta canción',
        icon: Trophy,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      };
    } else if (percentage >= 80) {
      return {
        title: 'Muy bien',
        subtitle: 'Lo estás haciendo de maravilla',
        icon: Award,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    } else if (percentage >= 60) {
      return {
        title: 'Buen trabajo',
        subtitle: 'Cada práctica te ayuda a mejorar',
        icon: Sparkles,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    } else {
      return {
        title: 'Sigue practicando',
        subtitle: 'Cada intento cuenta, tú puedes',
        icon: Music2,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100'
      };
    }
  };
  
  const message = getMessage();
  const IconComponent = message.icon;
  
  // Mensajes de voz según resultado
  const getVoiceMessage = () => {
    if (percentage === 100) {
      return `Excelente. Conoces perfectamente "${track}". Qué bonito que la recuerdes. Sigue así.`;
    } else if (percentage >= 80) {
      return `Muy bien, lo estás haciendo de maravilla con "${track}". Cada vez la conoces mejor.`;
    } else if (percentage >= 60) {
      return `Buen trabajo con "${track}". Cada práctica te ayuda a mejorar. Sigue así.`;
    } else {
      return `No te preocupes por "${track}". Cada intento cuenta. Sigue practicando, tú puedes.`;
    }
  };
  
  // Mensaje al elegir otra canción
  const anotherSongMessage = "Muy bien, vamos a practicar otra canción. Elige la que más te guste.";
  
  // Mensaje al volver al menú
  const menuMessage = "De acuerdo, volvamos al menú principal. Elige el juego que prefieras.";
  
  // Mensaje de voz al cargar resultados - SOLO si no se ha hablado antes
  useEffect(() => {
    if (voiceEnabled && !hasSpoken && !isToggling) {
      const timer = setTimeout(() => {
        const voiceMessage = getVoiceMessage();
        speak(voiceMessage);
        setHasSpoken(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [voiceEnabled]);
  
  const handleAnotherSong = () => {
    speak(anotherSongMessage);
    setTimeout(() => navigate('/songs'), 1500);
  };
  
  const handleMenu = () => {
    speak(menuMessage);
    setTimeout(() => navigate('/menu'), 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      
      {/* Header mejorado */}
      <header className="sticky top-0 bg-white shadow-md border-b border-amber-200 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">
            Resultados
          </h1>
          
          <button
            onClick={() => navigate('/menu')}
            className="w-12 h-12 rounded-xl bg-amber-100 hover:bg-amber-200 transition-colors flex items-center justify-center"
            aria-label="Ir al menú principal"
          >
            <Home className="w-6 h-6 text-amber-800" />
          </button>
          
        </div>
      </header>
      
      {/* Contenido principal */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        
        {/* Mensaje de felicitación */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-28 h-28 ${message.bgColor} rounded-3xl mb-4 mx-auto shadow-lg`}>
            <IconComponent className={`w-16 h-16 ${message.color}`} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-3">
            {message.title}
          </h2>
          
          <p className="text-xl sm:text-2xl text-amber-700 leading-relaxed max-w-lg mx-auto">
            {message.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 border-2 border-amber-200">
          
          {/* Juego completado */}
          <div className="flex items-center gap-4 pb-6 border-b-2 border-amber-100 mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Music2 className="w-8 h-8 text-amber-700" />
            </div>
            <div className="flex-1">
              <p className="text-base text-amber-600 mb-1">Juego completado</p>
              <h3 className="text-2xl font-bold text-amber-900">
                {gameType === 'order' ? 'Ordenar la canción' : 'Completar la letra'}
              </h3>
              {track && <p className="text-lg text-amber-700 mt-1">Canción: {track}</p>}
              {artist && <p className="text-base text-amber-600">Artista: {artist}</p>}
            </div>
          </div>
          
          {/* Estadísticas en dos columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            
            {/* Aciertos */}
            <div className="bg-green-50 rounded-2xl p-6 text-center border-2 border-green-200">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-3 mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xl text-green-800 mb-1 font-medium">Aciertos</p>
              <p className="text-4xl font-bold text-green-700">
                {correct} <span className="text-2xl text-green-600">/ {total}</span>
              </p>
            </div>
            
            {/* Porcentaje */}
            <div className="bg-amber-50 rounded-2xl p-6 text-center border-2 border-amber-200">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-3 mx-auto">
                <Award className="w-10 h-10 text-amber-700" strokeWidth={1.5} />
              </div>
              <p className="text-xl text-amber-800 mb-1 font-medium">Progreso</p>
              <p className="text-4xl font-bold text-amber-700">
                {percentage}<span className="text-2xl text-amber-600">%</span>
              </p>
            </div>
            
          </div>
          
          {/* Tiempo y motivación */}
          <div className="bg-amber-100/50 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-7 h-7 text-amber-600" />
              <div>
                <p className="text-sm text-amber-700">Tiempo aproximado</p>
                <p className="text-xl font-bold text-amber-800">{Math.ceil(total * 0.5)} minutos</p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-amber-300 hidden sm:block"></div>
            
            <div className="text-center sm:text-right">
              <p className="text-sm text-amber-700">Rendimiento</p>
              <p className="text-xl font-bold text-amber-800">
                {correct} de {total} correctas
              </p>
            </div>
          </div>
          
        </div>
        
        {/* Mensaje motivador adicional (solo si no es 100%) */}
        {percentage < 100 && (
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
            <p className="text-xl text-blue-800 leading-relaxed text-center">
              "La práctica hace al maestro. Cada vez que practicas, 
              fortaleces tu memoria y disfrutas más de la música."
            </p>
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="space-y-4">
          
          <button
            onClick={handleAnotherSong}
            className="w-full py-5 bg-amber-600 hover:bg-amber-700 text-white text-2xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <Music2 className="w-7 h-7" />
            Practicar otra canción
          </button>
          
          <button
            onClick={handleMenu}
            className="w-full py-5 bg-white hover:bg-amber-50 text-amber-700 text-2xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-amber-300 flex items-center justify-center gap-3"
          >
            <Home className="w-7 h-7" />
            Ir al menú principal
          </button>
          
        </div>
        
      </main>
      
    </div>
  );
}
