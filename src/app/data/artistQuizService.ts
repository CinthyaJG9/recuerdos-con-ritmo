// artistQuizService.ts

export interface ArtistQuestion {
  id: string;
  songTitle: string;
  correctArtist: string;
  options: string[];
  hint: string;
  decade: string;
  year?: string;
  language?: 'es' | 'en' | 'other';
}

const LATIN_ARTISTS = [
  'Juan Gabriel', 'José José', 'Vicente Fernández', 'Luis Miguel',
  'Ana Gabriel', 'Emmanuel', 'Mijares', 'José Alfredo Jiménez',
  'Javier Solís', 'Lola Beltrán', 'Pedro Infante', 'Los Panchos',
  'Rocío Dúrcal', 'Camilo Sesto', 'José Luis Perales', 'Los Bukis',
  'Marco Antonio Solís', 'Los Yonics', 'Rigo Tovar', 'Los Ángeles Negros',
  'Timbiriche', 'Flans', 'Magneto', 'Los Tigres del Norte',
  'Julio Iglesias', 'Raphael', 'Nino Bravo', 'Celia Cruz',
  'Juan Luis Guerra', 'Gloria Estefan', 'Chayanne'
];

const ANGLO_ARTISTS = [
  'The Beatles', 'Elvis Presley', 'Queen', 'Michael Jackson',
  'Madonna', 'ABBA', 'Bee Gees', 'Elton John',
  'Frank Sinatra', 'Johnny Cash', 'The Rolling Stones', 'Whitney Houston'
];

// --- UTILIDADES ---

const hasNonLatinChars = (text: string): boolean => {
  if (!text) return false;
  // Filtro estricto: solo letras latinas, acentos, espacios y puntuación básica
  const nonLatinRegex = /[^\u0000-\u024F\u1E00-\u1EFF\s\.,!?;:()\-]/;
  return nonLatinRegex.test(text);
};

const generateOptions = (correctArtist: string, isLatin: boolean): string[] => {
  const pool = isLatin ? LATIN_ARTISTS : [...LATIN_ARTISTS, ...ANGLO_ARTISTS];
  const filtered = pool.filter(a => a.toLowerCase() !== correctArtist.toLowerCase());
  const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
  return [correctArtist, ...shuffled].sort(() => 0.5 - Math.random());
};

// --- FUNCIÓN PRINCIPAL CON ITUNES API ---

export async function generateArtistQuestions(count: number = 5): Promise<ArtistQuestion[]> {
  const questions: ArtistQuestion[] = [];
  const usedTracks = new Set<string>();
  
  // Mezclamos artistas
  const allArtists = [...LATIN_ARTISTS, ...ANGLO_ARTISTS].sort(() => 0.5 - Math.random());

  console.log('🍎 Usando iTunes API (Modo Rápido)');

  for (const artistName of allArtists) {
    if (questions.length >= count) break;

    try {
      // Buscamos canciones del artista en la tienda de México
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=15&country=mx`
      );
      const data = await response.json();
      const tracks = data.results || [];

      // Mezclamos las canciones obtenidas
      const shuffledTracks = tracks.sort(() => 0.5 - Math.random());

      for (const track of shuffledTracks) {
        if (questions.length >= count) break;

        const title = track.trackName;
        const releaseDate = track.releaseDate; // Formato: "1970-03-25T08:00:00Z"
        
        if (!title || !releaseDate || hasNonLatinChars(title)) continue;
        if (usedTracks.has(title.toLowerCase())) continue;

        const year = parseInt(releaseDate.substring(0, 4));

        // FILTRO DE DÉCADAS (60s, 70s, 80s)
        let decade = "";
        if (year >= 1960 && year <= 1969) decade = "60s";
        else if (year >= 1970 && year <= 1979) decade = "70s";
        else if (year >= 1980 && year <= 1989) decade = "80s";

        // Si la canción es de la década correcta, la agregamos
        if (decade) {
          const isLatin = LATIN_ARTISTS.includes(artistName);
          questions.push({
            id: crypto.randomUUID(),
            songTitle: title,
            correctArtist: artistName,
            options: generateOptions(artistName, isLatin),
            hint: `Éxito de ${year}`,
            decade: decade,
            year: year.toString(),
            language: isLatin ? 'es' : 'en'
          });
          
          usedTracks.add(title.toLowerCase());
          console.log(`✅ Agregada: ${title} (${year}) de ${artistName}`);
          break; // Una canción por artista para máxima variedad
        }
      }
    } catch (error) {
      console.error(`Error con el artista ${artistName}:`, error);
    }
  }

  // Si falló internet, devolvemos los de muestra
  if (questions.length === 0) return getSampleArtistQuestions();

  return questions.sort(() => 0.5 - Math.random());
}

export const getSampleArtistQuestions = (): ArtistQuestion[] => [
  { id: "s1", songTitle: "El Triste", correctArtist: "José José", options: ["José José", "Juan Gabriel", "Camilo Sesto", "Mijares"], hint: "1970", decade: "70s", year: "1970", language: 'es' },
  { id: "s2", songTitle: "Hey Jude", correctArtist: "The Beatles", options: ["The Beatles", "Queen", "Elvis Presley", "ABBA"], hint: "1968", decade: "60s", year: "1968", language: 'en' }
];