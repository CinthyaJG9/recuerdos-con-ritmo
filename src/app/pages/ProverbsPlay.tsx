import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, Home, Mic, HelpCircle, Volume2, 
  CheckCircle, XCircle, ArrowLeft, VolumeX 
} from 'lucide-react';
import { getRandomProverbs } from '../data/proverbsService';
import { ProgressIndicator } from '../components/ProgressIndicator';

export function ProverbsPlay() {  
  const navigate = useNavigate();

  const [proverbs, setProverbs] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Estados para modo voz (DESACTIVADO POR DEFECTO)
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3);

  // Cargar refranes aleatorios al iniciar
  useEffect(() => {
    const randomProverbs = getRandomProverbs(8);
    setProverbs(randomProverbs);
    setIsLoading(false);
  }, []);

  // Temporizador para avanzar automáticamente
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

  // Resetear temporizador al cambiar de pregunta
  useEffect(() => {
    setTimeLeft(3);
  }, [currentQuestion]);

  const proverb = proverbs[currentQuestion];
  const isLastQuestion = currentQuestion === proverbs.length - 1;
  const progress = ((currentQuestion + 1) / proverbs.length) * 100;

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

  const handleAnswerSelect = (answer: string) => {
    const isCorrect = answer === proverb.correctEnding;
    
    console.log('Verificando:', {
      seleccionada: answer,
      correcta: proverb.correctEnding,
      esCorrecta: isCorrect
    });
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setAnswers([...answers, { correct: isCorrect }]);
  };

  const handleContinue = () => {
    if (isLastQuestion) {
      const correctCount = answers.filter(a => a.correct).length;
      navigate('/proverbs/results', {
        state: {
          correct: correctCount,
          total: proverbs.length
        }
      });
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setShowFeedback(false);
      setVoiceModeActive(false);
      setVoiceError(null);
      setListening(false);
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
      const transcript = normalizeText(lastResult[0].transcript);
      
      if (lastResult.isFinal) {
        let matchedOption: string | null = null;

        proverb.options.forEach((option: string) => {
          const normalizedOption = normalizeText(option);
          if (
            transcript.includes(normalizedOption) ||
            normalizedOption.includes(transcript) ||
            similarity(transcript, normalizedOption) > 0.6
          ) {
            matchedOption = option;
          }
        });

        if (matchedOption) {
          recognition.stop();
          handleAnswerSelect(matchedOption);
        }
      }
    };

    recognition.onerror = (event: any) => {
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

    recognition.start();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-2xl text-amber-700">Cargando refranes...</p>
        </div>
      </div>
    );
  }

  if (!proverb) return null;

  // Pantalla de feedback
  if (showFeedback && selectedAnswer) {
    const isCorrect = selectedAnswer === proverb.correctEnding;
    const fullProverb = `${proverb.firstPart} ${proverb.correctEnding}`;

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full mb-6 mx-auto ${
                isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {isCorrect ? (
                  <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={1.5} />
                ) : (
                  <XCircle className="w-16 h-16 text-red-500" strokeWidth={1.5} />
                )}
              </div>
              
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
                isCorrect ? 'text-green-700' : 'text-red-600'
              }`}>
                {isCorrect ? '¡Muy bien!' : 'Casi lo logras'}
              </h2>
              
              {!isCorrect && (
                <p className="text-2xl text-amber-700 mb-4">
                  El refrán correcto es:
                </p>
              )}
              
              <div className={`rounded-2xl p-6 ${
                isCorrect ? 'bg-green-100' : 'bg-amber-100'
              }`}>
                <p className="text-2xl md:text-3xl text-amber-900 leading-relaxed">
                  "{fullProverb}"
                </p>
              </div>
            </div>
            
            <div className="max-w-md mx-auto mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg text-amber-600">
                  {isLastQuestion ? 'Resultados en...' : 'Siguiente refrán en...'}
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
            
            <div className="space-y-4 text-lg">
              <div className="flex gap-3 items-start">
                <span className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center text-xl">👆</span>
                <p className="text-amber-700">Toca la respuesta correcta en la pantalla</p>
              </div>
              
              <div className="flex gap-3 items-start">
                <span className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">🎤</span>
                <p className="text-amber-700">Opcional: activa el micrófono para hablar</p>
              </div>
              
              <div className="flex gap-3 items-start">
                <span className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">💡</span>
                <p className="text-amber-700">Usa la pista si necesitas ayuda</p>
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

      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md border-b border-amber-200 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/menu')}
              className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
              aria-label="Volver al menú"
            >
              <ArrowLeft className="w-6 h-6 text-amber-800" />
            </button>
            
            <h1 className="text-xl font-bold text-amber-900 flex-1">
              Completar refranes
            </h1>
            
            <div className="bg-amber-100 px-4 py-2 rounded-xl">
              <span className="text-lg font-bold text-amber-800">
                {currentQuestion + 1} / {proverbs.length}
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

      <main className="max-w-3xl mx-auto px-4 py-6">
        
        {/* Pregunta */}
        <div className="text-center mb-6">
          <p className="text-xl text-amber-700 mb-3 font-medium">
            ¿Cómo termina este refrán?
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-amber-200">
            <p className="text-3xl md:text-4xl text-amber-900 font-medium leading-relaxed">
              "{proverb.firstPart}"
            </p>
          </div>
        </div>

        {/* Pista */}
        {showHint && proverb.hint && (
          <div className="bg-blue-50 rounded-xl p-5 mb-6 border-2 border-blue-200">
            <div className="flex gap-3 items-start">
              <Lightbulb className="w-7 h-7 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg font-bold text-blue-800 mb-1">Pista:</p>
                <p className="text-xl text-blue-700 leading-relaxed">{proverb.hint}</p>
              </div>
            </div>
          </div>
        )}

        {/* Opciones de respuesta - SIEMPRE HABILITADAS */}
        <div className="space-y-3 mb-8">
          {proverb.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className="w-full bg-white rounded-xl p-5 shadow-md border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 active:scale-[0.99] hover:shadow-lg transition-all text-left"
            >
              <p className="text-xl text-amber-900">{option}</p>
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

        {/* Botón pista */}
        {!showHint && proverb.hint && (
          <div className="text-center">
            <button
              onClick={() => setShowHint(true)}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-3"
            >
              <Lightbulb className="w-6 h-6" />
              Ver pista
            </button>
          </div>
        )}
        
      </main>
    </div>
  );
}