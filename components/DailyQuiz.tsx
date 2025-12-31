
import React, { useState } from 'react';
import { Trophy, Star, CheckCircle2, XCircle } from 'lucide-react';
import { DAILY_QUIZZES } from '../constants';

interface DailyQuizProps {
  onCorrect: () => void;
}

export const DailyQuiz: React.FC<DailyQuizProps> = ({ onCorrect }) => {
  const [quizIdx] = useState(Math.floor(Math.random() * DAILY_QUIZZES.length));
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const quiz = DAILY_QUIZZES[quizIdx];

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setIsSubmitted(true);
    if (selected === quiz.correctAnswer) {
      onCorrect();
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-amber-600">
        <div className="bg-amber-50 p-2 rounded-lg">
          <Trophy size={18} />
        </div>
        <h3 className="font-extrabold uppercase tracking-wider text-xs">Daily Surprise Quiz</h3>
      </div>
      
      <p className="text-slate-900 font-bold mb-4 leading-relaxed">{quiz.question}</p>
      
      <div className="space-y-2 mb-6">
        {quiz.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={isSubmitted}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
              selected === i 
                ? isSubmitted 
                  ? i === quiz.correctAnswer 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-red-500 bg-red-50 text-red-700'
                  : 'border-purple-400 bg-purple-50 text-purple-700'
                : 'border-slate-50 hover:border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{opt}</span>
              {isSubmitted && i === quiz.correctAnswer && <CheckCircle2 size={16} className="text-green-500" />}
              {isSubmitted && selected === i && i !== quiz.correctAnswer && <XCircle size={16} className="text-red-500" />}
            </div>
          </button>
        ))}
      </div>

      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full bg-gradient-to-r from-[#008080] to-[#800080] text-white font-bold py-3.5 rounded-xl shadow-lg disabled:opacity-40 transition-all flex items-center justify-center gap-2 text-sm"
        >
          Check Answer
        </button>
      ) : (
        <div className={`p-4 rounded-xl text-center font-black text-sm flex items-center justify-center gap-2 ${
          selected === quiz.correctAnswer ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
        }`}>
          {selected === quiz.correctAnswer ? (
            <>+20 Stars Earned! <Star size={16} fill="currentColor" /></>
          ) : (
            "No worries! Come back tomorrow."
          )}
        </div>
      )}
    </div>
  );
};
