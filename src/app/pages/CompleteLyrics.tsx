import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle } from 'lucide-react';

export function CompleteLyrics() {
  const navigate = useNavigate();
  const location = useLocation();
  const { track, questions } = location.state || {};
  
  const [isValid, setIsValid] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; answer: string }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  
  // Validación ANTES del renderizado
  useLayoutEffect(() => {
    console.log('🔍 CompleteLyrics - Validando datos...');
    console.log('Track:', track);
    console.log('Questions:', questions);
    
    // Verificación exhaustiva
    const isValidQuestions = questions && 
                            Array.isArray(questions) && 
                            questions.length > 0 &&
                            questions.every(q => 
                              q && 
                              typeof q.fragment === 'string' &&
                              typeof q.missing === 'string' &&
                              Array.isArray(q.options) &&
                              q.options.length > 0
                            );
    
    if (!track || !isValidQuestions) {
      console.log('CompleteLyrics: Datos inválidos, redirigiendo a songs');
      navigate('/songs', { replace: true });
    } else {
      console.log('CompleteLyrics: Datos válidos,', questions.length, 'preguntas');
      setIsValid(true);
    }
  }, [track, questions, navigate]);
  
  // Auto-advance después de 3 segundos
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (showFeedback) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleContinue();
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
  
  // Reset timer cuando cambia la pregunta
  useEffect(() => {
    setTimeLeft(3);
  }, [currentQuestion]);
  
  // Si no es válido, mostrar pantalla de carga mientras redirige
  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-2xl text-amber-700">Preparando el juego...</p>
        </div>
      </div>
    );
  }
  
  // Ahora sí podemos acceder a questions con seguridad
  const currentLyric = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  const handleAnswerSelect = (answer: string) => {
    const correct = answer === currentLyric.missing;
    setIsCorrect(correct);
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setAnswers([...answers, { correct, answer }]);
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
          gameType: 'complete'
        } 
      });
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };
  
  // Pantalla de feedback con auto-avance
  if (showFeedback && selectedAnswer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center">
            
            {/* Icono grande de resultado */}
            <div className="mb-8">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 mx-auto ${
                isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {isCorrect ? (
                  <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={1.5} />
                ) : (
                  <XCircle className="w-16 h-16 text-red-500" strokeWidth={1.5} />
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
                    La respuesta correcta era:
                  </p>
                  <div className="bg-green-100 rounded-2xl p-5 inline-block">
                    <p className="text-3xl md:text-4xl text-green-700 font-semibold">
                      "{currentLyric.missing}"
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Barra de progreso de auto-avance */}
            <div className="max-w-md mx-auto mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg text-amber-600">
                  Siguiente pregunta en...
                </span>
                <span className="text-2xl font-bold text-amber-800">
                  {timeLeft}
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
              
              {/* Botón manual por si quieren avanzar antes */}
              <button
                onClick={handleContinue}
                className="mt-6 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {isLastQuestion ? 'Ver resultados ahora' : 'Continuar ahora'}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      
      {/* Header mejorado */}
      <header className="sticky top-0 bg-white shadow-md border-b border-amber-200 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/songs')}
              className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
              aria-label="Volver a canciones"
            >
              <ArrowLeft className="w-6 h-6 text-amber-800" />
            </button>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-amber-900 truncate">
                {track.title}
              </h1>
              <p className="text-base text-amber-700 truncate">
                {track.artist}
              </p>
            </div>
            
            <div className="bg-amber-100 px-4 py-2 rounded-xl">
              <span className="text-lg font-bold text-amber-800">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full h-3 bg-amber-100 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
        </div>
      </header>
      
      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Fragmento de la canción - más grande y legible */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          <p className="text-2xl md:text-3xl text-amber-900 leading-relaxed text-center font-medium whitespace-pre-line">
            {currentLyric.fragment}
          </p>
        </div>
        
        {/* Pista */}
        {showHint && (
          <div className="bg-blue-50 rounded-xl p-5 mb-6 border-2 border-blue-200">
            <div className="flex gap-3 items-start">
              <Lightbulb className="w-7 h-7 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg font-bold text-blue-800 mb-1">Pista:</p>
                <p className="text-xl text-blue-700">{currentLyric.hint}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Opciones de respuesta - más grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentLyric.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 active:scale-[0.98] text-left"
            >
              <p className="text-xl md:text-2xl text-amber-900 font-medium">
                {option}
              </p>
            </button>
          ))}
        </div>
        
        {/* Botón pista - más grande */}
        {!showHint && (
          <div className="text-center">
            <button
              onClick={() => setShowHint(true)}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
            >
              <Lightbulb className="w-6 h-6" />
              ¿Necesitas una pista?
            </button>
          </div>
        )}
        
      </main>
    </div>
  );
}