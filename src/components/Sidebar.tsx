import React from 'react';
import { VisualizerSettings } from '../types';

interface Props {
  settings: VisualizerSettings;
  onChange: (settings: VisualizerSettings) => void;
}

export function Sidebar({ settings, onChange }: Props) {
  const handleChange = (key: keyof VisualizerSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="w-80 bg-[#151619] border-l border-white/10 h-full flex flex-col text-white overflow-y-auto">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-lg font-semibold tracking-tight">Visualizer Settings</h2>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Type */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Type</label>
          <div className="grid grid-cols-3 gap-2">
            {['bars', 'waveform', 'circle'].map((t) => (
              <button
                key={t}
                onClick={() => handleChange('type', t)}
                className={`px-3 py-2 text-xs font-medium rounded-md capitalize transition-colors ${
                  settings.type === t 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Colors</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Primary</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs font-mono">{settings.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Secondary</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs font-mono">{settings.secondaryColor}</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Background</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.bgColor}
                  onChange={(e) => handleChange('bgColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs font-mono">{settings.bgColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Analysis */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Audio Analysis</label>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs text-gray-300">Smoothing</label>
                <span className="text-xs font-mono text-gray-500">{settings.smoothing.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0" max="0.99" step="0.01"
                value={settings.smoothing}
                onChange={(e) => handleChange('smoothing', parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs text-gray-300">FFT Size (Resolution)</label>
                <span className="text-xs font-mono text-gray-500">{settings.fftSize}</span>
              </div>
              <select 
                value={settings.fftSize}
                onChange={(e) => handleChange('fftSize', parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {[256, 512, 1024, 2048, 4096, 8192].map(size => (
                  <option key={size} value={size} className="bg-[#151619]">{size}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Geometry */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Geometry</label>
          
          <div className="space-y-5">
            {(settings.type === 'bars' || settings.type === 'circle' || settings.type === 'waveform') && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-300">Line/Bar Width</label>
                  <span className="text-xs font-mono text-gray-500">{settings.barWidth}px</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="20" step="1"
                  value={settings.barWidth}
                  onChange={(e) => handleChange('barWidth', parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            )}

            {settings.type === 'bars' && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-300">Bar Spacing</label>
                  <span className="text-xs font-mono text-gray-500">{settings.barSpacing}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="20" step="1"
                  value={settings.barSpacing}
                  onChange={(e) => handleChange('barSpacing', parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            )}

            {settings.type === 'circle' && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-300">Radius</label>
                  <span className="text-xs font-mono text-gray-500">{settings.radius}px</span>
                </div>
                <input 
                  type="range" 
                  min="50" max="400" step="10"
                  value={settings.radius}
                  onChange={(e) => handleChange('radius', parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
