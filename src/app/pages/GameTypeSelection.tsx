import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { fetchLyrics, processLyricsForGame } from '../data/lyricsService';

export function GameTypeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const track = location.state?.track;
  
  if (!track) {
    setTimeout(() => navigate('/songs'), 0);
    return null;
  }

  const handleCompleteLyrics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Normalización de datos para asegurar que enviamos strings a la API
      const artistName = track.artist || (track.artists && track.artists[0]?.name) || "Unknown";
      const trackName = track.title || track.name || "Unknown";

      const lyricsData = await fetchLyrics(artistName, trackName);
      
      if (!lyricsData?.lyrics) {
        throw new Error('No se encontraron letras para esta canción.');
      }
      
      const gameQuestions = processLyricsForGame(lyricsData.lyrics);
      
      if (gameQuestions.length === 0) {
        throw new Error('La letra es demasiado corta para generar el juego.');
      }
      
      navigate(`/game/${track.id}/complete`, {
        state: { track, questions: gameQuestions, lyrics: lyricsData.lyrics }
      });
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/songs')} className="mb-6 p-3 bg-white rounded-xl shadow-sm">
          <ArrowLeft className="text-amber-900" />
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-xl text-center mb-8">
          <img src={track.image} className="w-48 h-48 mx-auto rounded-2xl shadow-lg mb-6 object-cover" alt="" />
          <h2 className="text-3xl font-bold text-amber-900">{track.title}</h2>
          <p className="text-xl text-amber-600">{track.artist}</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl mb-6 flex gap-3 items-center text-red-700">
            <AlertCircle /> <p>{error}</p>
          </div>
        )}

        <button
          onClick={handleCompleteLyrics}
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 text-white p-8 rounded-3xl shadow-lg transition-all flex items-center justify-between disabled:opacity-50"
        >
          <div className="text-left">
            <h3 className="text-2xl font-bold">Completar la Letra</h3>
            <p className="opacity-90">Practica tu comprensión lectora</p>
          </div>
          {isLoading ? <Loader2 className="animate-spin w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
        </button>
      </div>
    </div>
  );
}