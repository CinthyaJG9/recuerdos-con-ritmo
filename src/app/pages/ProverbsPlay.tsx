import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Lightbulb, Home } from 'lucide-react';
import { proverbs } from '../data/proverbs';
import { ProgressIndicator } from '../components/ProgressIndicator';

export function ProverbsPlay() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const proverb = proverbs[currentQuestion];
  const isLastQuestion = currentQuestion === proverbs.length - 1;
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const isCorrect = answer === proverb.correctEnding;
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
    }
  };
  
  if (showFeedback && selectedAnswer) {
    const isCorrect = selectedAnswer === proverb.correctEnding;
    const fullProverb = `${proverb.firstPart} ${proverb.correctEnding}`;
    
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
                  
                  <h2 className="text-[36px] mb-6 text-olive-green">
                    ¡Muy bien!
                  </h2>
                  
                  <div className="bg-olive-green/10 rounded-xl p-6">
                    <p className="text-[24px] text-olive-green-dark leading-relaxed">
                      {fullProverb}
                    </p>
                  </div>
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
                    El refrán completo es:
                  </p>
                  
                  <div className="bg-olive-green/10 rounded-xl p-6">
                    <p className="text-[24px] text-olive-green-dark leading-relaxed">
                      {fullProverb}
                    </p>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                className="bg-olive-green text-warm-white hover:bg-olive-green-dark shadow-md rounded-xl transition-all duration-200 active:scale-95 px-10 py-5 min-h-[70px] text-[22px]"
              >
                {isLastQuestion ? 'Ver resultados' : 'Siguiente refrán'}
              </button>
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
              onClick={() => navigate('/menu')}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-warm-beige-dark transition-colors flex-shrink-0"
              aria-label="Volver al menú"
            >
              <Home className="w-7 h-7 text-wine" strokeWidth={2} />
            </button>
            
            <h1 className="text-[24px] text-warm-black">
              Completar refranes
            </h1>
          </div>
          
          <ProgressIndicator 
            current={currentQuestion + 1} 
            total={proverbs.length} 
          />
        </div>
      </div>
      
      {/* Contenido de la pregunta */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Inicio del refrán */}
        <div className="text-center mb-8">
          <p className="text-[22px] text-warm-gray mb-4">
            ¿Cómo termina este refrán?
          </p>
          
          <div className="bg-card rounded-2xl p-8 shadow-lg">
            <p className="text-[32px] text-wine leading-relaxed">
              {proverb.firstPart}
            </p>
          </div>
        </div>
        
        {/* Pista */}
        {showHint && proverb.hint && (
          <div className="bg-olive-green/10 rounded-xl p-6 mb-8 border-2 border-olive-green/20 animate-in fade-in duration-200">
            <div className="flex gap-4 items-start">
              <Lightbulb className="w-7 h-7 text-olive-green flex-shrink-0 mt-1" strokeWidth={2} />
              <div>
                <p className="text-[18px] text-olive-green mb-1">Pista:</p>
                <p className="text-[22px] text-olive-green-dark leading-relaxed">
                  {proverb.hint}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Opciones de respuesta */}
        <div className="space-y-4 mb-8">
          {proverb.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className="w-full bg-card rounded-xl p-7 shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-olive-green/30 active:scale-98"
            >
              <p className="text-[24px] text-warm-black leading-relaxed">
                {option}
              </p>
            </button>
          ))}
        </div>
        
        {/* Botón de pista */}
        {!showHint && proverb.hint && (
          <div className="text-center">
            <button
              onClick={() => setShowHint(true)}
              className="bg-transparent border-2 border-olive-green text-olive-green hover:bg-olive-green hover:text-warm-white rounded-xl transition-all duration-200 active:scale-95 px-8 py-4 min-h-[60px] text-[20px] inline-flex items-center gap-3"
            >
              <Lightbulb className="w-6 h-6" strokeWidth={2} />
              Ver pista
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
