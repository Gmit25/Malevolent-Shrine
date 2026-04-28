import React, { useState, useEffect, useRef } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer, { PlayerFooter, Track } from './components/MusicPlayer';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'VOLTAGE VORTEX',
    artist: 'AI SYNTHESIZER',
    duration: '04:22',
    source: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'CYBER DRIFT',
    artist: 'NEURAL BEATS',
    duration: '03:45',
    source: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'CIRCUIT BREAKER',
    artist: 'LOGIC CORE',
    duration: '05:10',
    source: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden bg-[#050505]">
      <audio 
        ref={audioRef} 
        src={DUMMY_TRACKS[currentTrackIndex].source} 
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] text-[15rem] md:text-[24rem] font-black text-zinc-900/50 leading-none select-none z-0 pointer-events-none tracking-tighter italic">
        {score.toString().padStart(3, '0')}
      </div>
      
      <div className="scanline" />

      <div className="relative z-10 w-full max-w-6xl h-full flex flex-col gap-6">
        {/* Header */}
        <header className="flex justify-between items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic neon-text-green uppercase leading-none">
              Neon Snake
            </h1>
            <p className="text-[10px] tracking-[0.4em] font-bold text-zinc-500 mt-3 uppercase opacity-80">
              Audiophile Edition v1.0.42
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-6 md:gap-10 text-right"
          >
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Highest</span>
              <span className="text-2xl md:text-3xl font-black font-mono">{highScore}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Current</span>
              <span className="text-2xl md:text-3xl font-black text-pink-500 neon-text-pink font-mono">{score}</span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Multiplier</span>
              <span className="text-2xl md:text-3xl font-black text-green-400 font-mono">{(1 + score / 100).toFixed(1)}x</span>
            </div>
          </motion.div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0">
          {/* Game Section */}
          <section className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key="game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full"
              >
                <SnakeGame onScoreChange={handleScoreChange} />
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Playlist Section */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="h-full"
            >
              <MusicPlayer 
                tracks={DUMMY_TRACKS}
                currentTrackIndex={currentTrackIndex}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onNext={handleNext}
                onPrev={handlePrev}
                onTrackSelect={(index) => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                  setProgress(0);
                }}
                progress={progress}
                duration={duration}
              />
            </motion.div>
          </aside>
        </main>

        {/* Footer Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PlayerFooter 
            currentTrack={DUMMY_TRACKS[currentTrackIndex]}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </motion.div>
      </div>

      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}

