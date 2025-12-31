
import React from 'react';
import { Settings, X, User, Save, Volume2, Maximize, Trash2, RotateCcw, ChevronRight } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  nickname: string;
  onUpdateNickname: (name: string) => void;
  onReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, nickname, onUpdateNickname, onReset }) => {
  const [name, setName] = React.useState(nickname);

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[#9333ea]">
             <Settings size={32} />
             <h2 className="text-[28px] font-black">Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="p-10 space-y-8">
          {/* Nickname section */}
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">NICKNAME</label>
            <div className="flex gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-inner">
                <User size={20} className="text-slate-300" />
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent w-full outline-none text-slate-700 font-bold text-lg"
                />
              </div>
              <button 
                onClick={() => onUpdateNickname(name)}
                className="bg-[#9333ea] text-white px-8 rounded-2xl font-black hover:bg-purple-700 transition-all shadow-lg shadow-purple-100"
              >
                Save
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[28px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 text-teal-600 rounded-2xl"><Volume2 size={24} /></div>
                <span className="font-black text-slate-700 text-lg">Sounds</span>
              </div>
              <div className="w-14 h-7 bg-[#00a396] rounded-full relative p-1.5 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1.5" />
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[28px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Maximize size={24} /></div>
                <span className="font-black text-slate-700 text-lg">Compact Chat</span>
              </div>
              <div className="w-14 h-7 bg-slate-200 rounded-full relative p-1.5 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1.5" />
              </div>
            </div>
          </div>

          {/* Action buttons - Red as per Screenshot 7 */}
          <div className="space-y-4 pt-6 border-t border-slate-50">
             <button className="w-full flex items-center justify-between px-8 py-5 bg-red-50 text-red-600 rounded-[24px] font-black hover:bg-red-100 transition-all border border-red-100">
               <div className="flex items-center gap-4">
                 <Trash2 size={24} />
                 <span className="text-lg">Clear History</span>
               </div>
               <Trash2 size={20} className="opacity-40" />
             </button>
             <button 
               onClick={onReset}
               className="w-full flex items-center justify-between px-8 py-5 bg-[#e11d48] text-white rounded-[24px] font-black hover:bg-red-700 transition-all shadow-xl shadow-red-100"
             >
               <div className="flex items-center gap-4">
                 <RotateCcw size={24} />
                 <span className="text-lg">Full Reset</span>
               </div>
               <ChevronRight size={24} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
