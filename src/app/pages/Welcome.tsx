import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Music2 } from 'lucide-react';
import { Button } from '../components/Button';
import { HelpModal } from '../components/HelpModal';

export function Welcome() {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo y título */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-wine/10 rounded-3xl mb-6">
            <Music2 className="w-16 h-16 text-wine" strokeWidth={2} />
          </div>
          
          <h1 className="text-[48px] mb-4 text-wine leading-tight">
            Recuerdos con ritmo
          </h1>
          
          <p className="text-[24px] text-warm-gray leading-relaxed max-w-lg mx-auto">
            Practica, juega y disfruta a tu ritmo
          </p>
        </div>
        
        {/* Decoración sutil de notas musicales 
        <div className="mb-12 opacity-20">
          <svg className="mx-auto w-64 h-16" viewBox="0 0 256 64" fill="none">
            <path 
              d="M20 40 Q 30 20, 40 40 T 60 40 T 80 40" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              className="text-wine"
            />
            <circle cx="45" cy="32" r="4" fill="currentColor" className="text-wine" />
            <circle cx="75" cy="36" r="4" fill="currentColor" className="text-wine" />
            <path 
              d="M45 32 L 45 20" 
              stroke="currentColor" 
              strokeWidth="2"
              className="text-wine"
            />
            <path 
              d="M75 36 L 75 24" 
              stroke="currentColor" 
              strokeWidth="2"
              className="text-wine"
            />
          </svg>
        </div>*/}
        
        {/* Botón principal */}
        <div className="max-w-md mx-auto mb-8">
          <Button 
            onClick={() => navigate('/menu')}
            variant="primary"
            className="w-full"
          >
            Comenzar
          </Button>
        </div>
        
        {/* Mensaje de bienvenida */}
        <p className="text-[18px] text-warm-gray-light leading-relaxed max-w-md mx-auto">
          Un espacio para disfrutar y recordar las canciones y refranes que amas
        </p>
      </div>
      
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
    </div>
  );
}