import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ListMusic } from 'lucide-react';
import { Track, DUMMY_TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTrackChange: (track: Track) => void;
  onTogglePlay: () => void;
}

export default function MusicPlayer({ currentTrack, isPlaying, onTrackChange, onTogglePlay }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    const currentIndex = DUMMY_TRACKS.findIndex((t) => t.id === currentTrack.id);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= DUMMY_TRACKS.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = DUMMY_TRACKS.length - 1;
    onTrackChange(DUMMY_TRACKS[nextIndex]);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-24 bg-black border-t-2 border-magenta-900/50 flex items-center px-6 md:px-8 gap-4 md:gap-8 w-full relative overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleSkip('next')}
      />

      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-0 z-10">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-950/20 rounded-sm flex items-center justify-center border border-cyan-500/50 flex-shrink-0 animate-pulse">
          <div className="w-6 h-6 border-t-4 border-l-4 border-magenta-500 animate-glitch" />
        </div>
        <div className="truncate hidden sm:block">
          <p className="text-[10px] md:text-xs font-pixel text-cyan-400 truncate uppercase mt-1">{currentTrack.title}</p>
          <p className="text-[8px] md:text-[9px] text-magenta-800 uppercase truncate mt-0.5 tracking-tighter">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex-1 flex flex-col items-center max-w-2xl px-4 z-10">
        <div 
          className="flex items-center justify-center gap-8 mb-2"
          style={{ height: '35px' }}
        >
          <button onClick={() => handleSkip('prev')} className="text-cyan-800 hover:text-cyan-400 transition-colors text-xl font-glitch select-none">{"<<"}</button>
          <button 
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-sm bg-magenta-500 text-black flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_#ff00ff]"
          >
            {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-1" />}
          </button>
          <button onClick={() => handleSkip('next')} className="text-cyan-800 hover:text-cyan-400 transition-colors text-xl font-glitch select-none">{">>"}</button>
        </div>
        
        <div className="w-full flex flex-col gap-1">
          <div className="w-full h-1 bg-cyan-950 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-cyan-400 shadow-[0_0_10px_#00ffff] animate-pulse"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0 }}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-magenta-500/10 opacity-50 mix-blend-screen overflow-hidden">
               <div className="w-[200%] h-full animate-[noise_.1s_infinite] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => {
                if (audioRef.current) {
                  const time = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
                  audioRef.current.currentTime = time;
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
          <div className="flex justify-between w-full">
            <span className="text-[7px] md:text-[8px] text-cyan-900 font-pixel tabular-nums">{formatTime(currentTime)}</span>
            <span className="text-[7px] md:text-[8px] text-cyan-900 font-pixel tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="w-1/4 flex justify-end items-center gap-4 text-cyan-900 group z-10">
        <span className="text-[8px] uppercase tracking-tighter hidden md:block">GAIN_{Math.round(volume * 100)}%</span>
        <div 
          className="w-16 md:w-24 h-1 bg-cyan-950 relative overflow-hidden"
          style={{ height: '12px' }}
        >
          <div 
            className="h-full bg-magenta-900 absolute left-0 top-0 border-r border-magenta-500"
            style={{ width: `${volume * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
      </div>
    </div>
  );
}
