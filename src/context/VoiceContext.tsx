import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { voiceService } from '../app/data/voiceService';

interface VoiceContextType {
  voiceEnabled: boolean;
  toggleVoice: () => void;
  setVoiceEnabled: (enabled: boolean) => void;
  speak: (text: string, immediate?: boolean) => Promise<void>;
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

  // Guardar preferencia cuando cambie
  useEffect(() => {
    localStorage.setItem('voiceEnabled', String(voiceEnabled));
  }, [voiceEnabled]);

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    if (newState) {
      voiceService.speak("Listo, ahora te hablaré para ayudarte.", true);
    } else {
      voiceService.speak("Está bien, ya no hablaré. Si me necesitas, solo presiona el botón otra vez.", true);
    }
  };

  const speak = async (text: string, immediate: boolean = true) => {
    if (voiceEnabled) {
      await voiceService.speak(text, immediate);
    }
  };

  return (
    <VoiceContext.Provider value={{ voiceEnabled, toggleVoice, setVoiceEnabled, speak }}>
      {children}
    </VoiceContext.Provider>
  );
};