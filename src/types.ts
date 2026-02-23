export interface VisualizerSettings {
  type: 'bars' | 'waveform' | 'circle';
  primaryColor: string;
  secondaryColor: string;
  fftSize: number;
  barWidth: number;
  barSpacing: number;
  radius: number;
  smoothing: number;
  bgColor: string;
}
