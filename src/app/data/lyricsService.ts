export interface LyricsData {
  lyrics: string;
  syncedLyrics?: string;
  trackName: string;
  artistName: string;
  albumName?: string;
  duration?: number;
}

/**
 * Limpia el título de la canción de añadidos de plataformas como Spotify
 * Ej: "Cucurrucucú paloma - Remastered" -> "Cucurrucucú paloma"
 */
const cleanTrackTitle = (title: string): string => {
  return title
    .replace(/\s*[-/(].*$/g, '') // Elimina todo después de " -", "(" o "/"
    .trim();
};

/**
 * Normaliza texto eliminando tildes y caracteres especiales para búsquedas
 */
const normalizeText = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

export async function fetchLyrics(artist: string, track: string): Promise<LyricsData | null> {
  const cleanedTrack = cleanTrackTitle(track);
  
  try {
    // INTENTO 1: Obtención directa (exacta)
    // Usamos los nombres originales pero codificados para URL
    const directUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(cleanedTrack)}`;
    const response = await fetch(directUrl);

    if (response.ok) {
      const data = await response.json();
      if (data.plainLyrics || data.syncedLyrics) {
        return {
          lyrics: data.plainLyrics || data.syncedLyrics || '',
          syncedLyrics: data.syncedLyrics,
          trackName: data.trackName,
          artistName: data.artistName,
          albumName: data.albumName,
          duration: data.duration
        };
      }
    }

    // INTENTO 2: Búsqueda difusa (si el directo dio 404 o no tenía letra)
    // El endpoint /search es mucho más "inteligente" con errores ortográficos
    const searchQuery = `${normalizeText(artist)} ${normalizeText(cleanedTrack)}`;
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(searchQuery)}`;
    
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return null;

    const results = await searchRes.json();
    
    // Filtramos el mejor resultado (que tenga letra)
    const bestMatch = results.find((r: any) => r.plainLyrics || r.syncedLyrics);

    if (bestMatch) {
      return {
        lyrics: bestMatch.plainLyrics || bestMatch.syncedLyrics || '',
        syncedLyrics: bestMatch.syncedLyrics,
        trackName: bestMatch.trackName,
        artistName: bestMatch.artistName,
        albumName: bestMatch.albumName,
        duration: bestMatch.duration
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
}

/**
 * Procesa la letra para generar preguntas del juego
 */
export function processLyricsForGame(lyrics: string) {
  if (!lyrics) return [];
  
  // Limpiar etiquetas de tiempo [00:12.34] si vienen en la letra
  const cleanLyrics = lyrics.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '');

  const lines = cleanLyrics.split('\n')
    .map(line => line.trim())
    .filter(line => 
      line.length > 8 && 
      !line.includes('[') && 
      !line.match(/^[0-9]+$/) && 
      line.split(' ').length >= 3
    );
  
  const gameLines = lines.slice(0, 15);
  const questions = [];
  const commonWords = ['amor', 'corazón', 'vida', 'noche', 'siempre', 'siento', 'cielo', 'mundo'];
  
  for (const line of gameLines) {
    // Extraemos palabras limpias de puntuación para la respuesta correcta
    const words = line.replace(/[.,!?;:()]/g, '').split(' ').filter(w => w.length > 2);
    if (words.length < 3) continue;
    
    const wordIndex = Math.floor(Math.random() * words.length);
    const missingWord = words[wordIndex];
    
    // Creamos el fragmento ocultando la palabra exacta sin importar mayúsculas
    const regex = new RegExp(`\\b${missingWord}\\b`, 'i');
    const fragment = line.replace(regex, '__________');
    
    // Si la sustitución no funcionó (raro), saltamos
    if (!fragment.includes('__________')) continue;

    const options = [missingWord];
    
    // Palabras de otras líneas para despistar
    const otherWords = gameLines
      .flatMap(l => l.replace(/[.,!?;:()]/g, '').split(' '))
      .filter(w => w.length >= 3 && w.toLowerCase() !== missingWord.toLowerCase());

    while (options.length < 4) {
      const source = Math.random() > 0.4 ? otherWords : commonWords;
      const randomWord = source[Math.floor(Math.random() * source.length)];
      
      if (!options.map(o => o.toLowerCase()).includes(randomWord.toLowerCase())) {
        options.push(randomWord);
      }
      
      // Seguridad para evitar bucles infinitos si hay pocas palabras
      if (options.length >= 4 || (otherWords.length < 5 && options.length >= 2)) break;
    }

    questions.push({
      fragment,
      missing: missingWord,
      options: options.sort(() => Math.random() - 0.5),
      hint: `Palabra de ${missingWord.length} letras`,
      originalLine: line
    });
    
    if (questions.length >= 5) break;
  }
  
  return questions;
}