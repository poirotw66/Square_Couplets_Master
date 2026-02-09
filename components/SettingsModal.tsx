import React, { useEffect, useState, memo, useCallback } from 'react';
import type { ImageModel, ImageSize } from '../types';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  imageModel: ImageModel;
  setImageModel: (model: ImageModel) => void;
  imageSize: ImageSize;
  setImageSize: (size: ImageSize) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = memo(({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  imageModel,
  setImageModel,
  imageSize,
  setImageSize
}) => {
  const [showKey, setShowKey] = useState(false);
  const [hasAIStudio, setHasAIStudio] = useState(false);

  useEffect(() => {
    setHasAIStudio(!!window.aistudio);
  }, []);

  const handleAIStudioSelect = useCallback(async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // We don't get the key string back, but the system environment is updated.
        // We might want to clear the manual key to prioritize the system one, 
        // or just let the user know.
      } catch (e) {
        console.error("AI Studio key selection failed", e);
      }
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-gradient-to-br from-red-950/95 via-red-900/90 to-red-950/95 border-2 border-amber-500/40 w-full max-w-lg rounded-2xl p-8 shadow-2xl transform transition-all animate-[fadeIn_0.3s_ease-out] gold-pulse">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>

        {/* Decorative Corners */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500/60 rounded-tl-lg pointer-events-none"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500/60 rounded-tr-lg pointer-events-none"></div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500/60 rounded-bl-lg pointer-events-none"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500/60 rounded-br-lg pointer-events-none"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-4 left-4 text-4xl font-calligraphy text-amber-500">設</div>
          <div className="absolute bottom-4 right-4 text-4xl font-calligraphy text-amber-500">置</div>
        </div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 flex items-center gap-3">
            <span className="text-amber-500 text-3xl">⚙</span> Configuration
          </h2>
          <button
            onClick={onClose}
            className="text-amber-500/50 hover:text-amber-200 transition-colors"
            aria-label="Close settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* API Key Section */}
          <div>
            <label className="block text-amber-200/80 text-sm font-bold tracking-wider uppercase mb-3">
              Gemini API Key
            </label>

            {hasAIStudio && (
              <button
                onClick={handleAIStudioSelect}
                className="w-full mb-4 py-2 px-4 bg-blue-900/30 border border-blue-500/30 hover:bg-blue-800/40 text-blue-200 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                Select Key via Google AI Studio
              </button>
            )}

            <div className="relative group">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your API key here"
                className="w-full bg-black/40 border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-500/20 focus:outline-none focus:border-amber-500/50 transition-colors font-mono text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500/30 hover:text-amber-500/70"
              >
                {showKey ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                )}
              </button>
              <div className="absolute inset-0 border border-amber-500/20 rounded-lg pointer-events-none group-hover:border-amber-500/40 transition-colors"></div>
            </div>
            <p className="mt-2 text-xs text-amber-500/40">
              Leave blank to use the default key provided by the server.
            </p>
          </div>

          {/* Model Selection Section */}
          <div>
            <label className="block text-amber-200/80 text-sm font-bold tracking-wider uppercase mb-3">
              Image Generation Model
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Option 1: Flash */}
              <label className={`
                relative cursor-pointer border rounded-xl p-4 transition-all duration-300
                ${imageModel === 'gemini-2.5-flash-image'
                  ? 'bg-amber-900/40 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-black/20 border-amber-900/30 hover:bg-amber-900/20'}
              `}>
                <input
                  type="radio"
                  name="model"
                  value="gemini-2.5-flash-image"
                  checked={imageModel === 'gemini-2.5-flash-image'}
                  onChange={(e) => {
                    setImageModel(e.target.value);
                    // Flash model may only support 1K, auto-reset to 1K
                    if (imageSize !== '1K') {
                      setImageSize('1K');
                    }
                  }}
                  className="sr-only"
                />
                <div className="flex flex-col h-full">
                  <span className="font-bold text-amber-200 mb-1">Gemini 2.5 Flash</span>
                  <span className="text-xs text-amber-500/60 leading-relaxed">
                    Fast generation. Efficient. Good for quick iterations.
                  </span>
                  {imageModel === 'gemini-2.5-flash-image' && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                  )}
                </div>
              </label>

              {/* Option 2: Pro */}
              <label className={`
                relative cursor-pointer border rounded-xl p-4 transition-all duration-300
                ${imageModel === 'gemini-3-pro-image-preview'
                  ? 'bg-amber-900/40 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-black/20 border-amber-900/30 hover:bg-amber-900/20'}
              `}>
                <input
                  type="radio"
                  name="model"
                  value="gemini-3-pro-image-preview"
                  checked={imageModel === 'gemini-3-pro-image-preview'}
                  onChange={(e) => setImageModel(e.target.value)}
                  className="sr-only"
                />
                <div className="flex flex-col h-full">
                  <span className="font-bold text-amber-200 mb-1">Gemini 3 Pro</span>
                  <span className="text-xs text-amber-500/60 leading-relaxed">
                    High fidelity. Superior detail and lighting.
                  </span>
                  {imageModel === 'gemini-3-pro-image-preview' && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                  )}
                </div>
              </label>

            </div>
          </div>

          {/* Image Size Selection Section */}
          <div>
            <label className="block text-amber-200/80 text-sm font-bold tracking-wider uppercase mb-3">
              Image Output Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['1K', '2K', '4K'] as ImageSize[]).map((size) => {
                // Flash model may only support 1K, show warning for higher resolutions
                const isFlashModel = imageModel === 'gemini-2.5-flash-image';
                const isUnsupported = isFlashModel && size !== '1K';

                return (
                  <label
                    key={size}
                    className={`
                      relative cursor-pointer border rounded-xl p-4 transition-all duration-300 text-center
                      ${imageSize === size
                        ? 'bg-amber-900/40 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-black/20 border-amber-900/30 hover:bg-amber-900/20'}
                      ${isUnsupported ? 'opacity-60' : ''}
                    `}
                    title={isUnsupported ? 'Flash model may only support 1K. Use Pro model for higher resolutions.' : ''}
                  >
                    <input
                      type="radio"
                      name="imageSize"
                      value={size}
                      checked={imageSize === size}
                      onChange={(e) => setImageSize(e.target.value as ImageSize)}
                      className="sr-only"
                      disabled={isUnsupported}
                    />
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-amber-200 text-lg mb-1">{size}</span>
                      <span className="text-xs text-amber-500/60">
                        {size === '1K' ? '1024×1024' : size === '2K' ? '2048×2048' : '4096×4096'}
                      </span>
                      {isUnsupported && (
                        <span className="text-xs text-red-400/60 mt-1">Pro only</span>
                      )}
                      {imageSize === size && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-amber-500/40">
              {imageModel === 'gemini-2.5-flash-image'
                ? '⚠️ Flash model only supports default 1K (1024×1024) resolution. Use Pro model for 2K/4K.'
                : 'Higher resolution requires more generation time and may consume more API credits.'}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end relative z-10">
          <button
            onClick={onClose}
            className="relative px-8 py-3 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 text-red-950 font-bold rounded-full hover:from-amber-400 hover:via-amber-500 hover:to-amber-600 transition-all shadow-lg text-sm tracking-wide overflow-hidden group/btn"
          >
            <span className="relative z-10">Save & Close</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  );
});

SettingsModal.displayName = 'SettingsModal';