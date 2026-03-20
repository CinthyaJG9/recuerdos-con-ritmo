export interface HintRequest {
  gameType: 'complete' | 'order' | 'artist';
  songTitle?: string;
  artist?: string;
  missingWord?: string;
  options?: string[];
  currentHint?: string;
  userProgress?: {
    correctAnswers: number;
    totalQuestions: number;
  };
}

export interface HintResponse {
  hint: string;
  type: 'general' | 'specific' | 'encouragement';
  confidence: number;
}

class HintService {
  private ollamaUrl = 'http://localhost:11434/api/generate';
  private model = 'gemma2:2b'; 
  
  // Generar pista para completar letra
  async getCompleteLyricsHint(
    songTitle: string,
    artist: string,
    missingWord: string,
    options: string[],
    currentHint?: string
  ): Promise<HintResponse> {
    const prompt = this.buildCompleteLyricsPrompt(
      songTitle, artist, missingWord, options, currentHint
    );
    
    return this.generateHint(prompt);
  }
  
  // Generar pista para ordenar versos
  async getOrderHint(
    songTitle: string,
    artist: string,
    verses: string[],
    currentOrder: number[],
    totalVerses: number
  ): Promise<HintResponse> {
    const prompt = this.buildOrderPrompt(
      songTitle, artist, verses, currentOrder, totalVerses
    );
    
    return this.generateHint(prompt);
  }
  
async getArtistHint(
  songTitle: string,
  options: string[],
  correctArtist: string, 
  decade?: string,
  year?: string
): Promise<HintResponse> {
  // --- LÓGICA DE EXTRACCIÓN REAL (Cero alucinaciones) ---
  const firstLetter = correctArtist.trim().charAt(0).toUpperCase();
  const wordCount = correctArtist.split(' ').length;
  const isPlural = correctArtist.toLowerCase().includes('los ') || 
                   correctArtist.toLowerCase().includes('las ') || 
                   correctArtist.endsWith('s');

  // --- LLAMADA A IA RESTRINGIDA ---
  const prompt = `Analiza al artista musical: "${correctArtist}".
Tarea: Responde SOLO con el género (Hombre, Mujer, Grupo o Dúo).
Respuesta:`;

  let genderHint = await this.ollamaRequest(prompt);
  
  // Limpieza básica por si la IA escribe de más
  if (genderHint.toLowerCase().includes('mujer')) genderHint = "una mujer";
  else if (genderHint.toLowerCase().includes('hombre')) genderHint = "un hombre";
  else if (genderHint.toLowerCase().includes('grupo') || isPlural) genderHint = "un grupo";
  else genderHint = "un artista";

  // --- CONSTRUCCIÓN DE LA PISTA FINAL ---
  const finalHint = `Se trata de ${genderHint}. Su nombre empieza con la letra "${firstLetter}" y tiene ${wordCount} ${wordCount === 1 ? 'palabra' : 'palabras'}.`;

  return {
    hint: finalHint,
    type: 'specific',
    confidence: 1.0
  };
}
  
  // Mensaje de ánimo personalizado
  async getEncouragement(
    correctCount: number,
    totalCount: number
  ): Promise<HintResponse> {
    const percentage = Math.round((correctCount / totalCount) * 100);
    
    const prompt = `Eres un asistente amable para personas mayores. 
    Genera un mensaje de ánimo cálido y motivador para alguien que ha respondido 
    correctamente ${correctCount} de ${totalCount} preguntas (${percentage}%).
    El mensaje debe ser corto (máximo 2 líneas), positivo y alentador.
    Responde SOLO con el mensaje, sin explicaciones.`;
    
    const response = await this.ollamaRequest(prompt);
    
    return {
      hint: response,
      type: 'encouragement',
      confidence: 0.9
    };
  }
  
  // Construir prompt para completar letra
  private buildCompleteLyricsPrompt(
    songTitle: string,
    artist: string,
    missingWord: string,
    options: string[],
    currentHint?: string
  ): string {
    return `Eres un asistente amable para personas mayores jugando un juego de "Completar la letra".
    
    Canción: "${songTitle}" de ${artist}
    La palabra que falta es: "${missingWord}"
    Opciones disponibles: ${options.join(', ')}
    
    ${currentHint ? `La pista actual es: "${currentHint}". Necesito una pista diferente.` : ''}
    
    Genera UNA pista útil pero no demasiado obvia que ayude a recordar esta palabra.
    La pista debe ser:
    - Corta (máximo 10 palabras)
    - En español, cálida y amigable
    - Puede referirse al significado, al contexto en la canción, o a la longitud
    
    Ejemplos de buenas pistas:
    - "Esta palabra aparece en el estribillo"
    - "Tiene 5 letras y es un sentimiento"
    - "La canta cuando habla del amor"
    
    Responde SOLO con la pista, sin explicaciones.`;
  }
  
  // Construir prompt para ordenar versos
  private buildOrderPrompt(
    songTitle: string,
    artist: string,
    verses: string[],
    currentOrder: number[],
    totalVerses: number
  ): string {
    return `Eres un asistente amable para personas mayores jugando un juego de "Ordenar la canción".
    
    Canción: "${songTitle}" de ${artist}
    Tienen que ordenar ${totalVerses} versos.
    Ya han colocado ${currentOrder.length} versos correctamente.
    
    Genera UNA pista útil que ayude a determinar qué verso va después en la canción.
    La pista debe ser:
    - Corta (máximo 10 palabras)
    - En español, cálida y amigable
    - Puede referirse a la rima, al significado, o a cómo fluye la historia
    
    Ejemplos:
    - "El siguiente verso termina en 'ón'"
    - "Habla de lo que siente después de verla"
    - "Es el que tiene la palabra 'cielo'"
    
    Responde SOLO con la pista, sin explicaciones.`;
  }
  
private buildArtistPrompt(
  songTitle: string, 
  options: string[], 
  correctArtist: string,
  decade?: string,
  year?: string
): string {
  return `Instrucción: Escribe un dato biográfico breve de "${correctArtist}".
Reglas prohibidas:
- NO digas el nombre "${correctArtist}".
- NO menciones la canción "${songTitle}".
- NO menciones a Michael Jackson si no es el artista.
- Responde en 8 palabras máximo.

Dato biográfico:`;
}
  
  // Generar pista a partir de un prompt
  private async generateHint(prompt: string): Promise<HintResponse> {
    const hint = await this.ollamaRequest(prompt);
    return {
      hint: hint,
      type: 'specific',
      confidence: 0.85
    };
  }

  // Hacer petición a Ollama
  private async ollamaRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.1,
            max_tokens: 40,
            top_p: 0.8
          }
        })
      });
      
      if (!response.ok) {
        console.error('Error en Ollama:', response.status);
        return this.getFallbackHint();
      }
      
      const data = await response.json();
      return data.response.trim();
    } catch (error) {
      console.error('Error conectando con Ollama:', error);
      return this.getFallbackHint();
    }
  }
  
  // Pistas de respaldo (cuando Ollama no está disponible)
  private getFallbackHint(): string {
    const fallbacks = [
      "Piensa en el contexto de la canción",
      "¿Recuerdas cómo sigue esta parte?",
      "Escúchala en tu mente, la palabra llegará",
      "A veces la respuesta está en el estribillo",
      "Confía en tu memoria musical"
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export const hintService = new HintService();