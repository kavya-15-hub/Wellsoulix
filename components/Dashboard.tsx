
import React from 'react';
import { UserStats } from '../types';
import { Clock, Target, Star, Brain, TrendingUp, Sparkles, MessageSquare, ChevronRight, BarChart2 } from 'lucide-react';

export const Dashboard: React.FC<{ stats: UserStats }> = ({ stats }) => {
  // Mock trend data: 1-10 scale over 7 days
  const sentimentTrend = [4, 7, 5, 8, 9, 6, 8];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-12 h-full overflow-y-auto custom-scroll space-y-12 bg-white rounded-[40px]">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-[#1e293b] flex items-center gap-4 tracking-tight">Weekly Insights <BarChart2 size={36} className="text-[#9333ea]" /></h2>
          <p className="text-slate-400 font-bold text-lg mt-1">Great to see you, friend!</p>
        </div>
        <div className="text-right">
          <p className="text-[52px] font-black text-[#1e293b] leading-none">{stats.stars} ★</p>
          <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mt-2">TOTAL STARS</p>
        </div>
      </div>

      {/* Rank Progress */}
      <div className="bg-[#fff9e6] border border-[#feeebf] rounded-[40px] p-10 relative overflow-hidden shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-[12px] font-black text-[#854d0e] uppercase tracking-widest mb-2">CURRENT RANK</p>
            <h3 className="text-4xl font-black text-[#854d0e] flex items-center gap-4">Novice 🎖️</h3>
            <p className="text-lg font-black text-[#a16207] mt-1">45 stars to next level!</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-black text-[#854d0e] uppercase tracking-widest">Progress</p>
            <p className="text-3xl font-black text-[#854d0e]">10%</p>
          </div>
        </div>
        <div className="h-6 bg-white/50 rounded-full overflow-hidden p-1.5 shadow-inner">
          <div className="h-full bg-[#facc15] w-[10%] rounded-full shadow-sm" />
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-3 gap-8">
        <InsightCard icon={<Clock size={28} />} label="FOCUS TIME" value={`${stats.focusMinutes} mins`} bonus="+20 ⭐️" color="text-[#0d9488]" bg="bg-[#ccfbf1]" />
        <InsightCard icon={<Target size={28} />} label="TASKS CRUSHED" value={stats.tasksCompleted} bonus="+5 ⭐️" color="text-[#4f46e5]" bg="bg-[#e0e7ff]" />
        <InsightCard icon={<Brain size={28} />} label="PROBLEMS SOLVED" value={stats.quizzesSolved} bonus="+2 ⭐️" color="text-[#2563eb]" bg="bg-[#dbeafe]" />
      </div>

      {/* Trend Graph - Now with Dynamic Colors */}
      <div className="bg-white border border-slate-100 rounded-[48px] p-12 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
            <Sparkles size={20} className="text-[#9333ea]" /> Emotional Trend
          </h4>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00a396]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low/Neutral</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-4 px-4 relative">
          {/* Baseline Indicator */}
          <div className="absolute left-0 right-0 border-t border-dashed border-slate-100 top-1/2 z-0" />
          
          {sentimentTrend.map((val, idx) => {
            const isPositive = val >= 6;
            const height = `${val * 10}%`;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3 group z-10">
                <div 
                  style={{ height }}
                  className={`w-full rounded-2xl transition-all duration-500 shadow-lg ${
                    isPositive 
                      ? 'bg-[#00a396] shadow-teal-500/10 group-hover:bg-[#0d9488]' 
                      : 'bg-[#8b5cf6] shadow-purple-500/10 group-hover:bg-[#7c3aed]'
                  }`}
                />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{days[idx]}</span>
              </div>
            );
          })}
        </div>
        <p className="text-center text-[10px] font-black text-slate-300 mt-10 uppercase tracking-[0.3em]">Recent conversation sentiment (Low to Positive)</p>
      </div>

      <div className="grid grid-cols-3 gap-12">
        <div className="space-y-8">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><TrendingUp size={20} /> Vibe Check</h4>
          <div className="space-y-5">
             <ProgressBar label="Comfort" val={1} total={10} color="bg-[#9333ea]" />
             <ProgressBar label="Cheer" val={1} total={10} color="bg-[#00a396]" />
             <ProgressBar label="Calm" val={1} total={10} color="bg-[#06b6d4]" />
             <ProgressBar label="Study Buddy" val={1} total={10} color="bg-[#2563eb]" />
          </div>
        </div>

        <div className="space-y-8">
           <div className="flex items-center justify-between">
             <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><MessageSquare size={20} /> Community Pulse</h4>
             <span className="text-[10px] font-black text-[#00a396] flex items-center gap-1">• LIVE</span>
           </div>
           <div className="space-y-5">
             <PulseMsg user="CodeNinja" msg="earned 20 stars." />
             <PulseMsg user="FocusBot" msg="earned 50 stars in Daily Quiz!" />
             <PulseMsg user="StudyVibes" msg="completed a 45m session." />
           </div>
        </div>

        <div className="space-y-8">
           <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><Brain size={20} /> Career & Exam Prep</h4>
           <div className="bg-[#f5f3ff] border border-purple-100 rounded-[32px] p-8 shadow-sm">
              <h5 className="font-black text-purple-800 text-base flex items-center gap-3 mb-3"><Sparkles size={18} /> Interview Prep</h5>
              <p className="text-xs font-bold text-purple-600 leading-relaxed">Practice mock interviews and earn big stars with Career Coach Mode!</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const InsightCard = ({ icon, label, value, bonus, color, bg }: any) => (
  <div className={`p-8 rounded-[40px] border border-slate-100 bg-white shadow-sm flex flex-col items-center text-center hover:shadow-xl transition-all cursor-default`}>
    <div className={`${bg} ${color} w-16 h-16 rounded-[24px] flex items-center justify-center mb-5 shadow-sm`}>{icon}</div>
    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-black text-slate-800 mb-1">{value}</div>
    <div className={`text-xs font-black ${color}`}>{bonus}</div>
  </div>
);

const ProgressBar = ({ label, val, total, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-tighter">
      <span>{label}</span>
      <span>{val} turns</span>
    </div>
    <div className="h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner">
      <div className={`h-full ${color} w-[${(val/total)*100}%] rounded-full`} style={{width: `${(val/total)*100}%`}} />
    </div>
  </div>
);

const PulseMsg = ({ user, msg }: any) => (
  <div className="flex items-center gap-4">
    <div className="bg-[#fff9e6] p-2 rounded-xl text-[#facc15] shadow-sm"><Star size={16} fill="currentColor" /></div>
    <div className="text-sm">
      <span className="font-black text-slate-800">{user}</span>
      <span className="text-slate-500 font-bold ml-2">{msg}</span>
    </div>
  </div>
);
