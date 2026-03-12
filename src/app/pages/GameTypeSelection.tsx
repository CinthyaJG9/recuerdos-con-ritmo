import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, Loader2, AlertCircle, Pause, Shuffle, Music, Headphones, HelpCircle } from 'lucide-react';
import { fetchLyrics, processLyricsForGame, processOrderGame } from '../data/lyricsService';

export function GameTypeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGame, setSelectedGame] = useState<'complete' | 'order' | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  
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
          .catch(e => {
            console.error('Error al reproducir:', e);
            setError('No se pudo reproducir el audio. Intenta de nuevo.');
          });
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
      console.log('Cargando juego de ordenar para:', track.artist, '-', track.title);
      
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
      
      console.log('Letra obtenida, longitud:', lyricsData.lyrics.length);
      
      const orderQuestions = processOrderGame(lyricsData.lyrics);
      
      console.log('Preguntas de ordenar generadas:', orderQuestions);
      
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
      
      console.log('Navegando a OrderGame con', orderQuestions.length, 'rondas');
      
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

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md border-b border-amber-200 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/songs')}
            className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
            aria-label="Volver a canciones"
          >
            <ArrowLeft className="w-7 h-7 text-amber-800" />
          </button>
          
          <h1 className="text-2xl font-bold text-amber-900">
            Elige cómo jugar
          </h1>
          
          <button
            onClick={toggleInstructions}
            className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
            aria-label="Ayuda"
          >
            <HelpCircle className="w-7 h-7 text-blue-700" />
          </button>
        </div>
      </header>

      {/* Panel de instrucciones */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Cómo jugar:</h3>
            
            <div className="space-y-4 text-lg">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">1️⃣</div>
                <p className="text-amber-700">Escucha la canción con el reproductor</p>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">2️⃣</div>
                <p className="text-amber-700">Elige el juego que prefieras</p>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">3️⃣</div>
                <p className="text-amber-700">Completa la letra: elige la palabra que falta</p>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">4️⃣</div>
                <p className="text-amber-700">Ordenar la canción: coloca los versos en orden</p>
              </div>
            </div>
            
            <button
              onClick={toggleInstructions}
              className="mt-6 w-full py-4 bg-amber-600 text-white text-xl font-bold rounded-xl hover:bg-amber-700 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Info de la canción - más compacta */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 flex items-center gap-6">
          {track.image && (
            <img 
              src={track.image} 
              alt={track.title}
              className="w-20 h-20 rounded-xl shadow-md object-cover"
            />
          )}
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-amber-900">
              {track.title}
            </h1>
            <p className="text-xl text-amber-700">
              {track.artist}
            </p>
          </div>
        </div>
        
        {/* REPRODUCTOR MEJORADO */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border-2 border-amber-300">
          <p className="text-xl text-amber-800 mb-4 font-semibold flex items-center gap-2">
            <Headphones className="w-6 h-6" />
            Escucha la canción:
          </p>

          {track.preview_url ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 w-full max-w-md">
                <button
                  onClick={toggleAudio}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isPlaying 
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 transition-all"
                      style={{ width: isPlaying ? '100%' : '0%' }}
                    />
                  </div>
                  <p className="text-sm text-amber-600 mt-1">
                    {isPlaying ? 'Reproduciendo...' : 'Presiona play para escuchar'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-amber-500">
                Fragmento de 30 segundos
              </p>
            </div>
          ) : (
            <div className="text-center">
              <a
                href={track.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1DB954] hover:bg-[#1ed760] text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Play className="w-6 h-6" />
                Escuchar en Spotify
              </a>
              <p className="text-sm text-amber-500 mt-3">
                Se abrirá en una nueva ventana. Vuelve aquí para jugar.
              </p>
            </div>
          )}
        </div>
        
        {/* Error */}
        {error && (
          <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <p className="text-xl text-red-800">{error}</p>
          </div>
        )}
        
        {/* OPCIONES DE JUEGO - Diseño mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Juego 1: Completar la letra */}
          <button
            onClick={handleCompleteLyrics}
            disabled={isLoading && selectedGame === 'complete'}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-amber-200 hover:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Music className="w-8 h-8 text-amber-700" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-900 mb-1">
                  Completar la letra
                </h2>
                <p className="text-lg text-amber-700 mb-2">
                  Elige la palabra que falta
                </p>
                
                {isLoading && selectedGame === 'complete' ? (
                  <Loader2 className="animate-spin w-6 h-6 text-amber-600" />
                ) : (
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm">
                    Nivel: Fácil
                  </span>
                )}
              </div>
            </div>
          </button>
          
          {/* Juego 2: Ordenar la canción */}
          <button
            onClick={handleOrderGame}
            disabled={isLoading && selectedGame === 'order'}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-purple-200 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shuffle className="w-8 h-8 text-purple-700" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-900 mb-1">
                  Ordenar la canción
                </h2>
                <p className="text-lg text-amber-700 mb-2">
                  Coloca los versos en orden
                </p>
                
                {isLoading && selectedGame === 'order' ? (
                  <Loader2 className="animate-spin w-6 h-6 text-amber-600" />
                ) : (
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm">
                    Nivel: Intermedio
                  </span>
                )}
              </div>
            </div>
          </button>
          
        </div>
        
        {/* Mensaje de ayuda */}
        <div className="text-center">
          <p className="text-lg text-amber-600">
            ¿Necesitas ayuda? Presiona el botón azul de ayuda
          </p>
        </div>
        
      </main>
    </div>
  );
}