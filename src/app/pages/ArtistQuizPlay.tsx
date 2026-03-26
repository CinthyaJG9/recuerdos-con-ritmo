import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Lightbulb, Home, Loader2, Calendar, 
  CheckCircle, XCircle, Sparkles, Volume2, VolumeX
} from 'lucide-react';
import { generateArtistQuestions, ArtistQuestion } from '../data/artistQuizService';
import { hintService } from '../data/hintService';
import { useVoice } from '../../context/VoiceContext';
import { ProgressIndicator } from '../components/ProgressIndicator';

export function ArtistQuizPlay() {
  const navigate = useNavigate();
  const { voiceEnabled, toggleVoice, speak, isToggling } = useVoice();
  const [questions, setQuestions] = useState<ArtistQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);
  
  // Estados para pistas
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [hintCache, setHintCache] = useState<Record<string, string>>({});
  
  // Mensajes de bienvenida
  const welcomeMessages = [
    "Vamos a jugar a adivinar quién cantaba cada canción. Te daré pistas si las necesitas.",
    "¿Listo para el juego? Te voy a mostrar canciones y tú eliges quién las cantaba. Empecemos.",
    "Prepárate para recordar grandes artistas. Aquí tienes la primera canción."
  ];
  
  // Mensajes al responder
  const correctMessages = [
    "Muy bien. Así es, esa canción la cantaba",
    "Excelente. Tienes buena memoria musical.",
    "Correcto. Sabes quién es ese artista."
  ];
  
  const incorrectMessages = [
    "Casi. La respuesta correcta era",
    "No te preocupes. Era",
    "Estuviste cerca. El artista correcto es"
  ];
  
  // Cargar preguntas
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const generatedQuestions = await generateArtistQuestions(5);
        setQuestions(generatedQuestions);
      } catch (error) {
        console.error("Error cargando preguntas:", error);
        setError("No se pudieron cargar las preguntas.");
        
        const { getSampleArtistQuestions } = await import('../data/artistQuizService');
        setQuestions(getSampleArtistQuestions());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, []);
  
  // Bienvenida al cargar el juego
  useEffect(() => {
    if (!isLoading && questions.length > 0 && voiceEnabled && !hasSpokenWelcome && !isToggling) {
      const timer = setTimeout(() => {
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        speak(randomMessage);
        setHasSpokenWelcome(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, questions, voiceEnabled]);
  
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
    setAiHint(null);
    setShowHint(false);
  }, [currentQuestion]);

  // PRECARGADO DE PISTAS
  useEffect(() => {
    const preloadHints = async () => {
      if (!questions.length || !questions[currentQuestion]) return;
      
      const currentQ = questions[currentQuestion];
      const cacheKey = `${currentQ.songTitle}-${currentQ.correctArtist}`;
      
      if (!hintCache[cacheKey]) {
        console.log(`Precargando pista para: "${currentQ.songTitle}"`);
        try {
          const res = await hintService.getArtistHint(
            currentQ.songTitle,
            currentQ.options,
            currentQ.correctArtist,
            currentQ.decade,
            currentQ.year
          );
          setHintCache(prev => ({ ...prev, [cacheKey]: res.hint }));
        } catch (error) {
          console.error('Error precargando pista:', error);
        }
      }
    };

    if (questions.length > 0) preloadHints();
  }, [currentQuestion, questions]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-16 w-16 text-amber-600 mx-auto mb-4" />
          <p className="text-2xl text-amber-700">Buscando canciones...</p>
        </div>
      </div>
    );
  }
  
  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-amber-700">{error || "No hay preguntas disponibles"}</p>
          <button
            onClick={() => navigate('/menu')}
            className="mt-6 px-8 py-4 bg-amber-600 text-white text-xl rounded-xl shadow-lg hover:bg-amber-700 transition-all"
          >
            Volver al menú
          </button>
        </div>
      </div>
    );
  }
  
  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  const handleAnswerSelect = (answer: string) => {
    const correct = answer === question.correctArtist;
    setIsCorrect(correct);
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setAnswers([...answers, { correct }]);
    
    // Voz al responder
    if (voiceEnabled) {
      if (correct) {
        const randomMsg = correctMessages[Math.floor(Math.random() * correctMessages.length)];
        speak(`${randomMsg} ${question.correctArtist}.`);
      } else {
        const randomMsg = incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)];
        speak(`${randomMsg} ${question.correctArtist}.`);
      }
    }
  };
  
  const handleContinue = () => {
    if (isLastQuestion) {
      const correctCount = answers.filter(a => a.correct).length;
      navigate('/artist-quiz/results', { 
        state: { 
          correct: correctCount,
          total: questions.length 
        } 
      });
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setShowFeedback(false);
      setIsCorrect(false);
      setAiHint(null);
    }
  };

  // Función para generar pista
  const generateHint = async () => {
    if (!question) return;
    
    const cacheKey = `${question.songTitle}-${question.correctArtist}`;
    
    if (hintCache[cacheKey]) {
      setAiHint(hintCache[cacheKey]);
      setShowHint(true);
      return;
    }
    
    setIsGeneratingHint(true);
    
    try {
      const response = await hintService.getArtistHint(
        question.songTitle,
        question.options,
        question.correctArtist,
        question.decade,
        question.year
      );
      
      setHintCache(prev => ({ ...prev, [cacheKey]: response.hint }));
      setAiHint(response.hint);
      setShowHint(true);
    } catch (error) {
      console.error('Error generando pista:', error);
      setAiHint(`El artista empieza con "${question.correctArtist.charAt(0)}"`);
      setShowHint(true);
    } finally {
      setIsGeneratingHint(false);
    }
  };
  
  if (showFeedback && selectedAnswer) {
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
                {isCorrect ? 'Muy bien' : 'Casi lo logras'}
              </h2>
              
              {isCorrect ? (
                <p className="text-xl text-amber-700 mb-4">
                  Así es, "{question.songTitle}" la cantaba
                </p>
              ) : (
                <p className="text-xl text-amber-700 mb-4">
                  Esta canción la interpretaba:
                </p>
              )}
              
              <div className={`rounded-xl p-6 ${
                isCorrect ? 'bg-green-100' : 'bg-amber-100'
              }`}>
                <p className="text-2xl md:text-3xl font-bold text-amber-900">
                  {question.correctArtist}
                </p>
                {question.decade && (
                  <p className="text-lg text-amber-600 mt-2 flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Década de los {question.decade}
                    {question.year && ` • ${question.year}`}
                  </p>
                )}
              </div>
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
              onClick={() => navigate('/menu')}
              className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
              aria-label="Volver al menú"
            >
              <ArrowLeft className="w-6 h-6 text-amber-800" />
            </button>
            
            <h1 className="text-xl font-bold text-amber-900 flex-1">
              ¿Quién cantaba?
            </h1>
            
            <div className="bg-amber-100 px-4 py-2 rounded-xl flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-700" />
              <span className="text-lg font-bold text-amber-800">
                {question.decade}
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
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <p className="text-xl text-amber-700 mb-3">
            ¿Quién cantaba esta canción?
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-amber-200">
            <p className="text-2xl md:text-3xl text-amber-900 font-medium">
              "{question.songTitle}"
            </p>
          </div>
        </div>
        
        {/* Pista */}
        {showHint && aiHint && (
          <div className="bg-purple-50 rounded-xl p-5 mb-6 border-2 border-purple-200">
            <div className="flex gap-3 items-start">
              <Sparkles className="w-7 h-7 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg font-bold text-purple-800 mb-1">
                  Pista:
                </p>
                <p className="text-xl text-purple-700">
                  {aiHint}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className="w-full bg-white rounded-xl p-6 shadow-md border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 active:scale-[0.99] transition-all text-left"
            >
              <p className="text-xl text-amber-900 font-medium">{option}</p>
            </button>
          ))}
        </div>
        
        {/* Botón de pista */}
        {!showHint && (
          <div className="text-center">
            <button
              onClick={generateHint}
              disabled={isGeneratingHint}
              className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingHint ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Cargando...
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