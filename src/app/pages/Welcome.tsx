import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music2, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { HelpModal } from '../components/HelpModal';

export function Welcome() {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4 sm:p-6">
      
      {/* Tarjeta principal - más contraste y legibilidad */}
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-10 border-2 border-amber-200">
        
        <div className="text-center">
          
          {/* Logo más grande y con mejor contraste */}
          <div className="mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 bg-gradient-to-br from-amber-400 to-orange-400 rounded-3xl mb-6 shadow-lg">
              <Music2 className="w-20 h-20 sm:w-24 sm:h-24 text-white" strokeWidth={1.5} />
            </div>
            
            {/* Título más grande y con mejor contraste */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-900 mb-4 leading-tight">
              Recuerdos con ritmo
            </h1>
            
            {/* Subtítulo más legible */}
            <p className="text-xl sm:text-2xl text-amber-700 leading-relaxed max-w-lg mx-auto">
              Practica, juega y disfruta a tu ritmo
            </p>
          </div>
          
          {/* Separador visual sutil */}
          <div className="w-24 h-1 bg-amber-200 rounded-full mx-auto mb-8 sm:mb-10"></div>
          
          {/* Botón principal - más grande y visible */}
          <div className="max-w-md mx-auto mb-8">
            <Button 
              onClick={() => navigate('/menu')}
              variant="primary"
              className="w-full py-6 text-2xl sm:text-3xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Comenzar
            </Button>
          </div>
          
          {/* Mensaje de bienvenida - más legible */}
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