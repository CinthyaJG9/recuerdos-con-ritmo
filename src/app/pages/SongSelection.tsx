import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search, Play, Music, Loader2 } from 'lucide-react';
import { songs } from '../data/songs';
import { searchTracks } from '../data/spotify';

export function SongSelection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [spotifyResults, setSpotifyResults] = useState<any[]>([]);
  const [suggestedTracks, setSuggestedTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Carga de sugerencias optimizada
  useEffect(() => {
    let isMounted = true;
    async function loadSuggestions() {
      setIsLoading(true);
      try {
        const promises = songs.map(song => searchTracks(`${song.title} ${song.artist}`));
        const results = await Promise.allSettled(promises);
        
        const successfulTracks = results
          .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
          .map(r => r.value[0])
          .filter(Boolean);

        if (isMounted) {
          setSuggestedTracks(successfulTracks);
        }
      } catch (error) {
        console.error("Error loading suggestions:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadSuggestions();
    return () => { isMounted = false; };
  }, []);

  // 2. Lógica de Debounce para búsqueda
  useEffect(() => {
    if (search.trim().length <= 2) {
      setSpotifyResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchTracks(search);
        setSpotifyResults(results);
      } catch (e) { 
        console.error(e); 
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleTrackSelect = (track: any) => {
    navigate(`/game-type/${track.id}`, { 
      state: { 
        track: {
          id: track.id,
          title: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          image: track.album.images[1]?.url || track.album.images[0]?.url,
          preview_url: track.preview_url,
          spotify_url: track.external_urls.spotify
        }
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-amber-200 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/menu')}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-100 hover:bg-amber-200 transition-all text-amber-800"
            >
              <ArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-amber-900 leading-tight">Completar la letra</h1>
              <p className="text-sm text-amber-700 hidden md:block">Elige una canción para practicar</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-100 hover:bg-amber-200 transition-all text-amber-800"
          >
            <Home />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Buscador */}
        <div className="relative mb-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-amber-500" />
          <input
            type="text"
            placeholder="Buscar por canción o artista..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-5 pl-14 text-xl rounded-2xl border-2 border-amber-200 bg-white shadow-md focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
          />
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="animate-spin h-10 w-10 text-amber-600 mb-2" />
            <p className="text-amber-700">Buscando en la biblioteca...</p>
          </div>
        )}

        {/* Título de sección dinámica */}
        <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
          <Music className="w-6 h-6 text-amber-600" />
          {search.length > 2 ? 'Resultados de búsqueda' : 'Canciones sugeridas para ti'}
        </h2>

        {/* Lista de Canciones */}
        <div className="space-y-4">
          {(search.length > 2 ? spotifyResults : suggestedTracks).map((track) => (
            <TrackCard 
              key={track.id} 
              track={track} 
              onSelect={() => handleTrackSelect(track)} 
            />
          ))}
          
          {!isLoading && search.length > 2 && spotifyResults.length === 0 && (
            <p className="text-center py-10 text-amber-700 bg-white/50 rounded-2xl border-2 border-dashed border-amber-200">
              No encontramos resultados para tu búsqueda.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

// Sub-componente TrackCard mejorado con Spotify y Audio
function TrackCard({ track, onSelect }: { track: any, onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-2xl border-2 border-amber-100 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 cursor-pointer group"
    >
      <div className="p-4 flex flex-col md:flex-row items-center gap-5">
        {/* Imagen del álbum */}
        <img
          src={track.album.images[1]?.url || track.album.images[0]?.url}
          alt={track.name}
          className="w-20 h-20 rounded-xl shadow-md object-cover group-hover:scale-105 transition-transform"
        />
        
        {/* Información */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          <h3 className="text-xl font-bold text-amber-900 truncate group-hover:text-amber-600 transition-colors">
            {track.name}
          </h3>
          <p className="text-amber-700 font-medium">
            {track.artists.map((a: any) => a.name).join(', ')}
          </p>
          <p className="text-sm text-amber-500 italic truncate">
            {track.album.name}
          </p>
        </div>

        {/* Reproductor de Audio (opcional) */}
        {track.preview_url && (
          <div className="w-full md:w-auto px-4" onClick={(e) => e.stopPropagation()}>
            <audio 
              src={track.preview_url} 
              controls 
              className="h-8 w-full md:w-48 accent-amber-500"
            />
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(track.external_urls.spotify, '_blank');
            }}
            className="flex-1 md:flex-none px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <Play fill="white" className="w-4 h-4" />
            Reproducir
          </button>
        </div>
      </div>
    </div>
  );
}