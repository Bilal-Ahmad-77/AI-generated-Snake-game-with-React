import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import Visualizer from './components/Visualizer';
import { DUMMY_TRACKS, Track } from './constants';
import { Github, Music2, Gamepad2 } from 'lucide-react';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track>(DUMMY_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col font-glitch selection:bg-magenta-500 selection:text-white scanline-overlay">
      <div className="noise-overlay" />
      <Visualizer isPlaying={isPlaying} color={currentTrack.color} />
      
      {/* Cryptic Header */}
      <header className="flex flex-col md:flex-row justify-between items-center border-b border-cyan-900/50 p-6 md:p-8 z-10 gap-4">
        <div className="flex items-center gap-4 group">
          <div className="relative">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-cyan-400 hover:text-magenta-500 transition-colors uppercase animate-pulse">
              SYS_VOID_0
            </h1>
            <div className="absolute -top-1 -left-1 w-full h-full bg-magenta-500/20 mix-blend-screen animate-glitch pointer-events-none" />
          </div>
          <div className="hidden sm:block border-l border-cyan-800 pl-4 py-1">
            <p className="text-[10px] uppercase tracking-[0.5em] text-cyan-700">Protocol: Neural_Static</p>
            <p className="text-[10px] uppercase tracking-[0.5em] text-magenta-900">Uptime: ERROR_NOT_FOUND</p>
          </div>
        </div>
        
        <div className="flex gap-8 items-center bg-cyan-950/20 p-4 border border-cyan-900/30">
          <div className="text-right">
            <p className="text-[9px] text-cyan-800 uppercase mb-1">Nodes_Consumed</p>
            <p className="text-4xl font-pixel text-magenta-500 tabular-nums leading-none">
              {score.toString().padStart(5, '0')}
            </p>
          </div>
          <div className="text-right hidden xs:block">
            <p className="text-[9px] text-cyan-800 uppercase mb-1">Max_Static_Length</p>
            <p className="text-4xl font-pixel text-cyan-700 tabular-nums leading-none opacity-50">
              {highScore.toString().padStart(5, '0')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Grid Node */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 items-start z-10 overflow-hidden">
        
        {/* Left Aside: System Logs */}
        <aside className="col-span-3 hidden lg:block space-y-4">
          <div className="p-4 border border-cyan-900/40 bg-black/40 backdrop-blur-md">
            <h2 className="text-[10px] font-bold text-magenta-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1 h-1 bg-magenta-500 animate-ping"></span> LOG_STREAM
            </h2>
            <div className="space-y-1 font-mono text-[9px] text-cyan-900 overflow-hidden h-48">
              <p>{">"} INITIALIZING_CORE...</p>
              <p className="text-cyan-600 font-bold">{">"} HANDSHAKE_SUCCESSFUL</p>
              <p>{">"} BOOT_MODE: GLITCH_ART</p>
              <p>{">"} BUFFER_SIZE: 1024KB</p>
              <p className="animate-pulse">{">"} LISTENING_FOR_INPUT...</p>
              <p>{">"} GRID_X: 20ns</p>
              <p>{">"} GRID_Y: 20ns</p>
              <p className="text-magenta-800 italic">{">"} WARNING: TEARING_DETECTED</p>
              <p className="text-white/10">{">"} 0x00FFAD: NULL_PTR</p>
              <p className="text-white/10">{">"} 0x00FFB2: RECURSION_LVL_MAX</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DUMMY_TRACKS.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
                className={`p-2 border border-cyan-900/20 text-left transition-all ${
                  currentTrack.id === track.id ? 'bg-magenta-900/20 border-magenta-500 text-magenta-400 font-pixel text-[8px]' : 'hover:bg-cyan-950/30 text-[8px]'
                }`}
              >
                CHAN_{idx}
              </button>
            ))}
          </div>
        </aside>

        {/* Center: The Void (Snake Game) */}
        <section className="col-span-full lg:col-span-6 flex flex-col items-center relative gap-6">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[8px] text-cyan-900 uppercase tracking-[1em] whitespace-nowrap">
            INTERFACING_WITH_THE_GRID
          </div>
          <SnakeGame 
            neonColor="#ff00ff" 
            onScoreChange={setScore}
            onHighScoreChange={setHighScore}
          />
          <div className="flex gap-4 text-[9px] uppercase tracking-widest text-cyan-800 animate-pulse">
            <span>[W] UP</span>
            <span>[A] LEFT</span>
            <span>[S] DOWN</span>
            <span>[D] RIGHT</span>
          </div>
        </section>

        {/* Right Aside: Visualizer Data */}
        <aside className="col-span-3 hidden lg:flex h-full flex-col gap-6">
          <div className="border border-cyan-900/40 bg-black/40 p-4">
            <p className="text-[9px] text-magenta-500 uppercase mb-4 tracking-tighter">PHASE_SHIFT_ANALYSIS</p>
            <div className="flex items-end justify-between h-24 gap-0.5">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-full bg-cyan-500/50 transition-all duration-75`}
                  style={{ 
                    height: isPlaying ? `${Math.random() * 100}%` : '5%',
                    backgroundColor: i % 3 === 0 ? '#ff00ff' : '#00ffff'
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="p-4 border border-magenta-900/40 text-magenta-500 text-[10px] space-y-2">
            <p className="font-bold border-b border-magenta-900/40 pb-1">KERNEL_PANIC</p>
            <p className="italic opacity-70">"You are just a ripple in the static. Consume or be forgotten."</p>
          </div>
        </aside>
      </main>

      {/* Footer Interface */}
      <footer className="mt-auto z-10 w-full border-t-2 border-magenta-900/50">
        <MusicPlayer 
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTrackChange={(t) => {
            setCurrentTrack(t);
            setIsPlaying(true);
          }}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
        />
      </footer>
    </div>
  );
}

