
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Heart, Sparkles, Wind, BookOpen, Briefcase, Zap, Brain, 
  Send, User, BarChart2, ShieldAlert, X, Star, Settings, Mic,
  ChevronRight, LayoutDashboard, Smile, Meh, Frown, Menu,
  Image as ImageIcon, Link as LinkIcon, FileText, Paperclip,
  FileCode, File
} from 'lucide-react';
import { AppMode, UserStats, Message, Task, Attachment } from './types';
import { MODE_CONFIGS } from './constants';
import { FocusTimer } from './components/FocusTimer';
import { VibePlayer } from './components/VibePlayer';
import { DailyQuiz } from './components/DailyQuiz';
import { Dashboard } from './components/Dashboard';
import { MicroTasks } from './components/MicroTasks';
import { SettingsModal } from './components/SettingsModal';
import { generateWellsoulixResponse } from './services/geminiService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'login' | 'app'>('login');
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [nickname, setNickname] = useState('');
  const [moodLevel, setMoodLevel] = useState(5);
  const [moodTag, setMoodTag] = useState('');
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.COMFORT);
  
  const [messagesByMode, setMessagesByMode] = useState<Record<AppMode, Message[]>>({
    [AppMode.COMFORT]: [],
    [AppMode.CHEER]: [],
    [AppMode.CALM]: [],
    [AppMode.STUDY_BUDDY]: [],
    [AppMode.CAREER_COACH]: [],
    [AppMode.SPIRIT]: [],
    [AppMode.AI_MENTOR]: []
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<Attachment | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>({
    stars: 5,
    level: 1,
    focusMinutes: 0,
    tasksCompleted: 0,
    quizzesSolved: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messagesByMode, activeMode, isTyping]);

  const handleStartJourney = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      setCurrentStep('app');
      setShowMoodCheck(true);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const base64 = await blobToBase64(file);
      setPendingAttachment({ type: 'image', data: base64, mimeType: file.type });
    } else {
      // For documents, we try to read content if it's a text-based file
      const textFiles = ['.txt', '.md', '.json', '.js', '.ts', '.py'];
      const isTextFile = textFiles.some(ext => file.name.endsWith(ext));
      
      if (isTextFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setPendingAttachment({ 
            type: 'doc', 
            data: `[File: ${file.name}] Content Snippet: ${content.substring(0, 1000)}`,
            mimeType: 'text/plain'
          });
        };
        reader.readAsText(file);
      } else {
        setPendingAttachment({ type: 'doc', data: file.name });
      }
    }
  };

  const handleLinkAdd = () => {
    const url = prompt("Paste your link or article URL:");
    if (url) {
      setPendingAttachment({ type: 'link', data: url });
    }
  };

  const switchMode = (mode: AppMode) => {
    setShowDashboard(false);
    setActiveMode(mode);
    setShowMobileSidebar(false);
    
    const config = MODE_CONFIGS[mode];
    const welcomeMsg: Message = {
      id: `welcome-${mode}-${Date.now()}`,
      role: 'model',
      text: `Hello friend! 💜 I've switched to ${mode} mode to help you with ${config.description.toLowerCase()}. How are you feeling right now?`,
      mode: mode,
      timestamp: Date.now()
    };

    setMessagesByMode(prev => ({
      ...prev,
      [mode]: [...prev[mode], welcomeMsg]
    }));
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !pendingAttachment) return;
    const mode = activeMode;
    const attachmentToSend = pendingAttachment;
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: input, 
      timestamp: Date.now(),
      attachment: attachmentToSend || undefined
    };
    
    setMessagesByMode(prev => ({
      ...prev,
      [mode]: [...prev[mode], userMsg]
    }));
    
    setInput('');
    setPendingAttachment(null);
    setIsTyping(true);
    
    const history = messagesByMode[mode].map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    const response = await generateWellsoulixResponse(input, mode, history, attachmentToSend || undefined);
    
    setMessagesByMode(prev => ({
      ...prev,
      [mode]: [...prev[mode], {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || "I'm right here with you. How can I help further?",
        mode: mode,
        timestamp: Date.now()
      }]
    }));
    setIsTyping(false);
  };

  const handleCheckIn = () => {
    setShowMoodCheck(false);
    const mode = moodLevel > 7 ? AppMode.CHEER : moodLevel < 4 ? AppMode.COMFORT : AppMode.CALM;
    setActiveMode(mode);
    
    const checkInText = `[Check-in] Level: ${moodLevel}/10. Note: ${moodTag || 'feeling good'}.`;
    const userMsg: Message = { id: `checkin-${Date.now()}`, role: 'user', text: checkInText, timestamp: Date.now() };
    
    setMessagesByMode(prev => ({
      ...prev,
      [mode]: [
        { id: `initial-${Date.now()}`, role: 'model', text: `Welcome back, ${nickname}! 💜 Your mode is set to ${mode} based on your mood check-in.`, mode: mode, timestamp: Date.now() },
        userMsg
      ]
    }));

    setTimeout(async () => {
      setIsTyping(true);
      const response = await generateWellsoulixResponse(checkInText, mode, []);
      setMessagesByMode(prev => ({
        ...prev,
        [mode]: [...prev[mode], {
          id: `reply-${Date.now()}`,
          role: 'model',
          text: response || `I'm here for you! Let's make today productive and positive 💜.`,
          mode: mode,
          timestamp: Date.now()
        }]
      }));
      setIsTyping(false);
    }, 1000);
  };

  const WellsoulixLogo = ({ className = "text-xl" }: { className?: string }) => (
    <div className={`flex items-center gap-1.5 font-extrabold tracking-tight ${className}`}>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#008080] to-[#800080]">
        Wellsoulix
      </span>
      <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#008080] to-[#800080]">
        💜
      </span>
    </div>
  );

  const currentMessages = messagesByMode[activeMode];

  if (currentStep === 'login') {
    return (
      <div className="h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.08)] text-center transition-all">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-[#008080] to-[#800080] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
            <Sparkles size={36} fill="white" />
          </div>
          <WellsoulixLogo className="text-3xl md:text-4xl justify-center mb-2" />
          <p className="text-slate-400 mb-8 md:mb-10 text-base md:text-lg font-medium">Your academic & career companion.</p>
          
          <form onSubmit={handleStartJourney} className="space-y-6 md:space-y-8">
            <div className="text-left">
              <label className="text-sm font-semibold text-slate-500 mb-2 block">What should I call you?</label>
              <input 
                autoFocus
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-purple-200 transition-all text-lg font-medium text-slate-700"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#008080] to-[#800080] text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-100 hover:opacity-95 active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2"
            >
              Start Journey <ChevronRight size={20} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f1fcf9] overflow-hidden font-sans">
      
      <header className="md:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between z-[60]">
        <WellsoulixLogo className="text-xl" />
        <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
          <Menu size={24} />
        </button>
      </header>

      <aside className={`
        fixed inset-0 z-[100] transform transition-transform duration-300 md:relative md:translate-x-0 md:inset-auto md:z-auto
        w-64 bg-white flex flex-col p-6 border-r border-slate-100
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-8 px-2">
           <WellsoulixLogo className="text-2xl" />
           <button onClick={() => setShowSettings(true)} className="text-slate-300 hover:text-slate-500 p-1"><Settings size={20} /></button>
        </div>

        <div className="bg-[#fff9e6] rounded-2xl p-4 flex items-center gap-3 mb-8 border border-[#feeebf] shadow-sm">
          <Star size={18} className="text-[#facc15]" fill="#facc15" />
          <span className="font-bold text-slate-800 text-sm">{stats.stars} Stars</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scroll">
          <button 
            onClick={() => { setShowDashboard(true); setShowMobileSidebar(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${showDashboard ? 'bg-slate-50 text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutDashboard size={18} /> Insights
          </button>
          <div className="h-4" />
          {(Object.values(AppMode) as AppMode[]).map(mode => (
            <button 
              key={mode}
              onClick={() => switchMode(mode)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                activeMode === mode && !showDashboard ? 'bg-white shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-slate-800 ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={activeMode === mode && !showDashboard ? MODE_CONFIGS[mode].textColor : ''}>
                {getIconByMode(mode)}
              </div>
              {mode}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden md:m-3 bg-white md:rounded-[2.5rem] shadow-xl relative border border-slate-50">
        {showDashboard ? (
          <Dashboard stats={stats} />
        ) : (
          <>
            <header className="relative h-28 md:h-36 lg:h-44 flex-shrink-0 transition-all">
               <div className="absolute inset-0 overflow-hidden md:rounded-t-[2.5rem]">
                 <img src={MODE_CONFIGS[activeMode].banner} className="w-full h-full object-cover opacity-90" alt="Banner" />
                 <div className={`absolute inset-0 opacity-80 ${MODE_CONFIGS[activeMode].bgColor}`} />
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
               </div>
               <div className="absolute bottom-4 md:bottom-6 left-6 md:left-10">
                 <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">CURRENT VIBE</p>
                 <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800">{activeMode}</h1>
               </div>
            </header>

            <div className={`flex-1 overflow-y-auto px-4 md:px-8 lg:px-10 py-6 space-y-6 custom-scroll bg-gradient-to-br from-[#008080]/15 via-white to-[#800080]/15`}>
              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[80%] lg:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white ${
                      msg.role === 'user' ? 'bg-[#008080]' : 'bg-[#800080]'
                    } shadow-md`}>
                      {msg.role === 'user' ? <User size={14} className="md:w-[16px]" /> : <Zap size={14} className="md:w-[16px]" />}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`p-4 md:p-5 rounded-3xl text-sm md:text-base leading-relaxed font-medium shadow-sm border ${
                        msg.role === 'user' 
                          ? 'bg-[#008080] text-white rounded-tr-none border-[#008080]' 
                          : 'bg-white text-slate-700 rounded-tl-none border-slate-100'
                      }`}>
                        {msg.text}
                      </div>
                      
                      {msg.attachment && (
                        <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.attachment.type === 'image' && (
                            <img src={msg.attachment.data} alt="Attachment" className="max-w-[200px] rounded-2xl shadow-lg border-4 border-white" />
                          )}
                          {msg.attachment.type === 'link' && (
                            <a href={msg.attachment.data} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl text-xs font-black text-slate-800 border border-slate-100 shadow-sm hover:scale-105 transition-all">
                              <LinkIcon size={16} className="text-teal-600" /> 
                              <span className="truncate max-w-[140px]">{msg.attachment.data.replace(/^https?:\/\//, '')}</span>
                            </a>
                          )}
                          {msg.attachment.type === 'doc' && (
                            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl text-xs font-black text-slate-800 border border-slate-100 shadow-sm">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                {msg.attachment.data.includes('File:') ? <FileCode size={18} /> : <FileText size={18} />}
                              </div>
                              <span className="truncate max-w-[140px]">{msg.attachment.data.split('Content')[0].replace('[File: ', '').replace(']', '')}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 ml-11 md:ml-13">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 md:p-6 bg-white border-t border-slate-50 relative">
              {pendingAttachment && (
                <div className="absolute top-0 left-10 -translate-y-full mb-4 bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white flex items-center gap-4 animate-in slide-in-from-bottom-4">
                   {pendingAttachment.type === 'image' ? (
                     <img src={pendingAttachment.data} className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                   ) : (
                     <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                       {pendingAttachment.type === 'link' ? <LinkIcon size={24} /> : <FileText size={24} />}
                     </div>
                   )}
                   <div className="flex-1 min-w-0 pr-8">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attachment Ready</p>
                     <p className="text-sm font-bold text-slate-800 truncate">
                        {pendingAttachment.type === 'image' ? 'Visual Snippet' : pendingAttachment.data.split('Content')[0].replace('[File: ', '').replace(']', '')}
                     </p>
                   </div>
                   <button onClick={() => setPendingAttachment(null)} className="absolute top-2 right-2 p-1.5 bg-slate-100 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                     <X size={14} />
                   </button>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-100 rounded-full px-5 md:px-8 py-3 md:py-4 flex items-center gap-3 md:gap-5 shadow-inner">
                {/* Minimalist Star Upload Trigger */}
                <div className="relative group">
                  <button 
                    className="p-2 text-slate-400 hover:text-[#800080] hover:scale-110 active:scale-90 transition-all flex items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Star size={24} className="transition-transform group-hover:rotate-12" />
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 hidden group-hover:flex flex-col gap-1 bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 animate-in zoom-in-75">
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 hover:bg-slate-50 rounded-xl text-slate-600 flex items-center gap-4 whitespace-nowrap transition-colors">
                      <ImageIcon size={18} className="text-teal-600" />
                      <span className="text-[11px] font-black uppercase tracking-widest">Image</span>
                    </button>
                    <button onClick={handleLinkAdd} className="p-3 hover:bg-slate-50 rounded-xl text-slate-600 flex items-center gap-4 whitespace-nowrap transition-colors">
                      <LinkIcon size={18} className="text-blue-600" />
                      <span className="text-[11px] font-black uppercase tracking-widest">Link</span>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 hover:bg-slate-50 rounded-xl text-slate-600 flex items-center gap-4 whitespace-nowrap transition-colors">
                      <FileText size={18} className="text-purple-600" />
                      <span className="text-[11px] font-black uppercase tracking-widest">Document</span>
                    </button>
                  </div>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf,.doc,.docx,.txt,.md,.json"
                />

                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Chat in ${activeMode}...`}
                  className="flex-1 bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-300 text-sm md:text-base"
                />
                
                <button 
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-[#008080] to-[#800080] text-white p-3 rounded-full hover:opacity-95 hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-lg shadow-purple-200/50"
                >
                  <Send size={18} fill="white" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <aside className="hidden lg:flex w-[340px] xl:w-[380px] p-4 flex-col gap-4 overflow-y-auto custom-scroll shrink-0">
        <VibePlayer activeMode={activeMode} />
        <DailyQuiz onCorrect={() => setStats(s => ({ ...s, stars: s.stars + 20 }))} />
        <FocusTimer onComplete={(m) => setStats(s => ({ ...s, focusMinutes: s.focusMinutes + m }))} />
        <MicroTasks tasks={tasks} onAddTask={(t) => setTasks(prev => [...prev, {id: Date.now().toString(), text: t, completed: false}])} onToggleTask={(id) => setTasks(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t))} />
        
        <div className="bg-[#fff1f2] border border-red-50 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-[#991b1b] mb-4">
            <ShieldAlert size={24} />
            <h3 className="text-xl font-extrabold tracking-tight">Help Hub</h3>
          </div>
          <ul className="space-y-2 font-bold text-sm">
            <li className="text-[#b91c1c] flex items-center justify-between"><span>Emergency:</span> <span className="text-red-700 font-black">112</span></li>
            <li className="text-[#b91c1c] flex items-center justify-between"><span>Tele MANAS:</span> <span className="text-red-700 font-black">14416</span></li>
            <li className="text-[#b91c1c] flex items-center justify-between"><span>Kiran:</span> <span className="text-red-700 font-black text-xs">1800-599-0019</span></li>
          </ul>
        </div>
      </aside>

      {showMoodCheck && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#1e293b] text-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl text-center">
            <h3 className="text-xl font-bold mb-8">How are you feeling today?</h3>
            <div className="flex justify-between mb-6 px-6">
              <Frown size={32} className={moodLevel < 4 ? 'text-purple-400' : 'text-slate-600'} />
              <Meh size={32} className={moodLevel >= 4 && moodLevel <= 7 ? 'text-purple-400' : 'text-slate-600'} />
              <Smile size={32} className={moodLevel > 7 ? 'text-purple-400' : 'text-slate-600'} />
            </div>
            <input type="range" min="1" max="10" value={moodLevel} onChange={(e) => setMoodLevel(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 mb-10" />
            <input value={moodTag} onChange={(e) => setMoodTag(e.target.value)} placeholder="Add a quick note..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all text-white font-medium mb-8 text-sm" />
            <button onClick={handleCheckIn} className="w-full bg-gradient-to-r from-[#008080] to-[#800080] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all text-lg shadow-lg">Check In</button>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} nickname={nickname} onUpdateNickname={setNickname} onReset={() => window.location.reload()} />
      )}
    </div>
  );
};

const getIconByMode = (mode: AppMode) => {
  const size = 18;
  switch (mode) {
    case AppMode.COMFORT: return <Heart size={size} />;
    case AppMode.CHEER: return <Sparkles size={size} />;
    case AppMode.CALM: return <Wind size={size} />;
    case AppMode.STUDY_BUDDY: return <BookOpen size={size} />;
    case AppMode.CAREER_COACH: return <Briefcase size={size} />;
    case AppMode.SPIRIT: return <Zap size={size} />;
    case AppMode.AI_MENTOR: return <Brain size={size} />;
    default: return <Zap size={size} />;
  }
};

export default App;
