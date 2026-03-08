import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Shuffle, Check, X, Undo2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export function OrderGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const { track, questions } = location.state || {};
  
  const [currentRound, setCurrentRound] = useState(0);
  const [verses, setVerses] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState<number[]>([]);
  const [userOrder, setUserOrder] = useState<number[]>([]);
  const [availableIndices, setAvailableIndices] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  // Validación inicial
  useEffect(() => {
    if (!track || !questions || !Array.isArray(questions) || questions.length === 0) {
      navigate('/songs');
      return;
    }
    loadRound(0);
  }, []);
  
  // Auto-avance después de 3 segundos
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (showFeedback) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleNextRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showFeedback]);
  
  const loadRound = (roundIndex: number) => {
    const round = questions[roundIndex];
    setVerses(round.verses);
    setCorrectOrder(round.correctOrder);
    
    // Crear orden aleatorio inicial
    const indices = Array.from({ length: round.verses.length }, (_, i) => i);
    setUserOrder([]);
    setAvailableIndices(indices.sort(() => Math.random() - 0.5));
    setShowFeedback(false);
    setShowHint(false);
    setTimeLeft(3);
  };
  
  const handleVerseSelect = (index: number) => {
    if (showFeedback) return;
    
    const newUserOrder = [...userOrder, index];
    setUserOrder(newUserOrder);
    
    // Remover el índice seleccionado de disponibles
    const newAvailable = availableIndices.filter(i => i !== index);
    setAvailableIndices(newAvailable);
    
    // Verificar si completó el orden
    if (newUserOrder.length === verses.length) {
      checkOrder(newUserOrder);
    }
  };
  
  const handleUndo = () => {
    if (showFeedback || userOrder.length === 0) return;
    
    // Recuperar el último índice seleccionado
    const lastIndex = userOrder[userOrder.length - 1];
    const newUserOrder = userOrder.slice(0, -1);
    
    // Devolver el índice a disponibles
    const newAvailable = [...availableIndices, lastIndex].sort(() => Math.random() - 0.5);
    
    setUserOrder(newUserOrder);
    setAvailableIndices(newAvailable);
  };
  
const checkOrder = (order: number[]) => {
  // Obtenemos los textos en el orden que el usuario eligió
  const userTexts = order.map(idx => verses[idx]);
  
  // Comparamos contra los textos originales (que están en questions[currentRound].originalVerses)
  const correct = userTexts.every((text, idx) => text === questions[currentRound].originalVerses[idx]);
  
  setIsCorrect(correct);
  if (correct) {
    setScore(prev => prev + 1);
  }
  setShowFeedback(true);
};
  
  const handleNextRound = () => {
    if (currentRound === questions.length - 1) {
      navigate('/summary', {
        state: {
          track: track.title,
          artist: track.artist,
          correct: score,
          total: questions.length,
          gameType: 'order'
        }
      });
    } else {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      loadRound(nextRound);
    }
  };
  
  const handlePreviousRound = () => {
    if (currentRound > 0) {
      const prevRound = currentRound - 1;
      setCurrentRound(prevRound);
      loadRound(prevRound);
    }
  };
  
  const handleReset = () => {
    // Reiniciar la ronda actual
    const indices = Array.from({ length: verses.length }, (_, i) => i);
    setUserOrder([]);
    setAvailableIndices(indices.sort(() => Math.random() - 0.5));
    setShowFeedback(false);
    setShowHint(false);
  };
  
  if (!track || !questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-2xl text-amber-700">Cargando juego...</p>
        </div>
      </div>
    );
  }
  
  const round = questions[currentRound];
  const progress = ((currentRound + 1) / questions.length) * 100;
  
  // Determinar qué parte de la canción es
  const getSongPart = () => {
    if (currentRound === 0) return "principio";
    if (currentRound === 1) return "parte media";
    return "parte final";
  };
  
  // Pantalla de feedback
  if (showFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center">
            
            <div className="mb-8">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 mx-auto ${
                isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {isCorrect ? (
                  <Check className="w-16 h-16 text-green-600" strokeWidth={1.5} />
                ) : (
                  <X className="w-16 h-16 text-red-500" strokeWidth={1.5} />
                )}
              </div>
              
              <h2 className={`text-4xl md:text-5xl font-bold mb-2 ${
                isCorrect ? 'text-green-700' : 'text-red-600'
              }`}>
                {isCorrect ? '¡Muy bien!' : 'Casi lo logras'}
              </h2>
              
{!isCorrect && (
  <div className="mt-4">
    <p className="text-2xl text-amber-700 mb-3">
      El orden correcto era:
    </p>
    <div className="bg-amber-100 rounded-2xl p-5 max-w-md mx-auto">
      {/* Usamos directamente originalVerses que ya vienen en orden */}
      {questions[currentRound].originalVerses.map((verseText: string, position: number) => (
        <div key={position} className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
            {position + 1}
          </span>
          <p className="text-lg text-amber-800 text-left flex-1">
            {verseText}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
            </div>
            
            <div className="max-w-md mx-auto mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg text-amber-600">
                  Siguiente ronda en...
                </span>
                <span className="text-2xl font-bold text-amber-800">
                  {timeLeft}s
                </span>
              </div>
              <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    isCorrect ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${(timeLeft / 3) * 100}%` }}
                />
              </div>
              
              <button
                onClick={handleNextRound}
                className="mt-6 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {currentRound === questions.length - 1 ? 'Ver resultados' : 'Continuar'}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md border-b border-amber-200 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/songs')}
              className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200"
              aria-label="Volver a canciones"
            >
              <ArrowLeft className="w-6 h-6 text-amber-800" />
            </button>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-amber-900 truncate">
                {track.title}
              </h1>
              <p className="text-base text-amber-700 truncate">
                {track.artist}
              </p>
            </div>
            
            <div className="bg-purple-100 px-4 py-2 rounded-xl">
              <span className="text-lg font-bold text-purple-800">
                {currentRound + 1} / {questions.length}
              </span>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full h-3 bg-amber-100 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
        </div>
      </header>
      
      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Indicador de progreso de la canción */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md border border-amber-200">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousRound}
              disabled={currentRound === 0}
              className={`p-2 rounded-lg ${
                currentRound === 0 
                  ? 'text-amber-300 cursor-not-allowed' 
                  : 'text-amber-600 hover:bg-amber-100'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <p className="text-lg text-amber-800 font-medium">
                Estrofa {currentRound + 1} de {questions.length}
              </p>
              <p className="text-base text-amber-600">
                ({getSongPart()} de la canción)
              </p>
            </div>
            
            <button
              onClick={handleNextRound}
              disabled={currentRound === questions.length - 1 || showFeedback}
              className={`p-2 rounded-lg ${
                currentRound === questions.length - 1 || showFeedback
                  ? 'text-amber-300 cursor-not-allowed' 
                  : 'text-amber-600 hover:bg-amber-100'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Instrucción */}
        <div className="bg-purple-50 rounded-xl p-4 mb-6 border-2 border-purple-200">
          <p className="text-xl text-purple-800 text-center font-medium">
            🎵 Ordena los 4 versos de esta estrofa
          </p>
        </div>
        
        {/* Área de juego - diseño simplificado */}
        <div className="space-y-6">
          
          {/* Versos disponibles (para seleccionar) */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">📌</span>
              Versos para ordenar:
            </h3>
            
            {availableIndices.length === 0 ? (
              <div className="bg-green-50 rounded-xl p-6 text-center border-2 border-green-300">
                <p className="text-green-600 text-xl font-bold">
                  ¡Usaste todos los versos!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {availableIndices.map((verseIdx) => (
                  <button
                    key={verseIdx}
                    onClick={() => handleVerseSelect(verseIdx)}
                    className="w-full text-left bg-purple-50 hover:bg-purple-100 p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all"
                  >
                    <p className="text-lg text-purple-900">
                      {round.verses[verseIdx]}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-amber-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">📋</span>
                Tu orden:
              </h3>
              {userOrder.length > 0 && (
                <button
                  onClick={handleUndo}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl transition-colors"
                >
                  <Undo2 className="w-5 h-5" />
                  <span>Deshacer último</span>
                </button>
              )}
            </div>
            
            {userOrder.length === 0 ? (
              <div className="bg-amber-50 rounded-xl p-8 text-center border-2 border-dashed border-amber-300">
                <p className="text-amber-500 text-lg">
                  Selecciona los versos en orden
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrder.map((verseIdx, position) => {
                  const isPositionCorrect = correctOrder[position] === verseIdx;
                  return (
                    <div 
                      key={position} 
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 ${
                        isPositionCorrect 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-amber-50 border-amber-300'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                        isPositionCorrect 
                          ? 'bg-green-500 text-white' 
                          : 'bg-amber-500 text-white'
                      }`}>
                        {position + 1}
                      </span>
                      <p className="flex-1 text-lg text-amber-900">
                        {round.verses[verseIdx]}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </div>
        
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          
          {/* Botón Reiniciar ronda */}
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-lg font-bold rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reiniciar esta estrofa
          </button>
          
        </div>
        
      </main>
    </div>
  );
}