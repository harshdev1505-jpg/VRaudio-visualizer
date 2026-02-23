import React, { useState, useRef, useEffect } from 'react';
import { VisualizerSettings } from './types';
import { Sidebar } from './components/Sidebar';
import { PlayerControls } from './components/PlayerControls';
import { VisualizerCanvas } from './components/VisualizerCanvas';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { Upload, Video } from 'lucide-react';

const DEFAULT_SETTINGS: VisualizerSettings = {
  type: 'bars',
  primaryColor: '#6366f1',
  secondaryColor: '#a855f7',
  bgColor: '#050505',
  fftSize: 1024,
  barWidth: 4,
  barSpacing: 2,
  radius: 150,
  smoothing: 0.8,
};

export default function App() {
  const [settings, setSettings] = useState<VisualizerSettings>(DEFAULT_SETTINGS);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { initAudio, analyser, isInitialized, audioStream } = useAudioAnalyzer(audioElement, settings.fftSize, settings.smoothing);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;
      setAudioElement(audio);

      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('play', () => setIsPlaying(true));

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [audioUrl]);

  const handleFileUpload = (file: File) => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (!isInitialized) {
      initAudio();
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const startRecording = () => {
    if (!canvasRef.current || !audioStream) {
      alert("Please play the audio first to initialize the audio stream.");
      return;
    }

    const canvasStream = canvasRef.current.captureStream(60);
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioStream.getAudioTracks()
    ]);

    const options = { mimeType: 'video/webm; codecs=vp9' };
    let recorder: MediaRecorder;
    try {
        recorder = new MediaRecorder(combinedStream, options);
    } catch (e) {
        recorder = new MediaRecorder(combinedStream); // fallback
    }

    recordedChunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'motionvis-export.webm';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };

    recorder.start();
    setIsRecording(true);
    mediaRecorderRef.current = recorder;
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] text-white overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-[#0a0a0a] z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <h1 className="font-semibold tracking-tight text-lg">MotionVis</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {audioUrl && (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-4 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors ${
                isRecording 
                  ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isRecording ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Video size={16} />
                  Record Video
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <main className="flex-1 relative flex flex-col">
          {!audioUrl ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <Upload size={32} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">Drop an audio file to start</h2>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Upload an MP3 or WAV file to begin creating your audio visualization.
                </p>
                <label className="inline-block mt-4 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-medium cursor-pointer transition-colors">
                  Select File
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="audio/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          ) : (
            <VisualizerCanvas 
              canvasRef={canvasRef}
              analyser={analyser} 
              settings={settings} 
              isPlaying={isPlaying} 
            />
          )}
        </main>

        {/* Sidebar */}
        <Sidebar settings={settings} onChange={setSettings} />
      </div>

      {/* Player Controls */}
      <PlayerControls 
        audioElement={audioElement}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onFileUpload={handleFileUpload}
        fileName={audioFile?.name || null}
      />
    </div>
  );
}
