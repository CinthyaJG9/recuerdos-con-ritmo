import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Lightbulb, CheckCircle, XCircle, Mic, 
  Home, HelpCircle, Sparkles, Loader2, Volume2
} from 'lucide-react';
import { hintService } from '../data/hintService';

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

  // Estados para modo voz (DESACTIVADO POR DEFECTO)
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Estados para pistas con IA
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [hintCache, setHintCache] = useState<Record<string, string>>({});

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim();
  };

  const similarity = (a: string, b: string) => {
    const wordsA = normalizeText(a).split(" ");
    const wordsB = normalizeText(b).split(" ");
    const intersection = wordsA.filter(word => wordsB.includes(word));
    return intersection.length / Math.max(wordsA.length, wordsB.length);
  };

  useLayoutEffect(() => {
    const isValidQuestions = questions &&
      Array.isArray(questions) &&
      questions.length > 0 &&
      questions.every(q =>
        q &&
        typeof q.fragment === 'string' &&
        typeof q.missing === 'string' &&
        Array.isArray(q.options)
      );

    if (!track || !isValidQuestions) {
      navigate('/songs', { replace: true });
    } else {
      setIsValid(true);
    }
  }, [track, questions, navigate]);

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

  useEffect(() => {
    setTimeLeft(3);
    setVoiceModeActive(false);
    setVoiceError(null);
    setListening(false);
    setAiHint(null);
    setShowHint(false);
  }, [currentQuestion]);

  // ============================================
  // PRECARGADO DE PISTAS
  // ============================================
  useEffect(() => {
    const preloadHints = async () => {
      if (!isValid || !currentLyric) return;
      
      const currentKey = `${track.title}-${currentLyric.missing}`;
      if (!hintCache[currentKey]) {
        console.log(`Precargando pista para pregunta actual: "${currentLyric.missing}"`);
        try {
          const res = await hintService.getCompleteLyricsHint(
            track.title, 
            track.artist, 
            currentLyric.missing, 
            currentLyric.options
          );
          setHintCache(prev => ({ ...prev, [currentKey]: res.hint }));
        } catch (error) {
          console.error('Error precargando pista actual:', error);
        }
      }

      if (currentQuestion < questions.length - 1) {
        const nextLyric = questions[currentQuestion + 1];
        const nextKey = `${track.title}-${nextLyric.missing}`;
        if (!hintCache[nextKey]) {
          console.log(`Precargando pista para siguiente pregunta: "${nextLyric.missing}"`);
          hintService.getCompleteLyricsHint(
            track.title, 
            track.artist, 
            nextLyric.missing, 
            nextLyric.options
          ).then(res => {
            setHintCache(prev => ({ ...prev, [nextKey]: res.hint }));
          }).catch(error => {
            console.error('Error precargando siguiente pista:', error);
          });
        }
      }
    };

    if (isValid) preloadHints();
  }, [currentQuestion, isValid]);

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

  const currentLyric = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    const correct = answer === currentLyric.missing;

    setIsCorrect(correct);
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setAnswers([...answers, { correct, answer }]);
    
    if (listening) {
      stopVoiceRecognition();
    }
    setVoiceModeActive(false);
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
      setVoiceModeActive(false);
      setVoiceError(null);
      setAiHint(null);
    }
  };

  // Función para generar pista con IA (con caché)
  const generateAIHint = async () => {
    if (!currentLyric) return;
    
    const cacheKey = `${track.title}-${currentLyric.missing}`;
    
    if (hintCache[cacheKey]) {
      console.log('Usando pista precargada');
      setAiHint(hintCache[cacheKey]);
      setShowHint(true);
      return;
    }
    
    setIsGeneratingHint(true);
    
    try {
      const response = await hintService.getCompleteLyricsHint(
        track.title,
        track.artist,
        currentLyric.missing,
        currentLyric.options
      );
      
      setHintCache(prev => ({ ...prev, [cacheKey]: response.hint }));
      setAiHint(response.hint);
      setShowHint(true);
    } catch (error) {
      console.error('Error generando pista con IA:', error);
      
      const fallbackHints = [
        "Escucha la canción en tu mente...",
        "Recuerda el contexto de la canción",
        "¿Qué palabra encaja mejor aquí?",
        "Canta mentalmente la frase",
        "Piensa en el significado de la letra"
      ];
      const fallbackHint = fallbackHints[Math.floor(Math.random() * fallbackHints.length)];
      setAiHint(fallbackHint);
      setShowHint(true);
    } finally {
      setIsGeneratingHint(false);
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = true;
    recognition.continuous = true;

    setListening(true);
    setVoiceError(null);
    setVoiceModeActive(true);

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript;
      console.log("Escuché:", transcript);

      const normalizedTranscript = normalizeText(transcript);
      let matchedOption: string | null = null;
      let bestMatchScore = 0;

      currentLyric.options.forEach((option: string) => {
        const normalizedOption = normalizeText(option);
        
        if (normalizedTranscript.includes(normalizedOption)) {
          matchedOption = option;
          bestMatchScore = 1;
        } else {
          const score = similarity(transcript, option);
          if (score > 0.6 && score > bestMatchScore) {
            matchedOption = option;
            bestMatchScore = score;
          }
        }
      });

      if (matchedOption) {
        recognition.stop();
        handleAnswerSelect(matchedOption);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Error de voz:", event.error);
      
      if (event.error === "not-allowed") {
        setVoiceError("Permiso denegado. Activa el micrófono.");
      } else {
        setVoiceError("Error con el micrófono. Intenta de nuevo.");
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Error al iniciar reconocimiento:", error);
      setVoiceError("No se pudo iniciar el micrófono");
      setListening(false);
    }
  };

  const stopVoiceRecognition = () => {
    setListening(false);
  };

  const toggleVoiceMode = () => {
    if (voiceModeActive) {
      stopVoiceRecognition();
      setVoiceModeActive(false);
    } else {
      setVoiceModeActive(true);
      startVoiceRecognition();
    }
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  if (showFeedback && selectedAnswer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center">
            <div className="mb-8">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 mx-auto ${
                isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {isCorrect ? (
                  <CheckCircle className="w-16 h-16 text-green-600" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-500" />
                )}
              </div>

              <h2 className={`text-4xl font-bold mb-2 ${
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
                    <p className="text-3xl text-green-700 font-semibold">
                      "{currentLyric.missing}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="max-w-md mx-auto mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg text-amber-600">
                  Siguiente pregunta en...
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
                onClick={handleContinue}
                className="mt-6 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white text-xl font-bold rounded-xl shadow-lg w-full"
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

            <button
              onClick={() => navigate('/menu')}
              className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
              aria-label="Ir al menú"
            >
              <Home className="w-6 h-6 text-amber-800" />
            </button>

            <div className="bg-amber-100 px-4 py-2 rounded-xl">
              <span className="text-lg font-bold text-amber-800">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
          </div>

          <div className="w-full h-3 bg-amber-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Botón de ayuda flotante */}
        <button
          onClick={toggleInstructions}
          className="fixed bottom-4 right-4 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-20"
          aria-label="Ayuda"
        >
          <HelpCircle className="w-8 h-8 text-white" />
        </button>

        {/* Panel de instrucciones */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">Cómo jugar:</h3>
              <ul className="space-y-4 text-lg text-amber-700">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center text-xl">👆</span>
                  <span>Toca la respuesta correcta en la pantalla</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">🎤</span>
                  <span>Opcional: usa el micrófono si prefieres hablar</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">💡</span>
                  <span>Usa la pista si necesitas ayuda</span>
                </li>
              </ul>
              <button
                onClick={toggleInstructions}
                className="mt-6 w-full py-4 bg-amber-600 text-white text-xl font-bold rounded-xl"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* Fragmento de la canción */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          <p className="text-3xl text-amber-900 text-center whitespace-pre-line leading-relaxed">
            {currentLyric.fragment}
          </p>
        </div>

        {/* Pista con IA */}
        {showHint && aiHint && (
          <div className="bg-purple-50 rounded-xl p-5 mb-6 border-2 border-purple-200">
            <div className="flex gap-3 items-start">
              <Sparkles className="w-7 h-7 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg font-bold text-purple-800 mb-1">
                  Pista especial:
                </p>
                <p className="text-xl text-purple-700">
                  {aiHint}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Opciones de respuesta - SIEMPRE HABILITADAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentLyric.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className="bg-white rounded-xl p-6 shadow-md border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 active:scale-95 transition-all"
            >
              <p className="text-xl text-amber-900 font-medium">
                {option}
              </p>
            </button>
          ))}
        </div>

        {/* Área de voz como OPCIÓN SECUNDARIA */}
        <div className={`rounded-2xl p-6 mb-8 border-2 transition-all ${
          voiceModeActive 
            ? 'bg-green-50 border-green-400 shadow-lg' 
            : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex flex-col items-center">
            
            {/* Indicador de estado */}
            <div className="w-full mb-4">
              <div className="flex items-center justify-center gap-3">
                {voiceModeActive ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xl font-bold text-green-700">MICRÓFONO ACTIVADO</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                    <p className="text-xl font-bold text-purple-700">MODO TÁCTIL</p>
                  </div>
                )}
              </div>
              
              {voiceModeActive && listening && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Volume2 className="w-6 h-6 text-green-600 animate-pulse" />
                  <span className="text-lg text-green-600 font-medium">Escuchando... puedes hablar</span>
                </div>
              )}
              
              {voiceModeActive && !listening && !voiceError && (
                <p className="text-center text-green-600 mt-2">Preparando micrófono...</p>
              )}
            </div>

            <div className="flex items-center gap-8">
              {/* Botón de micrófono */}
              <div className="relative">
                {voiceModeActive && listening && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-70"></span>
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-50"></span>
                  </>
                )}

                <button
                  onClick={toggleVoiceMode}
                  className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-xl transition-all ${
                    voiceModeActive
                      ? listening
                        ? "bg-green-500 scale-110 ring-4 ring-green-300"
                        : "bg-green-500 hover:bg-green-600"
                      : "bg-purple-500 hover:bg-purple-600"
                  }`}
                  aria-label={voiceModeActive ? "Desactivar micrófono" : "Activar micrófono"}
                >
                  <Mic className="w-12 h-12 text-white" />
                </button>
              </div>

              {/* Texto explicativo */}
              <div className="flex-1 text-left">
                {voiceModeActive ? (
                  <>
                    <p className="text-xl font-bold text-green-700">¡Micrófono activo!</p>
                    <p className="text-lg text-green-600">Di una opción para seleccionarla</p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold text-purple-700">Modo táctil</p>
                    <p className="text-lg text-purple-600">Toca la respuesta con el dedo</p>
                    <button
                      onClick={toggleVoiceMode}
                      className="mt-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
                    >
                      Activar micrófono
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mensajes de error */}
            {voiceError && (
              <div className="mt-4 p-4 bg-red-100 rounded-xl border-2 border-red-300 w-full">
                <p className="text-lg text-red-700 text-center">
                  {voiceError}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botón de pista ÚNICO */}
        {!showHint && (
          <div className="text-center">
            <button
              onClick={generateAIHint}
              disabled={isGeneratingHint}
              className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingHint ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generando pista...
                </>
              ) : (
                <>
                  <Lightbulb className="w-6 h-6" />
                  Pista
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}