import { useEffect, useRef, useState } from 'react';

export function useAudioAnalyzer(audioElement: HTMLAudioElement | null, fftSize: number, smoothing: number) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const destRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initAudio = () => {
    if (!audioElement || isInitialized) return;
    
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothing;
      
      const source = ctx.createMediaElementSource(audioElement);
      const dest = ctx.createMediaStreamDestination();
      
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyser.connect(dest);
      
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      destRef.current = dest;
      setIsInitialized(true);
    } catch (e) {
      console.error("Audio initialization failed", e);
    }
  };

  useEffect(() => {
    if (analyserRef.current) {
      analyserRef.current.fftSize = fftSize;
      analyserRef.current.smoothingTimeConstant = smoothing;
    }
  }, [fftSize, smoothing]);

  return { 
    initAudio, 
    analyser: analyserRef.current, 
    isInitialized,
    audioStream: destRef.current?.stream
  };
}

