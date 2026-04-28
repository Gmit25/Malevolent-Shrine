import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  source: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onTrackSelect: (index: number) => void;
  progress: number;
  duration: number;
}

export default function MusicPlayer({
  tracks,
  currentTrackIndex,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onTrackSelect,
  progress,
  duration
}: MusicPlayerProps) {
  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="flex flex-col h-full bg-zinc-900/40 rounded-xl border border-white/5 p-6 backdrop-blur-md">
      <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-6 font-semibold">NEURAL PLAYLIST</h3>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            onClick={() => onTrackSelect(index)}
            className={`w-full group flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
              index === currentTrackIndex
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-transparent hover:bg-white/5'
            }`}
          >
            <div className="flex flex-col">
              <span className={`text-sm font-bold tracking-tight ${index === currentTrackIndex ? 'text-green-400' : 'text-zinc-300'}`}>
                {track.title}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">{track.artist} • {track.duration}</span>
            </div>
            {index === currentTrackIndex && isPlaying && (
              <div className="flex gap-1 items-end h-3">
                <div className="w-0.5 h-full bg-green-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-0.5 h-2/3 bg-green-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-0.5 h-5/6 bg-green-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex justify-between items-end mb-3">
          <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">In Stream</span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {Math.floor(progress / 60).toString().padStart(2, '0')}:{Math.floor(progress % 60).toString().padStart(2, '0')} / {currentTrack.duration}
          </span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative group">
          <div 
            className="absolute top-0 left-0 h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
            style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function PlayerFooter({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev
}: {
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <footer className="relative z-10 flex items-center justify-between bg-zinc-900/90 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-14 h-14 bg-zinc-800 rounded-xl flex-shrink-0 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
          <div className="w-8 h-8 border-2 border-green-500/50 rotate-45 flex items-center justify-center">
            <div className={`w-4 h-4 bg-green-500 shadow-[0_0_10px_#22c55e] ${isPlaying ? 'animate-pulse' : ''}`} />
          </div>
        </div>
        <div className="truncate max-w-[200px]">
          <p className="text-sm font-black uppercase tracking-tighter truncate neon-text-green">{currentTrack.title}</p>
          <p className="text-[10px] text-zinc-500 font-semibold tracking-wider">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 justify-center flex-1">
        <button 
          onClick={onPrev}
          className="text-zinc-400 hover:text-white transition-colors hover:scale-110 active:scale-95"
        >
          <SkipBack fill="currentColor" size={24} />
        </button>
        <button 
          onClick={onPlayPause}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
        >
          {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play className="ml-1" fill="currentColor" size={28} />}
        </button>
        <button 
          onClick={onNext}
          className="text-zinc-400 hover:text-white transition-colors hover:scale-110 active:scale-95"
        >
          <SkipForward fill="currentColor" size={24} />
        </button>
      </div>

      <div className="flex items-center gap-4 w-1/3 justify-end pr-4">
        <div className="flex items-center gap-3">
          <Volume2 className="text-zinc-500" size={16} />
          <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
