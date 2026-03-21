// voiceService.ts

// Configuración - PON TU API KEY AQUÍ
const ELEVENLABS_API_KEY = 'sk_af6efff878a1c865c033cfaf1e6ec59d3733ba78941c53a5'; // Reemplaza con tu key

// Voz recomendada para adultos mayores (voz cálida y clara)
// 'EXAVITQu4TbD5V9L2rSg' - Antoni (masculina, muy cálida)
// '21m00Tcm4TlvDq8ikWAM' - Rachel (femenina, natural)
// 'AZnzlk1XvdvUeBnXmlld' - Bella (femenina, amigable)
const VOICE_ID = 'EXAVITQu4TbD5V9L2rSg'; // Antoni - voz muy cálida

class VoiceService {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  
  async speak(text: string): Promise<void> {
    // Si no hay API key configurada, usar fallback
    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'sk_af6efff878a1c865c033cfaf1e6ec59d3733ba78941c53a5') {
      console.log('No API key, usando fallback');
      this.fallbackSpeak(text);
      return;
    }
    
    // Cancelar audio anterior
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    try {
      console.log('🎤 Generando voz con ElevenLabs...');
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,          // Voz consistente pero natural
            similarity_boost: 0.75,   // Mantiene el carácter de la voz
            style: 0.2,              // Estilo conversacional, no teatral
            use_speaker_boost: true   // Mejora la claridad
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error ElevenLabs:', response.status, errorText);
        throw new Error(`ElevenLabs error: ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      this.currentAudio = new Audio(audioUrl);
      
      return new Promise((resolve) => {
        if (this.currentAudio) {
          this.currentAudio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            this.currentAudio = null;
            resolve();
          };
          this.currentAudio.play().catch(e => {
            console.error('Error reproduciendo audio:', e);
            this.fallbackSpeak(text);
            resolve();
          });
        }
      });
      
    } catch (error) {
      console.error('Error con ElevenLabs:', error);
      this.fallbackSpeak(text);
    }
  }
  
  // Fallback con Web Speech (voz del sistema)
  private fallbackSpeak(text: string): void {
    try {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 0.85;  // Más lento para adultos mayores
      utterance.pitch = 0.95;  // Tono cálido y grave
      utterance.volume = 0.9;
      
      // Intentar obtener una voz cálida
      const getWarmVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        
        // Priorizar voces en español mexicanas
        const mexicanVoice = voices.find(v => v.lang.includes('es-MX'));
        const spanishVoice = voices.find(v => v.lang.includes('es-ES') && v.name.includes('Google'));
        const anySpanishVoice = voices.find(v => v.lang.includes('es'));
        
        return mexicanVoice || spanishVoice || anySpanishVoice;
      };
      
      const warmVoice = getWarmVoice();
      if (warmVoice) utterance.voice = warmVoice;
      
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Error en fallback de voz:', error);
    }
  }
  
  // Cancelar cualquier voz en curso
  cancel(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    window.speechSynthesis.cancel();
  }
}

export const voiceService = new VoiceService();