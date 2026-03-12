import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Mic, Home } from 'lucide-react';

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

  const [useVoiceMode, setUseVoiceMode] = useState(true);
  const [listening, setListening] = useState(false);

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
  }, [currentQuestion]);

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <p className="text-2xl text-amber-700">Preparando el juego...</p>
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
      setUseVoiceMode(true);

    }

  };

  const startVoiceRecognition = () => {

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

      const transcript = normalizeText(event.results[0][0].transcript);

      let matchedOption: string | null = null;

      currentLyric.options.forEach((option: string) => {

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
        alert("No entendí bien. Intenta decir una de las opciones.");
      }

    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();

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

              <button
                onClick={handleContinue}
                className="mt-6 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white text-xl font-bold rounded-xl"
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

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">

          <p className="text-3xl text-amber-900 text-center">
            {currentLyric.fragment}
          </p>

        </div>

        {showHint && currentLyric.hint && (

          <div className="bg-blue-50 rounded-xl p-5 mb-6 border-2 border-blue-200">

            <div className="flex gap-3 items-start">

              <Lightbulb className="w-7 h-7 text-blue-600 flex-shrink-0 mt-1" />

              <div>

                <p className="text-lg font-bold text-blue-800 mb-1">
                  Pista:
                </p>

                <p className="text-xl text-blue-700">
                  {currentLyric.hint}
                </p>

              </div>

            </div>

          </div>

        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          {currentLyric.options.map((option: string, index: number) => (

            <button
              key={index}
              disabled={useVoiceMode}
              onClick={() => handleAnswerSelect(option)}
              className={`bg-white rounded-xl p-6 shadow-md border-2 transition-all ${
                useVoiceMode
                  ? "opacity-50 cursor-not-allowed border-amber-200"
                  : "border-amber-200 hover:border-amber-400 hover:bg-amber-50"
              }`}
            >

              <p className="text-xl text-amber-900 font-medium">
                {option}
              </p>

            </button>

          ))}

        </div>

        <div className="flex flex-col items-center mb-6">

          <div className="relative">

            {listening && (
              <span className="absolute inset-0 rounded-full bg-orange-300 animate-ping opacity-70"></span>
            )}

            <button
              onClick={startVoiceRecognition}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                listening
                  ? "bg-orange-400 scale-110"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >

              <Mic className="w-8 h-8 text-white" />

            </button>

          </div>

          <p className="mt-3 text-lg text-amber-700">
            {listening ? "Escuchando..." : "Responder con voz"}
          </p>

          <p
            onClick={() => setUseVoiceMode(false)}
            className="mt-2 text-amber-700 cursor-pointer hover:underline"
          >
            No puedo hablar ahora
          </p>

        </div>

        {!showHint && (
          <div className="text-center">
            <button
              onClick={() => setShowHint(true)}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-xl rounded-xl"
            >
              ¿Necesitas una pista?
            </button>
          </div>
        )}

      </main>

    </div>

  );
}