import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Lightbulb, X } from 'lucide-react';
import { songs } from '../data/songs';
import { Button } from '../components/Button';
import { ProgressIndicator } from '../components/ProgressIndicator';

export function CompleteLyrics() {
  const navigate = useNavigate();
  const { songId } = useParams<{ songId: string }>();
  const song = songs.find(s => s.id === songId);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  
  if (!song) {
    navigate('/songs');
    return null;
  }
  
  const currentLyric = song.lyrics[currentQuestion];
  const isLastQuestion = currentQuestion === song.lyrics.length - 1;
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const isCorrect = answer === currentLyric.missing;
    setAnswers([...answers, { correct: isCorrect }]);
  };
  
  const handleContinue = () => {
    if (isLastQuestion) {
      const correctCount = answers.filter(a => a.correct).length;
      navigate('/summary', { 
        state: { 
          song: song.title,
          correct: correctCount,
          total: song.lyrics.length 
        } 
      });
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setShowFeedback(false);
    }
  };
  
  if (showFeedback && selectedAnswer) {
    const isCorrect = selectedAnswer === currentLyric.missing;
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-card rounded-2xl p-8 shadow-xl">
            {isCorrect ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-olive-green/10 rounded-full mb-6">
                    <svg className="w-12 h-12 text-olive-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h2 className="text-[36px] mb-4 text-olive-green">
                    ¡Muy bien!
                  </h2>
                  
                  <p className="text-[22px] text-warm-gray leading-relaxed">
                    Has elegido la respuesta correcta
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-deep-blue/10 rounded-full mb-6">
                    <svg className="w-12 h-12 text-deep-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <h2 className="text-[36px] mb-4 text-deep-blue">
                    Casi lo logras
                  </h2>
                  
                  <p className="text-[22px] text-warm-gray leading-relaxed mb-6">
                    La respuesta correcta es:
                  </p>
                  
                  <div className="bg-olive-green/10 rounded-xl p-6 mb-4">
                    <p className="text-[26px] text-olive-green-dark">
                      "{currentLyric.missing}"
                    </p>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-center">
              <Button onClick={handleContinue} variant="primary">
                {isLastQuestion ? 'Ver resultados' : 'Continuar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card shadow-sm border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(`/game-type/${songId}`)}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-warm-beige-dark transition-colors flex-shrink-0"
              aria-label="Volver"
            >
              <ArrowLeft className="w-7 h-7 text-wine" strokeWidth={2} />
            </button>
            
            <div className="flex-1">
              <h1 className="text-[24px] text-warm-black leading-tight">
                {song.title}
              </h1>
            </div>
          </div>
          
          <ProgressIndicator 
            current={currentQuestion + 1} 
            total={song.lyrics.length} 
          />
        </div>
      </div>
      
      {/* Contenido de la pregunta */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Fragmento de la canción */}
        <div className="bg-card rounded-2xl p-8 shadow-lg mb-8">
          <p className="text-[26px] text-warm-black leading-relaxed text-center">
            {currentLyric.fragment.split('_____').map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index < currentLyric.fragment.split('_____').length - 1 && (
                  <span className="inline-block mx-2 px-6 py-1 border-b-4 border-wine/30 border-dashed min-w-[120px] text-center">
                    <span className="text-wine">____</span>
                  </span>
                )}
              </React.Fragment>
            ))}
          </p>
        </div>
        
        {/* Pista */}
        {showHint && (
          <div className="bg-deep-blue/10 rounded-xl p-6 mb-8 border-2 border-deep-blue/20 animate-in fade-in duration-200">
            <div className="flex gap-4 items-start">
              <Lightbulb className="w-7 h-7 text-deep-blue flex-shrink-0 mt-1" strokeWidth={2} />
              <div>
                <p className="text-[18px] text-deep-blue mb-1">Pista:</p>
                <p className="text-[22px] text-deep-blue-dark leading-relaxed">
                  {currentLyric.hint}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Opciones de respuesta */}
        <div className="space-y-4 mb-8">
          {currentLyric.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className="w-full bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-wine/30 active:scale-98"
            >
              <p className="text-[24px] text-warm-black">
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
              size="medium"
              className="inline-flex items-center gap-3"
            >
              <Lightbulb className="w-6 h-6" strokeWidth={2} />
              Ver pista
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
