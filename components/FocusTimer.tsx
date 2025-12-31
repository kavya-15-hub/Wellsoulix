
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Timer, Pause } from 'lucide-react';

interface FocusTimerProps {
  onComplete: (minutes: number) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ onComplete }) => {
  const [duration, setDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [workingOn, setWorkingOn] = useState('');

  const toggleTimer = () => setIsActive(!isActive);
  
  const handleDurationChange = (mins: number) => {
    setDuration(mins);
    setSeconds(mins * 60);
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(duration * 60);
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      onComplete(duration);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onComplete, duration]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">🍅</span>
        <h3 className="text-xl font-black text-[#1e293b]">Focus Timer</h3>
      </div>

      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-1 px-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Goal</label>
          <Timer size={14} className="text-slate-200" />
        </div>
        <input 
          type="text" 
          value={workingOn}
          onChange={(e) => setWorkingOn(e.target.value)}
          placeholder="What's the goal?" 
          className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-xs text-slate-600 outline-none border border-slate-100 placeholder:text-slate-300"
        />
      </div>

      <div className="flex gap-2 mb-6">
        {[25, 45].map(m => (
          <button 
            key={m} 
            onClick={() => handleDurationChange(m)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
              duration === m ? 'bg-teal-50 border-teal-200 text-teal-600' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
            }`}
          >
            {m}m
          </button>
        ))}
      </div>
      
      <div className="text-5xl font-black text-[#00a396] mb-8 font-mono tracking-tighter">
        {formatTime(seconds)}
      </div>

      <div className="flex gap-6">
        <button
          onClick={toggleTimer}
          className="w-14 h-14 bg-[#00a396] text-white rounded-full shadow-lg shadow-teal-500/10 flex items-center justify-center hover:scale-105 transition-all"
        >
          {isActive ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="translate-x-0.5" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-14 h-14 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};
