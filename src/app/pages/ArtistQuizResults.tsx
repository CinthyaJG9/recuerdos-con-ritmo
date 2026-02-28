import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Mic2, Award, Home } from 'lucide-react';
import { Button } from '../components/Button';

export function ArtistQuizResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { correct, total } = location.state || { correct: 0, total: 0 };
  
  const percentage = Math.round((correct / total) * 100);
  
  const getMessage = () => {
    if (percentage === 100) {
      return '¡Increíble! Conoces muy bien a todos los artistas';
    } else if (percentage >= 80) {
      return '¡Excelente memoria musical! Lo hiciste muy bien';
    } else if (percentage >= 60) {
      return '¡Buen trabajo! Conoces muchas de estas canciones';
    } else if (percentage >= 40) {
      return '¡Bien hecho! Cada juego te ayuda a recordar más';
    } else {
      return 'Sigue jugando, es una linda forma de recordar';
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card shadow-sm border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <h1 className="text-[28px] text-warm-black">
            Resultados
          </h1>
          
          <button
            onClick={() => navigate('/menu')}
            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-warm-beige-dark transition-colors"
            aria-label="Ir al menú"
          >
            <Home className="w-7 h-7 text-wine" strokeWidth={2} />
          </button>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-deep-blue/10 rounded-3xl mb-6">
            <Award className="w-16 h-16 text-deep-blue" strokeWidth={2} />
          </div>
          
          <h2 className="text-[40px] mb-4 text-deep-blue">
            ¡Felicidades!
          </h2>
          
          <p className="text-[24px] text-warm-gray leading-relaxed">
            {getMessage()}
          </p>
        </div>
        
        {/* Tarjeta de resultados */}
        <div className="bg-card rounded-2xl p-8 shadow-xl mb-8">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-warm-beige-dark">
            <Mic2 className="w-8 h-8 text-deep-blue flex-shrink-0" strokeWidth={2} />
            <div>
              <p className="text-[18px] text-warm-gray mb-1">Juego completado</p>
              <p className="text-[24px] text-warm-black">¿Quién cantaba esta canción?</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Aciertos */}
            <div className="bg-olive-green/10 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-olive-green/20 rounded-full mb-4">
                <svg className="w-9 h-9 text-olive-green-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[18px] text-olive-green-dark mb-2">Respuestas correctas</p>
              <p className="text-[36px] text-olive-green-dark">
                {correct} <span className="text-[24px]">de {total}</span>
              </p>
            </div>
            
            {/* Porcentaje */}
            <div className="bg-deep-blue/10 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-deep-blue/20 rounded-full mb-4">
                <Award className="w-9 h-9 text-deep-blue-dark" strokeWidth={2} />
              </div>
              <p className="text-[18px] text-deep-blue-dark mb-2">Tu resultado</p>
              <p className="text-[36px] text-deep-blue-dark">
                {percentage}<span className="text-[24px]">%</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Mensaje motivador adicional */}
        <div className="bg-deep-blue/10 rounded-xl p-6 mb-8 text-center">
          <p className="text-[20px] text-deep-blue-dark leading-relaxed">
            Cada canción tiene su historia. Recordar quién la cantaba es mantener viva la música que tanto disfrutamos.
          </p>
        </div>
        
        {/* Botones de acción */}
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/artist-quiz/play')}
            variant="secondary"
            className="w-full"
          >
            Jugar otra vez
          </Button>
          
          <Button 
            onClick={() => navigate('/menu')}
            variant="outline"
            className="w-full"
          >
            Elegir otro juego
          </Button>
        </div>
      </div>
    </div>
  );
}
