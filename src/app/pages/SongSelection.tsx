import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search, Music, Loader2 } from 'lucide-react';
import { songs } from '../data/songs';
import { searchTracks } from '../data/spotify';

export function SongSelection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [spotifyResults, setSpotifyResults] = useState<any[]>([]);
  const [suggestedTracks, setSuggestedTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSuggestions() {
      setIsLoading(true);
      try {
        const promises = songs.map(song =>
          searchTracks(`${song.title} ${song.artist}`)
        );
        const results = await Promise.allSettled(promises);
        const successfulTracks = results
          .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
          .map(r => r.value[0])
          .filter(Boolean);
        if (isMounted) setSuggestedTracks(successfulTracks);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSuggestions();
    return () => { isMounted = false; };
  }, []);

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
          artist: track.artists?.[0]?.name || 'Artista desconocido',
          album: track.album?.name || '',
          image: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || '',
          preview_url: track.preview_url || '',
          spotify_url: track.external_urls?.spotify || ''
        }
      }
    });
  };

  const tracks = search.length > 2 ? spotifyResults : suggestedTracks;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <header className="sticky top-0 bg-white shadow-md border-b border-amber-200 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/menu')}
              className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
              aria-label="Volver al menú"
            >
              <ArrowLeft className="w-6 h-6 text-amber-800" />
            </button>
            <h1 className="text-2xl font-bold text-amber-900">
              Elige una canción
            </h1>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
            aria-label="Ir al inicio"
          >
            <Home className="w-6 h-6 text-amber-800" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 w-6 h-6" />
          <input
            type="text"
            placeholder="Buscar canción o artista"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-5 pl-12 text-xl rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white shadow-sm"
          />
        </div>

        {isLoading && (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="animate-spin h-10 w-10 text-amber-600" />
            <p className="text-amber-700 mt-2">Buscando canciones...</p>
          </div>
        )}

        {!isLoading && tracks.length === 0 && search.length > 2 && (
          <div className="text-center py-10 text-amber-700 text-xl">
            No se encontraron canciones para "{search}"
          </div>
        )}

        {tracks.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
              <Music className="w-6 h-6" />
              {search.length > 2 ? 'Resultados' : 'Sugerencias'}
            </h2>

            <div className="space-y-4">
              {tracks.map((track) => (
                <SimpleTrackCard
                  key={track.id}
                  track={track}
                  onSelect={() => handleTrackSelect(track)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// VERSIÓN SIMPLIFICADA - Solo un botón, toda la tarjeta es clickeable
function SimpleTrackCard({ track, onSelect }: { track: any; onSelect: () => void }) {
  
  const image = track.album?.images?.[1]?.url || 
                track.album?.images?.[0]?.url || 
                'https://via.placeholder.com/96x96?text=🎵';

  const artistName = track.artists?.map((a: any) => a.name).join(', ') || 
                     track.artist || 
                     'Artista desconocido';

  const trackName = track.name || track.title || 'Canción sin título';

  return (
    <div 
      onClick={onSelect}
      className="bg-white rounded-2xl border-2 border-amber-200 shadow-lg p-5 hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-5">
        
        <img
          src={image}
          alt={trackName}
          className="w-20 h-20 rounded-xl shadow-md object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x96?text=🎵';
          }}
        />

        <div className="flex-1">
          <h3 className="text-xl font-bold text-amber-900">
            {trackName}
          </h3>
          <p className="text-lg text-amber-700">
            {artistName}
          </p>
        </div>

        {/* Indicador visual de que es clickeable */}
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <span className="text-2xl">🎮</span>
        </div>

      </div>
    </div>
  );
}