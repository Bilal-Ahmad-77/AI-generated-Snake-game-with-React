import { motion } from 'motion/react';

interface VisualizerProps {
  isPlaying: boolean;
  color: string;
}

export default function Visualizer({ isPlaying, color }: VisualizerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary Glitch Field */}
      <motion.div 
        animate={{ 
          opacity: isPlaying ? [0.05, 0.15, 0.05] : 0.02,
          x: isPlaying ? [-2, 2, -1, 0] : 0,
          scale: isPlaying ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 0.2, repeat: Infinity }}
        className="absolute inset-0 bg-black"
      >
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `repeating-linear-gradient(0deg, ${color} 0px, transparent 1px, transparent 10px)`
          }}
        />
      </motion.div>

      {/* Tearing Effect Layer */}
      <motion.div 
        animate={{ 
          y: isPlaying ? ["-100%", "100%"] : "0%",
          opacity: isPlaying ? [0, 0.1, 0] : 0
        }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-px bg-white shadow-[0_0_20px_#fff] z-10"
      />

      {/* Hard Gradient Orbs (Cyan vs Magenta) */}
      <motion.div 
        animate={{ 
          scale: isPlaying ? [1, 1.4, 1] : 1,
          opacity: isPlaying ? [0.1, 0.2, 0.1] : 0.05,
          x: isPlaying ? [-10, 10] : 0
        }}
        transition={{ duration: 0.1, repeat: Infinity, repeatType: "mirror" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] opacity-10"
        style={{
          background: `conic-gradient(from 180deg at 50% 50%, #00ffff 0deg, transparent 90deg, #ff00ff 180deg, transparent 270deg)`,
        }}
      />
      
      <motion.div 
        animate={{ 
          scale: isPlaying ? [1, 1.3, 1] : 1,
          opacity: isPlaying ? [0.1, 0.2, 0.1] : 0.05,
          y: isPlaying ? [10, -10] : 0
        }}
        transition={{ duration: 0.15, repeat: Infinity, repeatType: "mirror", delay: 0.05 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] opacity-10"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, #ff00ff 0deg, transparent 90deg, #00ffff 180deg, transparent 270deg)`,
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }} 
      />
    </div>
  );
}
