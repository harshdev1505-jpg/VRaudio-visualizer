import React, { useEffect, useRef } from 'react';
import { VisualizerSettings } from '../types';

interface Props {
  analyser: AnalyserNode | null;
  settings: VisualizerSettings;
  isPlaying: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function VisualizerCanvas({ analyser, settings, isPlaying, canvasRef }: Props) {
  const requestRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Fill background
      ctx.fillStyle = settings.bgColor;
      ctx.fillRect(0, 0, width, height);

      if (!analyser) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }

      if (settings.type === 'waveform') {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = settings.barWidth;
        ctx.strokeStyle = settings.primaryColor;
        
        // Add glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = settings.primaryColor;
        
        ctx.beginPath();

        const sliceWidth = width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * height / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
      } else if (settings.type === 'bars') {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barTotalWidth = settings.barWidth + settings.barSpacing;
        const barsToDraw = Math.min(bufferLength, Math.floor(width / barTotalWidth));
        
        const startX = (width - (barsToDraw * barTotalWidth)) / 2;

        for (let i = 0; i < barsToDraw; i++) {
          const value = dataArray[i];
          const percent = value / 255;
          const barHeight = percent * height * 0.8; // Max 80% of height
          
          const x = startX + i * barTotalWidth;
          const y = height - barHeight;

          const gradient = ctx.createLinearGradient(x, height, x, y);
          gradient.addColorStop(0, settings.secondaryColor);
          gradient.addColorStop(1, settings.primaryColor);

          ctx.fillStyle = gradient;
          
          // Draw rounded rect
          ctx.beginPath();
          ctx.roundRect(x, y, settings.barWidth, barHeight, [settings.barWidth / 2, settings.barWidth / 2, 0, 0]);
          ctx.fill();
        }
      } else if (settings.type === 'circle') {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = settings.radius;

        // Draw inner circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = settings.secondaryColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        const bars = Math.min(bufferLength, 180); // Limit bars for circle
        const angleStep = (Math.PI * 2) / bars;

        for (let i = 0; i < bars; i++) {
          const value = dataArray[i];
          const percent = value / 255;
          const barHeight = percent * (height / 2 - radius) * 0.8;
          
          const angle = i * angleStep - Math.PI / 2; // Start from top
          
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          
          const x2 = centerX + Math.cos(angle) * (radius + barHeight);
          const y2 = centerY + Math.sin(angle) * (radius + barHeight);

          const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, settings.secondaryColor);
          gradient.addColorStop(1, settings.primaryColor);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = settings.barWidth;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [analyser, settings, isPlaying, canvasRef]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
          // For recording, we want a fixed resolution or at least 1:1 pixel ratio
          // to avoid huge video files or scaling issues.
          // Let's use standard 1080p or match parent exactly without DPR scaling
          // to make recording easier.
          canvasRef.current.width = parent.clientWidth;
          canvasRef.current.height = parent.clientHeight;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: settings.bgColor }}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
