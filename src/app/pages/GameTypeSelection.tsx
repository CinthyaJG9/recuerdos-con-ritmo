import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, Loader2, AlertCircle, Pause, Shuffle, Music } from 'lucide-react';
import { fetchLyrics, processLyricsForGame, processOrderGame } from '../data/lyricsService';

export function GameTypeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGame, setSelectedGame] = useState<'complete' | 'order' | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = location.state?.track;
  
  // Inicializar audio
  useEffect(() => {
    if (track?.preview_url && !audioRef.current) {
      audioRef.current = new Audio(track.preview_url);
      audioRef.current.loop = false;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [track]);
  
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.error('Error al reproducir:', e));
      }
    }
  };
  
  if (!track) {
    navigate('/songs');
    return null;
  }

  const handleCompleteLyrics = async () => {
    setSelectedGame('complete');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🎵 Cargando juego de completar para:', track.artist, '-', track.title);
      
      if (!track.artist || !track.title) {
        throw new Error('Datos de la canción incompletos');
      }
      
      const lyricsData = await fetchLyrics(track.artist, track.title);
      
      if (!lyricsData) {
        setError('No se encontraron letras para esta canción');
        setIsLoading(false);
        setSelectedGame(null);
        return;
      }
      
      if (!lyricsData.lyrics || lyricsData.lyrics.trim() === '') {
        setError('La letra de esta canción no está disponible');
        setIsLoading(false);
        setSelectedGame(null);
        return;
      }
      
      const gameQuestions = processLyricsForGame(lyricsData.lyrics);
      
      if (!gameQuestions || gameQuestions.length === 0) {
        setError('No se pudo generar el juego para esta canción');
        setIsLoading(false);
        setSelectedGame(null);
        return;
      }
      
      // Pausar audio antes de navegar
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      
navigate(`/game/${track.id}/complete`, {
  state: {
    track: {
      title: track.title,
      artist: track.artist,
      id: track.id,
      image: track.image
    },
    questions: gameQuestions,
    gameType: 'complete'
  }
});
      
    } catch (err) {
      console.error('Error completo:', err);
      setError('Error al cargar la canción. Intenta con otra.');
      setSelectedGame(null);
    } finally {
      setIsLoading(false);
    }
  };

const handleOrderGame = async () => {
  setSelectedGame('order');
  setIsLoading(true);
  setError(null);
  
  try {
    console.log('🎵 Cargando juego de ordenar para:', track.artist, '-', track.title);
    
    if (!track.artist || !track.title) {
      throw new Error('Datos de la canción incompletos');
    }
    
    const lyricsData = await fetchLyrics(track.artist, track.title);
    
    if (!lyricsData) {
      setError('No se encontraron letras para esta canción');
      setIsLoading(false);
      setSelectedGame(null);
      return;
    }
    
    if (!lyricsData.lyrics || lyricsData.lyrics.trim() === '') {
      setError('La letra de esta canción no está disponible');
      setIsLoading(false);
      setSelectedGame(null);
      return;
    }
    
    console.log('✅ Letra obtenida, longitud:', lyricsData.lyrics.length);
    
    const orderQuestions = processOrderGame(lyricsData.lyrics);
    
    console.log('📊 Preguntas de ordenar generadas:', orderQuestions);
    
    if (!orderQuestions || orderQuestions.length === 0) {
      setError('No se pudo generar el juego de ordenar para esta canción');
      setIsLoading(false);
      setSelectedGame(null);
      return;
    }
    
    // Verificar que las preguntas tienen la estructura correcta
    const isValidQuestions = orderQuestions.every(q => 
      q && 
      Array.isArray(q.verses) && 
      q.verses.length > 0 &&
      Array.isArray(q.correctOrder) &&
      q.correctOrder.length > 0
    );
    
    if (!isValidQuestions) {
      setError('Error al procesar las preguntas');
      setIsLoading(false);
      setSelectedGame(null);
      return;
    }
    
    // Pausar audio antes de navegar
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    console.log('🎯 Navegando a OrderGame con', orderQuestions.length, 'rondas');
    console.log('📍 Datos a enviar:', {
      track: {
        title: track.title,
        artist: track.artist,
        id: track.id,
        image: track.image
      },
      questionsCount: orderQuestions.length,
      primeraRonda: orderQuestions[0]
    });
    
navigate(`/game/${track.id}/order`, {
  state: {
    track: {
      title: track.title,
      artist: track.artist,
      id: track.id,
      image: track.image
    },
    questions: orderQuestions,
    gameType: 'order'
  }
});
    
  } catch (err) {
    console.error('Error completo:', err);
    setError('Error al cargar la canción. Intenta con otra.');
    setSelectedGame(null);
  } finally {
    setIsLoading(false);
  }
};
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md border-b border-amber-200 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/songs')}
            className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-6 h-6 text-amber-800" />
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Info de la canción */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8 text-center">
          {track.image && (
            <img 
              src={track.image} 
              alt={track.title}
              className="w-40 h-40 rounded-2xl shadow-xl mx-auto mb-6"
            />
          )}
          
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            {track.title}
          </h1>
          <p className="text-2xl text-amber-700 mb-4">
            {track.artist}
          </p>
        </div>
        
        {/* REPRODUCTOR INTELIGENTE */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg mb-8 border-2 border-amber-300">
          <p className="text-xl sm:text-2xl text-amber-800 mb-4 font-semibold text-center">
            🎵 Escucha la canción
          </p>

          {track.preview_url ? (
            <div className="flex flex-col items-center gap-4">
              <audio
                controls
                src={track.preview_url}
                className="w-full max-w-md h-12"
              >
                Tu navegador no soporta el audio.
              </audio>
              <p className="text-sm text-amber-600">
                Fragmento de 30 segundos cortesía de Spotify
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <a
                href={track.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1DB954] hover:bg-[#1ed760] text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <Play className="w-6 h-6" />
                Abrir en Spotify
              </a>
              <p className="text-sm text-amber-500">
                La canción se abrirá en una nueva pestaña. ¡Solo tienes que volver a esta página para jugar!
              </p>
            </div>
          )}
        </div>
        
        {/* Error */}
        {error && (
          <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-6 mb-8">
            <p className="text-xl text-red-800">{error}</p>
          </div>
        )}
        
        {/* OPCIONES DE JUEGO - Dos botones grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Juego 1: Completar la letra */}
          <button
            onClick={handleCompleteLyrics}
            disabled={isLoading && selectedGame === 'complete'}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-amber-200 hover:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-left"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                <Music className="w-10 h-10 text-amber-700" />
              </div>
              
              <h2 className="text-2xl font-bold text-amber-900 mb-2">
                Completar la letra
              </h2>
              
              <p className="text-lg text-amber-700 mb-4">
                Elige la palabra que falta
              </p>
              
              {isLoading && selectedGame === 'complete' ? (
                <Loader2 className="animate-spin w-8 h-8 text-amber-600" />
              ) : (
                <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-xl text-base">
                  Nivel: Fácil
                </span>
              )}
            </div>
          </button>
          
          {/* Juego 2: Ordenar la canción (NUEVO) */}
          <button
            onClick={handleOrderGame}
            disabled={isLoading && selectedGame === 'order'}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-purple-200 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-left"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <Shuffle className="w-10 h-10 text-purple-700" />
              </div>
              
              <h2 className="text-2xl font-bold text-amber-900 mb-2">
                Ordenar la canción
              </h2>
              
              <p className="text-lg text-amber-700 mb-4">
                Coloca los versos en orden
              </p>
              
              {isLoading && selectedGame === 'order' ? (
                <Loader2 className="animate-spin w-8 h-8 text-amber-600" />
              ) : (
                <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-xl text-base">
                  Nivel: Intermedio
                </span>
              )}
            </div>
          </button>
          
        </div>
        
        {/* Mensaje informativo */}
        <div className="text-center text-amber-600 text-lg">
          <p>Elige cómo quieres practicar esta canción</p>
        </div>
        
      </main>
    </div>
  );
}