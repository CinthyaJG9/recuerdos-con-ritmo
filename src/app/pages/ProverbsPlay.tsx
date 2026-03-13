import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Home, Mic, HelpCircle, Volume2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
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
  const [useVoiceMode, setUseVoiceMode] = useState(true);
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
    
    console.log('🔍 Verificando:', {
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
      setUseVoiceMode(true);
      setVoiceError(null);
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
    recognition.interimResults = false;

    setListening(true);
    setVoiceError(null);

    recognition.onresult = (event: any) => {
      const transcript = normalizeText(event.results[0][0].transcript);
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
      } else {
        setVoiceError("No entendí bien. Intenta decir una de las opciones.");
        setListening(false);
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
            <h3 className="text-2xl font-bold text-amber-900 mb-4">✨ Cómo jugar:</h3>
            
            <div className="space-y-4 text-lg">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">🎤</div>
                <p className="text-amber-700">Presiona el micrófono para responder con voz</p>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">🗣️</div>
                <p className="text-amber-700">Habla claramente una de las opciones</p>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">💡</div>
                <p className="text-amber-700">Usa la pista si necesitas ayuda</p>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">✋</div>
                <p className="text-amber-700">Si no puedes hablar, usa los botones</p>
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
          
          {/* Barra de progreso personalizada */}
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

        {/* Opciones de respuesta */}
        <div className="space-y-3 mb-8">
          {proverb.options.map((option: string, index: number) => (
            <button
              key={index}
              disabled={useVoiceMode}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full bg-white rounded-xl p-5 shadow-md border-2 transition-all text-left ${
                useVoiceMode
                  ? "opacity-50 cursor-not-allowed border-gray-200"
                  : "border-amber-200 hover:border-amber-400 hover:bg-amber-50 active:scale-[0.99] hover:shadow-lg"
              }`}
            >
              <p className="text-xl text-amber-900">{option}</p>
            </button>
          ))}
        </div>

        {/* Área de voz */}
        <div className="flex flex-col items-center mb-8 p-6 bg-white rounded-2xl shadow-md border border-amber-200">
          
          <div className="relative mb-4">
            {listening && (
              <>
                <span className="absolute inset-0 rounded-full bg-orange-300 animate-ping opacity-70"></span>
                <span className="absolute inset-0 rounded-full bg-orange-400 animate-pulse opacity-50"></span>
              </>
            )}
            
            <button
              onClick={startVoiceRecognition}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all ${
                listening
                  ? "bg-orange-400 scale-110"
                  : "bg-orange-500 hover:bg-orange-600 hover:scale-105"
              }`}
              aria-label="Responder con voz"
            >
              <Mic className="w-10 h-10 text-white" />
            </button>
          </div>
          
          <div className="text-center">
            <p className={`text-xl font-medium mb-2 ${
              listening ? 'text-orange-600' : voiceError ? 'text-red-600' : 'text-amber-700'
            }`}>
              {listening ? "Escuchando... habla claro" : 
               voiceError || "Responde con voz o elige una opción"}
            </p>
            
            {listening && (
              <p className="text-lg text-amber-500 animate-pulse">
                Di una de las opciones en voz alta
              </p>
            )}
          </div>

          {/* Botones para cambiar modo */}
          <div className="flex gap-4 mt-4">
            {useVoiceMode ? (
              <button
                onClick={() => setUseVoiceMode(false)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-medium rounded-xl transition-all"
              >
                Usar botones
              </button>
            ) : (
              <button
                onClick={() => setUseVoiceMode(true)}
                className="px-6 py-3 bg-orange-100 hover:bg-orange-200 text-orange-800 text-lg font-medium rounded-xl transition-all flex items-center gap-2"
              >
                <Mic className="w-5 h-5" />
                Activar voz
              </button>
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