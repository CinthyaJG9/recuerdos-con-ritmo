import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { voiceService } from '../app/data/voiceService';

interface VoiceContextType {
  voiceEnabled: boolean;
  toggleVoice: () => void;
  setVoiceEnabled: (enabled: boolean) => void;
  speak: (text: string, immediate?: boolean, isToggleMessage?: boolean) => Promise<void>;
  isToggling: boolean;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

interface VoiceProviderProps {
  children: ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  // Cargar preferencia guardada en localStorage
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem('voiceEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [isToggling, setIsToggling] = useState(false);
  const toggleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Guardar preferencia cuando cambie
  useEffect(() => {
    localStorage.setItem('voiceEnabled', String(voiceEnabled));
  }, [voiceEnabled]);

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    
    // Marcar que estamos en proceso de toggle
    setIsToggling(true);
    
    // Limpiar timeout anterior si existe
    if (toggleTimeoutRef.current) {
      clearTimeout(toggleTimeoutRef.current);
    }
    
    setVoiceEnabled(newState);
    
    // Si se está activando, reproducir mensaje
    if (newState) {
      voiceService.speak("Listo, ahora te hablaré para ayudarte.", true);
    } else {
      voiceService.speak("Está bien, ya no hablaré. Si me necesitas, solo presiona el botón otra vez.", true);
    }
    
    // Después de 2 segundos, permitir que otros mensajes se reproduzcan
    toggleTimeoutRef.current = setTimeout(() => {
      setIsToggling(false);
    }, 2000);
  };

  const speak = async (text: string, immediate: boolean = true, isToggleMessage: boolean = false) => {
    // Si estamos en proceso de toggle, no reproducir mensajes de bienvenida
    if (isToggling && !isToggleMessage) {
      console.log('Esperando a que termine el mensaje de toggle...');
      return;
    }
    
    if (voiceEnabled) {
      await voiceService.speak(text, immediate);
    }
  };

  return (
    <VoiceContext.Provider value={{ voiceEnabled, toggleVoice, setVoiceEnabled, speak, isToggling }}>
      {children}
    </VoiceContext.Provider>
  );
};
