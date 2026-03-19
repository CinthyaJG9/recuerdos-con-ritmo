import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic2, Award, Home, ArrowLeft, Trophy, Sparkles, Heart } from 'lucide-react';

export function ArtistQuizResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { correct, total } = location.state || { correct: 0, total: 0 };
  
  const percentage = Math.round((correct / total) * 100);
  
  const getMessage = () => {
    if (percentage === 100) {
      return {
        title: '¡Increíble!',
        subtitle: 'Conoces muy bien a todos los artistas',
        icon: Trophy,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      };
    } else if (percentage >= 80) {
      return {
        title: '¡Excelente!',
        subtitle: 'Memoria musical perfecta',
        icon: Award,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    } else if (percentage >= 60) {
      return {
        title: '¡Muy bien!',
        subtitle: 'Conoces muchas de estas canciones',
        icon: Sparkles,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    } else if (percentage >= 40) {
      return {
        title: '¡Buen trabajo!',
        subtitle: 'Cada juego te ayuda a recordar más',
        icon: Mic2,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      };
    } else {
      return {
        title: '¡Sigue así!',
        subtitle: 'Es una linda forma de recordar',
        icon: Heart,
        color: 'text-pink-600',
        bgColor: 'bg-pink-100'
      };
    }
  };
  
  const message = getMessage();
  const IconComponent = message.icon;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      
      {/* Header mejorado */}
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
              Resultados
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
        
        {/* Tarjeta de resultados */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 border-2 border-amber-200">
          
          {/* Juego completado */}
          <div className="flex items-center gap-4 pb-6 border-b-2 border-amber-100 mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mic2 className="w-8 h-8 text-purple-700" />
            </div>
            <div className="flex-1">
              <p className="text-base text-amber-600 mb-1">Juego completado</p>
              <h3 className="text-2xl font-bold text-amber-900">¿Quién cantaba esta canción?</h3>
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
              <p className="text-xl text-green-800 mb-1 font-medium">Respuestas correctas</p>
              <p className="text-4xl font-bold text-green-700">
                {correct} <span className="text-2xl text-green-600">de {total}</span>
              </p>
            </div>
            
            {/* Porcentaje */}
            <div className="bg-purple-50 rounded-2xl p-6 text-center border-2 border-purple-200">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-3 mx-auto">
                <Award className="w-10 h-10 text-purple-700" strokeWidth={1.5} />
              </div>
              <p className="text-xl text-purple-800 mb-1 font-medium">Tu resultado</p>
              <p className="text-4xl font-bold text-purple-700">
                {percentage}<span className="text-2xl text-purple-600">%</span>
              </p>
            </div>
            
          </div>
          
          {/* Mensaje motivador según resultado */}
          <div className={`${message.bgColor} rounded-xl p-5 text-center`}>
            <p className={`text-lg ${message.color} font-medium`}>
              {percentage === 100 && "¡Eres un experto en música!"}
              {percentage >= 80 && percentage < 100 && "¡Casi perfecto! Tienes muy buena memoria musical."}
              {percentage >= 60 && percentage < 80 && "Buen trabajo, reconoces muchas canciones clásicas."}
              {percentage >= 40 && percentage < 60 && "Sigue practicando, cada canción tiene su historia."}
              {percentage < 40 && "Cada intento cuenta. Los grandes artistas nunca se olvidan."}
            </p>
          </div>
          
        </div>
        
        {/* Mensaje cultural */}
        <div className="bg-amber-100/50 rounded-2xl p-6 mb-8 border border-amber-200">
          <div className="flex items-start gap-4">
            <Heart className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xl text-amber-800 leading-relaxed">
                "La música es el lenguaje universal de la humanidad. Recordar a los artistas 
                es mantener vivo su legado y las emociones que nos regalaron."
              </p>
              <p className="text-lg text-amber-600 text-right mt-3">
                — La música nos une
              </p>
            </div>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="space-y-4">
          
          <button
            onClick={() => navigate('/artist-quiz/play')}
            className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white text-2xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <Mic2 className="w-7 h-7" />
            Jugar otra vez
          </button>
          
          <button
            onClick={() => navigate('/menu')}
            className="w-full py-6 bg-white hover:bg-amber-50 text-amber-700 text-2xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-amber-300 flex items-center justify-center gap-3"
          >
            <Home className="w-7 h-7" />
            Elegir otro juego
          </button>
          
        </div>
        
        {/* Nota al pie */}
        <p className="text-center text-amber-500 text-lg mt-6">
          ¿Quién cantaba estas canciones? ¡Sigue descubriendo más!
        </p>
        
      </main>
      
    </div>
  );
}