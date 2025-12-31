
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Headphones, Sparkles, Play, SkipForward, SkipBack, 
  Volume2, Pause, Plus, Music, Youtube, ExternalLink, 
  RotateCcw, ListMusic, MoreVertical, Heart, Trash2, Layers,
  AlertCircle, VolumeX
} from 'lucide-react';
import { AppMode, Song } from '../types';
import { MODE_CONFIGS } from '../constants';

interface VibePlayerProps {
  activeMode: AppMode;
}

interface UserPlaylist {
  id: string;
  name: string;
  youtubeId: string;
}

export const VibePlayer: React.FC<VibePlayerProps> = ({ activeMode }) => {
  // Persistence for custom playlists
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>(() => {
    const saved = localStorage.getItem('wellsoulix_playlists');
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState<'mood' | 'custom'>('mood');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(80);
  const [needsInteraction, setNeedsInteraction] = useState(true);
  
  // Progress simulation states
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressTimerRef = useRef<number | null>(null);

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistUrl, setNewPlaylistUrl] = useState('');

  const modeConfig = MODE_CONFIGS[activeMode];
  const moodTracks = modeConfig.vibeTracks || [];

  // Save playlists when they change
  useEffect(() => {
    localStorage.setItem('wellsoulix_playlists', JSON.stringify(userPlaylists));
  }, [userPlaylists]);

  const getPlaylistId = (url: string) => {
    const reg = /[?&]list=([^#&?]+)/;
    const match = url.match(reg);
    return match ? match[1] : null;
  };

  const parseTimeToSeconds = (timeStr: string) => {
    const parts = timeStr.split(':');
    if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    return 300;
  };

  const formatSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSongSelect = (song: Song) => {
    setIsLoading(true);
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(parseTimeToSeconds(song.time));
    // Clear needsInteraction on first click
    setNeedsInteraction(false);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    const list = moodTracks;
    if (list.length === 0) return;
    const currentIndex = currentSong ? list.findIndex(s => s.id === currentSong.id) : -1;
    let nextIndex = 0;
    if (direction === 'next') nextIndex = (currentIndex + 1) % list.length;
    else nextIndex = (currentIndex - 1 + list.length) % list.length;
    handleSongSelect(list[nextIndex]);
  };

  const handleAddPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    const listId = getPlaylistId(newPlaylistUrl);
    if (!listId) {
      alert("Please provide a valid YouTube Playlist link (containing 'list=...')");
      return;
    }

    const newPl: UserPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName || 'My Vibe List',
      youtubeId: listId
    };

    setUserPlaylists(prev => [...prev, newPl]);
    setNewPlaylistName('');
    setNewPlaylistUrl('');
    setShowAddPlaylist(false);
    setView('custom');
  };

  const removePlaylist = (id: string) => {
    setUserPlaylists(prev => prev.filter(p => p.id !== id));
  };

  // Progress simulation effect
  useEffect(() => {
    if (isPlaying && currentSong && !isLoading && currentTime < duration) {
      progressTimerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handleSkip('next');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    return () => { if (progressTimerRef.current) clearInterval(progressTimerRef.current); };
  }, [isPlaying, currentSong, currentTime, duration, isLoading]);

  useEffect(() => {
    if (!currentSong && moodTracks.length > 0) {
      setCurrentSong(moodTracks[0]);
      setDuration(parseTimeToSeconds(moodTracks[0].time));
    }
  }, [activeMode]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header with Custom Playlist Adder */}
      <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl text-white shadow-md ${modeConfig.accentColor}`}>
              <Headphones size={20} />
            </div>
            <h3 className="font-extrabold text-[#1e293b] text-base tracking-tight">Vibe Station</h3>
          </div>
          <button 
            onClick={() => setShowAddPlaylist(!showAddPlaylist)}
            className="p-2 text-slate-400 hover:text-[#008080] hover:bg-teal-50 rounded-xl transition-all"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-1">
          <button 
            onClick={() => setView('mood')}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'mood' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}
          >
            Mood Mix
          </button>
          <button 
            onClick={() => setView('custom')}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'custom' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}
          >
            Playlists ({userPlaylists.length})
          </button>
        </div>

        {showAddPlaylist && (
          <form onSubmit={handleAddPlaylist} className="mt-4 p-5 bg-slate-50 border border-slate-100 rounded-3xl space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Import from YouTube</div>
            <input 
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              placeholder="Name (e.g. My Study Mix)" 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-teal-100"
            />
            <input 
              value={newPlaylistUrl}
              onChange={e => setNewPlaylistUrl(e.target.value)}
              placeholder="Playlist URL (with ?list=...)" 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-teal-100"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-[#008080] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-teal-100">Add to Library</button>
              <button type="button" onClick={() => setShowAddPlaylist(false)} className="px-5 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Main Integrated Player */}
      <div className="bg-slate-900 text-white rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 flex flex-col relative">
        {/* Banner Area with Audio Engine Status */}
        <div className="relative h-28 w-full group overflow-hidden">
          <img src={modeConfig.banner} className="w-full h-full object-cover opacity-30 grayscale-[0.6] scale-105 group-hover:scale-110 transition-transform duration-700" alt="Vibe Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          {/* Audio Visualizer Waves */}
          {isPlaying && !isLoading && (
            <div className="absolute top-6 right-8 flex items-end gap-1.5 h-6">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-1.5 bg-gradient-to-t from-teal-400 to-purple-400 rounded-full animate-bounce`}
                  style={{ animationDuration: `${0.4 + (i * 0.15)}s`, height: `${40 + (Math.random() * 60)}%` }}
                />
              ))}
            </div>
          )}

          <div className="absolute bottom-5 left-8">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg ${modeConfig.textColor}`}>
                {modeConfig.emoji}
              </div>
              <div className="max-w-[140px]">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em] mb-1">VIBE ENGINE ACTIVE</p>
                <h4 className="text-sm font-black text-white truncate">
                  {view === 'mood' ? `${activeMode} Collection` : 'My Library'}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* 
            SOUND FIX: 
            Browsers block autoplay if the video is hidden or too small.
            We'll make the video a small preview square in the corner instead of 'hidden'.
            This satisfies browser 'visibility' checks for media playback.
        */}
        <div className="relative px-6 -mt-4 mb-2 z-20">
          <div className="bg-black/80 rounded-3xl overflow-hidden border border-white/10 aspect-video shadow-2xl flex items-center justify-center group/vid">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 animate-pulse">
                <Music className="text-white/20" size={32} />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Buffering...</span>
              </div>
            ) : (
              currentSong && (
                <iframe 
                  key={currentSong.id + isPlaying}
                  width="100%" 
                  height="100%"
                  src={`${currentSong.url}${currentSong.url.includes('?') ? '&' : '?'}autoplay=${isPlaying ? 1 : 0}&mute=0&controls=1&modestbranding=1&rel=0`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  className={`${isPlaying ? 'opacity-100' : 'opacity-20'} transition-opacity duration-700`}
                />
              )
            )}
            
            {needsInteraction && (
              <div 
                className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center cursor-pointer group-hover/vid:bg-slate-900 transition-colors"
                onClick={() => currentSong && handleSongSelect(currentSong)}
              >
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4 group-hover/vid:scale-110 transition-transform">
                  <Play size={24} className="text-teal-400 fill-teal-400 ml-1" />
                </div>
                <h5 className="text-sm font-black text-white mb-2">Initialize Sound Engine</h5>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Click to enable mode playback</p>
              </div>
            )}
          </div>
        </div>

        {/* Player UI */}
        <div className="px-10 py-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0 pr-6">
              <h5 className="text-xl font-black text-white truncate tracking-tight leading-none mb-2">
                {currentSong?.name || "Ready for Vibes"}
              </h5>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                {currentSong?.artist || "Wellsoulix Station"}
              </p>
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2.5 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                 <MoreVertical size={20} />
               </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden cursor-pointer">
              <div 
                className="absolute h-full bg-gradient-to-r from-teal-400 to-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] font-mono">
              <span>{formatSeconds(currentTime)}</span>
              <span>{formatSeconds(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between pt-2 pb-4">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => handleSkip('prev')}
                className="text-slate-500 hover:text-white transition-all transform hover:scale-110 active:scale-90"
              >
                <SkipBack size={26} fill="currentColor" />
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${
                  isPlaying ? 'bg-white text-slate-900 shadow-white/10' : 'bg-teal-500 text-white shadow-teal-500/20'
                }`}
              >
                {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1.5" />}
              </button>

              <button 
                onClick={() => handleSkip('next')}
                className="text-slate-500 hover:text-white transition-all transform hover:scale-110 active:scale-90"
              >
                <SkipForward size={26} fill="currentColor" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => { setCurrentTime(0); setIsPlaying(true); }} className="text-slate-600 hover:text-teal-400 transition-colors p-2">
                <RotateCcw size={20} />
              </button>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5">
                {volume === 0 ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-slate-400" />}
                <div className="w-12 h-1 bg-white/10 rounded-full relative group/vol cursor-pointer" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  setVolume(Math.round((x / rect.width) * 100));
                }}>
                  <div className="absolute h-full bg-slate-400 rounded-full group-hover/vol:bg-teal-400 transition-colors" style={{ width: `${volume}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Library Section */}
        <div className="bg-black/30 border-t border-white/5 flex flex-col h-72">
          <div className="px-8 py-4 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-xl z-10 border-b border-white/5 shadow-lg">
            <div className="flex items-center gap-3">
              {view === 'mood' ? <Sparkles size={16} className="text-teal-400" /> : <Layers size={16} className="text-purple-400" />}
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {view === 'mood' ? `${activeMode} Mix (20 Tracks)` : 'Saved Playlists'}
              </span>
            </div>
            {view === 'custom' && userPlaylists.length > 0 && (
               <span className="text-[9px] font-black text-slate-700 uppercase">{userPlaylists.length} Folders</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll px-5 pb-6 pt-3">
            {view === 'mood' ? (
              <div className="space-y-1.5">
                {moodTracks.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSongSelect(s)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group border ${
                      currentSong?.id === s.id ? 'bg-teal-500/10 border-teal-500/30 shadow-lg' : 'hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0 text-left">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        currentSong?.id === s.id ? 'bg-teal-500/20 border-teal-500/40 text-teal-400 scale-110' : 'bg-white/5 border-white/5 text-slate-600 group-hover:bg-white/10'
                      }`}>
                        {currentSong?.id === s.id && isPlaying ? (
                          <div className="flex gap-0.5 items-end h-3">
                            <div className="w-0.5 bg-teal-400 animate-[bounce_0.6s_infinite]" />
                            <div className="w-0.5 bg-teal-400 animate-[bounce_0.8s_infinite_0.1s]" />
                            <div className="w-0.5 bg-teal-400 animate-[bounce_0.7s_infinite_0.2s]" />
                          </div>
                        ) : (
                          <Music size={14} />
                        )}
                      </div>
                      <div className="truncate">
                        <p className={`text-[13px] font-black truncate leading-none mb-1.5 ${
                          currentSong?.id === s.id ? 'text-teal-300' : 'text-slate-300'
                        }`}>
                          {s.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight truncate">
                          {s.artist}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-700 group-hover:text-slate-500 shrink-0 font-mono">
                      {s.time}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3 p-1">
                {userPlaylists.length === 0 ? (
                  <div className="text-center py-16 opacity-30 flex flex-col items-center gap-4">
                     <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Youtube size={32} />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em]">Library is empty</p>
                     <button onClick={() => setShowAddPlaylist(true)} className="text-[9px] font-black text-teal-400 border border-teal-400/30 px-4 py-2 rounded-full hover:bg-teal-400 hover:text-white transition-all uppercase">Add Now</button>
                  </div>
                ) : (
                  userPlaylists.map((pl) => (
                    <div key={pl.id} className="bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center justify-between group hover:bg-white/10 hover:border-white/10 transition-all shadow-sm">
                       <div className="flex items-center gap-5 min-w-0">
                          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                             <Youtube size={22} />
                          </div>
                          <div className="truncate pr-4">
                             <h6 className="text-[14px] font-black text-white truncate mb-1">{pl.name}</h6>
                             <p className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">YouTube Playlist</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 shrink-0">
                          <button 
                            onClick={() => {
                              handleSongSelect({
                                id: pl.id,
                                name: pl.name,
                                artist: 'YouTube Mix',
                                time: 'LIVE',
                                type: 'youtube',
                                url: `https://www.youtube.com/embed/videoseries?list=${pl.youtubeId}`
                              });
                            }}
                            className="w-10 h-10 bg-white text-slate-900 rounded-xl shadow-lg hover:scale-110 active:scale-90 transition-all flex items-center justify-center"
                          >
                            <Play size={18} fill="currentColor" />
                          </button>
                          <button 
                            onClick={() => removePlaylist(pl.id)}
                            className="w-10 h-10 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-center"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
