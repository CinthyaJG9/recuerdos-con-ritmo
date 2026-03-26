import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';

export function VoiceButton() {
  const { voiceEnabled, toggleVoice } = useVoice();

  return (
    <button
      onClick={toggleVoice}
      className="fixed top-4 right-4 w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-all z-50 bg-amber-500 hover:bg-amber-600 text-white"
      aria-label={voiceEnabled ? "Desactivar voz" : "Activar voz"}
    >
      {voiceEnabled ? (
        <Volume2 className="w-6 h-6" />
      ) : (
        <VolumeX className="w-6 h-6" />
      )}
    </button>
  );
}