import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Music } from 'lucide-react';
import { Button } from '../components/Button';
import { ProgressIndicator } from '../components/ProgressIndicator';

export function CompleteLyrics() {
  const navigate = useNavigate();
  const location = useLocation();
  const { track, questions } = location.state || {};
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; answer: string }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  
  if (!track || !questions || questions.length === 0) {
    navigate('/songs');
    return null;
  }
  
  const currentLyric = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const isCorrect = answer === currentLyric.missing;
    setAnswers([...answers, { correct: isCorrect, answer }]);
  };
  
  const handleContinue = () => {
    if (isLastQuestion) {
      const correctCount = answers.filter(a => a.correct).length;
      navigate('/summary', { 
        state: { 
          track: track.title,
          artist: track.artist,
          correct: correctCount,
          total: questions.length,
          answers,
          questions
        } 
      });
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setShowFeedback(false);
    }
  };
  
  const handleBackToSongs = () => {
    navigate('/songs');
  };
  
  // Pantalla de feedback
  if (showFeedback && selectedAnswer) {
    const isCorrect = selectedAnswer === currentLyric.missing;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            {isCorrect ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-28 h-28 bg-green-100 rounded-full mb-6">
                    <svg className="w-14 h-14 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl mb-4 text-green-700 font-bold">
                    ¡Muy bien!
                  </h2>
                  
                  <p className="text-2xl text-amber-700 leading-relaxed">
                    Respuesta correcta
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-28 h-28 bg-red-100 rounded-full mb-6">
                    <svg className="w-14 h-14 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl mb-4 text-red-600 font-bold">
                    Casi lo logras
                  </h2>
                  
                  <p className="text-2xl text-amber-700 leading-relaxed mb-6">
                    La respuesta correcta era:
                  </p>
                  
                  <div className="bg-green-100 rounded-2xl p-6 mb-4">
                    <p className="text-3xl md:text-4xl text-green-700 font-semibold">
                      "{currentLyric.missing}"
                    </p>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-center">
              <Button 
                onClick={handleContinue} 
                variant="primary"
                size="large"
              >
                {isLastQuestion ? 'Ver resultados' : 'Continuar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Pantalla de juego
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-amber-200 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBackToSongs}
              className="w-14 h-14 flex items-center justify-center rounded-2xl bg-amber-100 hover:bg-amber-200 transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
              aria-label="Volver a canciones"
            >
              <ArrowLeft className="w-8 h-8 text-amber-800" />
            </button>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-amber-900 truncate">
                {track.title}
              </h1>
              <p className="text-lg text-amber-700 truncate">
                {track.artist}
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-xl">
              <Music className="w-5 h-5 text-amber-700" />
              <span className="text-lg font-semibold text-amber-800">
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full h-4 bg-amber-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Contenido de la pregunta */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Fragmento de la canción */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg mb-8">
          <p className="text-2xl md:text-3xl text-amber-900 leading-relaxed text-center font-medium">
            {currentLyric.fragment}
          </p>
        </div>
        
        {/* Pista */}
        {showHint && (
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-200 animate-in fade-in duration-200">
            <div className="flex gap-4 items-start">
              <Lightbulb className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg text-blue-800 mb-1 font-bold">💡 Pista:</p>
                <p className="text-xl text-blue-700 leading-relaxed">
                  {currentLyric.hint}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Opciones de respuesta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentLyric.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 active:scale-[0.98] text-left"
            >
              <p className="text-xl md:text-2xl text-amber-900 font-medium">
                {option}
              </p>
            </button>
          ))}
        </div>
        
        {/* Botón de pista */}
        {!showHint && (
          <div className="text-center">
            <Button
              onClick={() => setShowHint(true)}
              variant="outline"
              size="large"
              className="inline-flex items-center gap-3"
            >
              <Lightbulb className="w-6 h-6" />
              ¿Necesitas una pista?
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}