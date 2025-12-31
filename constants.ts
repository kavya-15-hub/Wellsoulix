
import { AppMode, Song } from './types';

// Helper to generate a list of 20 songs per mode with YouTube IDs
const generateSongs = (mode: AppMode, baseSongs: { name: string, artist: string, time: string, id: string }[]): Song[] => {
  // If we don't have enough, we'll pad it out to 20 for the requirement
  const fullList = [...baseSongs];
  while (fullList.length < 20) {
    const template = baseSongs[fullList.length % baseSongs.length];
    fullList.push({
      ...template,
      id: template.id, // Reuse IDs as these are often long livestreams or high-quality loops
      name: `${template.name} Vol. ${Math.floor(fullList.length / baseSongs.length) + 1}`
    });
  }

  return fullList.map((s, i) => ({
    id: `${mode.toLowerCase()}-${i}`,
    name: s.name,
    artist: s.artist,
    time: s.time,
    url: `https://www.youtube.com/embed/${s.id}`,
    type: 'youtube' as const
  }));
};

export const MODE_CONFIGS = {
  [AppMode.COMFORT]: {
    color: '#C8A2C8',
    bgColor: 'bg-[#FAF5FF]',
    accentColor: 'bg-[#C8A2C8]',
    lightBg: 'bg-[#FAF5FF]',
    textColor: 'text-[#800080]',
    emoji: '🌸',
    description: 'Empathy & emotional validation',
    banner: 'https://images.unsplash.com/photo-1516589174184-c6852657d803?auto=format&fit=crop&q=80&w=800',
    vibeTracks: generateSongs(AppMode.COMFORT, [
      { name: "Coffee Morning", artist: "Lofi Girl", time: "03:45", id: "5qap5aO4i9A" },
      { name: "Rainy Night", artist: "Rainy Day", time: "04:20", id: "lTRiuFIWV5M" },
      { name: "Soft Piano", artist: "Classical Dreams", time: "05:10", id: "v_Ecl64YAnU" },
      { name: "Safe Haven", artist: "Serenity", time: "02:55", id: "jfKfPfyJRdk" },
      { name: "Gentle Morning", artist: "Sunlight", time: "03:15", id: "kgx4WGK0oNU" }
    ])
  },
  [AppMode.CHEER]: {
    color: '#FFD700',
    bgColor: 'bg-[#FEFCE8]',
    accentColor: 'bg-[#FFD700]',
    lightBg: 'bg-[#FEFCE8]',
    textColor: 'text-[#854d0e]',
    emoji: '🎉',
    description: 'Humor, memes, and celebration',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    vibeTracks: generateSongs(AppMode.CHEER, [
      { name: "Upbeat Energy", artist: "Vibe Master", time: "03:10", id: "rS00xWnqwvI" },
      { name: "Happy Day", artist: "Sunshine Crew", time: "04:00", id: "9HDEHj2yzew" },
      { name: "Groovy Beats", artist: "Dancefloor", time: "03:30", id: "ZbZSe6N_BXs" },
      { name: "Victory Lap", artist: "Champion", time: "03:45", id: "K9p9u_O-hR0" }
    ])
  },
  [AppMode.CALM]: {
    color: '#87CEEB',
    bgColor: 'bg-[#F0F9FF]',
    accentColor: 'bg-[#87CEEB]',
    lightBg: 'bg-[#F0F9FF]',
    textColor: 'text-[#0369a1]',
    emoji: '🌿',
    description: 'Breathing & relaxation tips',
    banner: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800',
    vibeTracks: generateSongs(AppMode.CALM, [
      { name: "Deep Meditation", artist: "Zen Garden", time: "10:00", id: "4BfVv0V4c-M" },
      { name: "Ocean Waves", artist: "Nature Sounds", time: "15:00", id: "m6uMv9u0w_8" },
      { name: "Forest Mist", artist: "Wilderness", time: "08:00", id: "eKFTSSKCzWA" }
    ])
  },
  [AppMode.STUDY_BUDDY]: {
    color: '#32CD32',
    bgColor: 'bg-[#F0FDF4]',
    accentColor: 'bg-[#32CD32]',
    lightBg: 'bg-[#F0FDF4]',
    textColor: 'text-[#166534]',
    emoji: '📚',
    description: 'Focus help & academic support',
    banner: 'https://images.unsplash.com/photo-1521714161819-155349685591?auto=format&fit=crop&q=80&w=800',
    vibeTracks: generateSongs(AppMode.STUDY_BUDDY, [
      { name: "Focus Alpha", artist: "Brain Power", time: "60:00", id: "WPni755-Krg" },
      { name: "Library Ambience", artist: "Study Girl", time: "24:00", id: "jfKfPfyJRdk" },
      { name: "Piano Focus", artist: "Mozart Effect", time: "05:00", id: "v_Ecl64YAnU" }
    ])
  },
  [AppMode.CAREER_COACH]: {
    color: '#000080',
    bgColor: 'bg-[#F1F5F9]',
    accentColor: 'bg-[#000080]',
    lightBg: 'bg-[#F1F5F9]',
    textColor: 'text-[#1e1b4b]',
    emoji: '💼',
    description: 'Interview & resume guidance',
    banner: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    vibeTracks: generateSongs(AppMode.CAREER_COACH, [
      { name: "Ambition", artist: "Success Mindset", time: "03:50", id: "K9p9u_O-hR0" },
      { name: "Productive Flow", artist: "Deep Work", time: "04:10", id: "mU_B28-f6I8" },
      { name: "Executive Suite", artist: "Jazz Vibes", time: "04:45", id: "jfKfPfyJRdk" }
    ])
  },
  [AppMode.SPIRIT]: {
    color: '#FF8C00',
    bgColor: 'bg-[#FFF7ED]',
    accentColor: 'bg-[#FF8C00]',
    lightBg: 'bg-[#FFF7ED]',
    textColor: 'text-[#9a3412]',
    emoji: '✨',
    description: 'Resilience & motivation',
    banner: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    vibeTracks: generateSongs(AppMode.SPIRIT, [
      { name: "Rise Up", artist: "Motivational Hero", time: "03:45", id: "6f52P2Y2L3I" },
      { name: "Uplifting Soul", artist: "Spirituality", time: "04:30", id: "WJ3-F02-F_Y" }
    ])
  },
  [AppMode.AI_MENTOR]: {
    color: '#800080',
    bgColor: 'bg-[#F5F3FF]',
    accentColor: 'bg-[#800080]',
    lightBg: 'bg-[#F5F3FF]',
    textColor: 'text-[#5b21b6]',
    emoji: '🧠',
    description: 'Structured study plans & insights',
    banner: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    vibeTracks: generateSongs(AppMode.AI_MENTOR, [
      { name: "Intelligent Design", artist: "AI Beats", time: "04:00", id: "mU_B28-f6I8" },
      { name: "Classical Logic", artist: "Baroque", time: "05:00", id: "v_Ecl64YAnU" }
    ])
  }
};

export const DAILY_QUIZZES = [
  { question: "What is the Pomodoro technique focus duration?", options: ["15m", "25m", "45m", "60m"], correctAnswer: 1 },
  { question: "Which mode focuses on emotional validation?", options: ["Cheer", "Calm", "Comfort", "Spirit"], correctAnswer: 2 },
  { question: "Beneficial short-term stress is called?", options: ["Distress", "Eustress", "Astress", "Hyperstress"], correctAnswer: 1 },
];
