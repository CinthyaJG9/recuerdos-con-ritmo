class VoiceService {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  private isReady: boolean = false;
  
  constructor() {
    // Esperar a que Puter.js esté disponible
    this.waitForPuter();
  }
  
  private waitForPuter() {
    const checkPuter = setInterval(() => {
      if (typeof (window as any).puter !== 'undefined') {
        this.isReady = true;
        clearInterval(checkPuter);
        console.log('✅ VoiceService listo (Puter.js + Amazon Polly)');
      }
    }, 100);
  }
  
  async speak(text: string, immediate: boolean = true): Promise<void> {
    // Esperar a que Puter.js esté listo
    if (!this.isReady) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!this.isReady) {
        console.log('⚠️ Puter.js no disponible, usando fallback');
        this.fallbackSpeak(text);
        return;
      }
    }
    
    // Cancelar audio anterior
    if (immediate && this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    const puter = (window as any).puter;
    
    try {
      console.log('Generando voz con Amazon Polly (voz femenina mexicana)...');
      
      // Usar Amazon Polly con voz femenina en español
      // Opciones de voz en español: "Lucia" (femenina), "Mia" (femenina), "Lupe" (femenina mexicana)
      const audio = await puter.ai.txt2speech(text, {
        provider: "aws-polly",
        // En voiceService.ts, cambia el voice por:
        voice: "Lupe",      // Voz femenina mexicana
        language: "es-MX",   // Español de México
        engine: "neural"     // Calidad neuronal, suena natural
      });
      
      this.currentAudio = audio;
      
      return new Promise((resolve) => {
        audio.onended = () => {
          this.currentAudio = null;
          resolve();
        };
        audio.play().catch((e: Error) => {
          console.error('Error reproduciendo audio:', e);
          this.fallbackSpeak(text);
          resolve();
        });
      });
      
    } catch (error) {
      console.error('Error con Puter.js/Amazon Polly:', error);
      this.fallbackSpeak(text);
    }
  }
  
  // Fallback con voz femenina del navegador (si algo falla)
  private fallbackSpeak(text: string): void {
    try {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      utterance.volume = 0.9;
      
      // Buscar voz femenina en español
      const getFemaleSpanishVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(v => 
          v.lang.includes('es') && 
          (v.name.includes('Mujer') || 
           v.name.includes('Female') || 
           v.name.includes('Google') ||
           v.name.includes('Natural'))
        ) || voices.find(v => v.lang.includes('es'));
      };
      
      const warmVoice = getFemaleSpanishVoice();
      if (warmVoice) utterance.voice = warmVoice;
      
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Error en fallback de voz:', error);
    }
  }
  
  cancel(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    window.speechSynthesis.cancel();
  }
}

export const voiceService = new VoiceService();