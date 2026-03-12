import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search, Music, Loader2, PlayCircle, Mic } from 'lucide-react';
import { songs } from '../data/songs';
import { searchTracks } from '../data/spotify';

export function SongSelection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [spotifyResults, setSpotifyResults] = useState<any[]>([]);
  const [suggestedTracks, setSuggestedTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listening, setListening] = useState(false);

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

  const startVoiceSearch = () => {

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "es-ES";
    recognition.interimResults = false;

    setListening(true);

    recognition.onresult = (event: any) => {

      const transcript = event.results[0][0].transcript;

      setSearch(transcript);

    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();

  };

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
              className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
            >
              <ArrowLeft className="w-7 h-7 text-amber-800" />
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">
              Elige una canción
            </h1>

          </div>

          <button
            onClick={() => navigate('/menu')}
            className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
          >
            <Home className="w-7 h-7 text-amber-800" />
          </button>

        </div>

      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* BUSCADOR */}

        <div className="relative mb-8 flex items-center gap-3">

          <div className="relative flex-1">

            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500 w-7 h-7" />

            <input
              type="text"
              placeholder="Buscar canción o artista"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-6 pl-14 text-2xl rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white shadow-sm"
            />

          </div>

          {/* BOTÓN MICRÓFONO */}

          <button
            onClick={startVoiceSearch}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all
            ${listening
              ? "bg-orange-400 scale-110"
              : "bg-orange-500 hover:bg-orange-600 active:scale-95"
            }`}
          >

            {listening && (
              <span className="absolute inset-0 rounded-full bg-orange-300 animate-ping opacity-70"></span>
            )}

            <Mic className="w-7 h-7 text-white" strokeWidth={2.5} />

          </button>

        </div>

        {isLoading && (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="animate-spin h-12 w-12 text-amber-600" />
            <p className="text-amber-700 mt-3 text-xl">Buscando canciones...</p>
          </div>
        )}

        {!isLoading && tracks.length === 0 && search.length > 2 && (
          <div className="text-center py-10 text-amber-700 text-2xl">
            No se encontraron canciones para "{search}"
          </div>
        )}

        {tracks.length > 0 && (

          <>

            <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6 flex items-center gap-3">
              <Music className="w-7 h-7" />
              {search.length > 2 ? 'Resultados de búsqueda' : 'Canciones sugeridas para ti'}
            </h2>

            <div className="space-y-5">
              {tracks.map((track) => (
                <TrackCard
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

/* TARJETA DE CANCIÓN */

function TrackCard({ track, onSelect }: { track: any; onSelect: () => void }) {

  const image = track.album?.images?.[1]?.url ||
    track.album?.images?.[0]?.url ||
    'https://via.placeholder.com/96x96?text=🎵';

  const artistName = track.artists?.map((a: any) => a.name).join(', ') ||
    track.artist ||
    'Artista desconocido';

  const trackName = track.name || track.title || 'Canción sin título';

  return (

    <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-lg p-6 hover:shadow-xl transition-all">

      <div className="flex flex-col sm:flex-row items-center gap-6">

        <img
          src={image}
          alt={trackName}
          className="w-24 h-24 rounded-xl shadow-md object-cover"
        />

        <div className="flex-1 text-center sm:text-left">

          <h3 className="text-2xl font-bold text-amber-900 mb-2">
            {trackName}
          </h3>

          <p className="text-xl text-amber-700">
            {artistName}
          </p>

        </div>

        <button
          onClick={onSelect}
          className="w-full sm:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <PlayCircle className="w-8 h-8" />
          JUGAR
        </button>

      </div>

      <div className="mt-3 text-sm text-amber-500 text-center sm:text-left">
        Haz clic en JUGAR para empezar
      </div>

    </div>

  );

}