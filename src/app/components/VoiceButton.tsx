import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';

export function VoiceButton() {
  const { voiceEnabled, toggleVoice } = useVoice();

  return (
    <button
      onClick={toggleVoice}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-50 ${
        voiceEnabled
          ? 'bg-amber-500 hover:bg-amber-600 text-white'
          : 'bg-gray-300 hover:bg-gray-400 text-gray-600'
      }`}
      aria-label={voiceEnabled ? "Desactivar voz" : "Activar voz"}
    >
      {voiceEnabled ? (
        <Volume2 className="w-7 h-7" />
      ) : (
        <VolumeX className="w-7 h-7" />
      )}
    </button>
  );
}