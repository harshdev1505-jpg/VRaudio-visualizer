import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Upload, Volume2, VolumeX } from 'lucide-react';

interface Props {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onFileUpload: (file: File) => void;
  fileName: string | null;
}

export function PlayerControls({ audioElement, isPlaying, onPlayPause, onFileUpload, fileName }: Props) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!audioElement) return;

    const updateProgress = () => {
      setCurrentTime(audioElement.currentTime);
      setProgress((audioElement.currentTime / audioElement.duration) * 100 || 0);
    };

    const updateDuration = () => {
      setDuration(audioElement.duration);
    };

    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audioElement.removeEventListener('timeupdate', updateProgress);
      audioElement.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [audioElement]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioElement) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioElement.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioElement) return;
    const newVolume = parseFloat(e.target.value);
    audioElement.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioElement) return;
    if (isMuted) {
      audioElement.volume = volume > 0 ? volume : 1;
      setIsMuted(false);
    } else {
      audioElement.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-20 bg-[#0a0a0a] border-t border-white/10 flex items-center px-6 gap-6 text-white z-20 relative">
      <div className="flex items-center gap-4 w-64">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
          title="Upload Audio"
        >
          <Upload size={18} />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
          accept="audio/*"
          className="hidden"
        />
        <div className="overflow-hidden">
          <p className="text-sm font-medium truncate">{fileName || 'No file selected'}</p>
          <p className="text-xs text-gray-500 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2">
        <button 
          onClick={onPlayPause}
          disabled={!audioElement}
          className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
        >
          {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
        </button>
        
        <div className="w-full max-w-2xl flex items-center gap-3">
          <span className="text-xs font-mono text-gray-500 w-10 text-right">{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min="0" max="100" step="0.1"
            value={progress}
            onChange={handleSeek}
            disabled={!audioElement}
            className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer disabled:cursor-not-allowed"
          />
          <span className="text-xs font-mono text-gray-500 w-10">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="w-64 flex items-center justify-end gap-3">
        <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input 
          type="range" 
          min="0" max="1" step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-24 h-1.5 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
        />
      </div>
    </div>
  );
}
