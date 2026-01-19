import React, { useState } from 'react';
import { Header } from './components/Header';
import { PromptDisplay } from './components/PromptDisplay';
import { ImageResult } from './components/ImageResult';
import { SettingsModal } from './components/SettingsModal';
import { generateDoufangPrompt, generateDoufangImage } from './services/geminiService';
import { GenerationStatus } from './types';

const App: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [result, setResult] = useState<{
    prompt: string;
    blessingPhrase: string;
    imageUrl: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [imageModel, setImageModel] = useState('gemini-2.5-flash-image');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setStatus(GenerationStatus.PROCESSING_PROMPT);
    setError(null);
    setResult(null);

    try {
      // Step 1: Generate Prompt
      const promptData = await generateDoufangPrompt(keyword, apiKey);
      
      setResult({
        prompt: promptData.imagePrompt,
        blessingPhrase: promptData.blessingPhrase,
        imageUrl: ''
      });

      setStatus(GenerationStatus.PROCESSING_IMAGE);

      // Step 2: Generate Image
      const imageBase64 = await generateDoufangImage(promptData.imagePrompt, apiKey, imageModel);
      
      setResult(prev => prev ? { ...prev, imageUrl: imageBase64 } : null);
      setStatus(GenerationStatus.COMPLETED);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus(GenerationStatus.ERROR);
    }
  };

  const handleSwitchToFlash = () => {
    setImageModel('gemini-2.5-flash-image');
    setError(null);
    setStatus(GenerationStatus.IDLE);
    // Optionally auto-retry, but better to let user click generate again
    setIsSettingsOpen(true); // Open settings to show the change
  };

  return (
    <div className="min-h-screen pb-20 px-4 flex flex-col items-center max-w-6xl mx-auto selection:bg-amber-500/30 relative pattern-overlay">
      {/* Confetti Effect */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        />
      ))}
      
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        imageModel={imageModel}
        setImageModel={setImageModel}
      />

      <main className="w-full max-w-5xl space-y-16">
        
        {/* Input Section - Hero Style */}
        <section className="relative max-w-2xl mx-auto z-20">
          {/* Decorative Fireworks */}
          <div className="absolute -top-8 left-1/4 w-2 h-2 bg-amber-400 rounded-full firework pointer-events-none" style={{ animationDelay: '0s' }}></div>
          <div className="absolute -top-8 right-1/4 w-2 h-2 bg-red-400 rounded-full firework pointer-events-none" style={{ animationDelay: '1.5s' }}></div>
          
          <div className="absolute inset-0 bg-red-600/20 blur-[60px] rounded-full pointer-events-none"></div>
          
          {/* Traditional Decorative Corners */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500/40 pointer-events-none"></div>
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500/40 pointer-events-none"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500/40 pointer-events-none"></div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500/40 pointer-events-none"></div>
          
          <form onSubmit={handleSubmit} className="relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-500 blur-sm gold-pulse"></div>
             <div className="relative flex items-center bg-gradient-to-br from-red-950 via-red-900 to-red-950 border-2 border-amber-500/30 rounded-xl overflow-hidden shadow-2xl p-1 red-envelope-style">
                
                <div className="pl-4 text-amber-500/50">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </div>

                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter your wish (e.g. Wealth, Love)..."
                  className="flex-1 bg-transparent text-amber-100 px-4 py-4 focus:outline-none text-lg placeholder-amber-700/50 font-serif focus:placeholder-amber-600/30 transition-colors"
                  disabled={status === GenerationStatus.PROCESSING_PROMPT || status === GenerationStatus.PROCESSING_IMAGE}
                />
                
                <button
                  type="submit"
                  disabled={!keyword.trim() || status === GenerationStatus.PROCESSING_PROMPT || status === GenerationStatus.PROCESSING_IMAGE}
                  className="relative bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-red-950 font-bold px-8 py-3 rounded-lg hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all shadow-lg text-sm tracking-widest uppercase mx-1 overflow-hidden group/btn"
                >
                  <span className="relative z-10">{status === GenerationStatus.IDLE || status === GenerationStatus.COMPLETED || status === GenerationStatus.ERROR 
                    ? 'Generate' 
                    : 'Crafting'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                </button>
             </div>
          </form>
          
          {/* Suggestions */}
          <div className="flex gap-3 mt-8 justify-center flex-wrap">
            {['Wealth & Prosperity', 'Career Success', 'Love & Harmony', 'Health & Longevity', 'Academic Wisdom'].map((suggestion, index) => (
              <button 
                key={suggestion}
                onClick={() => setKeyword(suggestion)}
                className="group relative px-5 py-2 rounded-full bg-gradient-to-r from-red-950/50 to-red-900/50 border-2 border-amber-900/40 hover:border-amber-500/60 hover:bg-gradient-to-r hover:from-red-900/70 hover:to-red-800/70 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-xs text-amber-500/70 group-hover:text-amber-200 transition-colors font-serif italic font-medium">
                  {suggestion}
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto bg-red-950/90 border border-red-500/50 text-red-200 p-4 rounded-xl text-center shadow-lg animate-bounce flex flex-col items-center">
            <span className="block font-bold mb-1 text-red-400">Error Encountered</span>
            <span className="mb-3 text-sm">{error}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="px-4 py-2 bg-red-900/50 border border-red-500 text-red-200 text-xs rounded hover:bg-red-800 transition-colors"
              >
                Configure Settings
              </button>
              {error.includes("Paid API Key") && imageModel.includes("pro") && (
                 <button 
                 onClick={handleSwitchToFlash}
                 className="px-4 py-2 bg-amber-600/20 border border-amber-500 text-amber-300 text-xs rounded hover:bg-amber-600/40 transition-colors"
               >
                 Switch to Flash Model (Free Friendly)
               </button>
              )}
            </div>
          </div>
        )}

        {/* Results Grid - Asymmetric Layout */}
        {(result || status === GenerationStatus.PROCESSING_PROMPT || status === GenerationStatus.PROCESSING_IMAGE) && (
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start animate-[fadeIn_0.8s_ease-out]">
            
            {/* Left: Text Prompt (4 cols) */}
            <div className="md:col-span-5 order-2 md:order-1 sticky top-8">
              {result?.prompt && (
                <PromptDisplay 
                  promptText={result.prompt} 
                  blessingPhrase={result.blessingPhrase} 
                />
              )}
              {status === GenerationStatus.PROCESSING_PROMPT && (
                 <div className="h-64 flex flex-col items-center justify-center bg-gradient-to-br from-red-950/30 to-red-900/20 rounded-xl border-2 border-amber-900/30 backdrop-blur-sm animate-pulse relative overflow-hidden">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 text-4xl font-calligraphy text-amber-500/20">福</div>
                      <div className="absolute bottom-4 right-4 text-4xl font-calligraphy text-amber-500/20">財</div>
                    </div>
                    <div className="relative z-10 w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)]"></div>
                    <p className="text-amber-500/70 font-serif italic text-sm">Consulting the ancient texts...</p>
                 </div>
              )}
            </div>

            {/* Right: Image (7 cols) - Larger Emphasis */}
            <div className="md:col-span-7 order-1 md:order-2">
               <ImageResult 
                  imageUrl={result?.imageUrl || ''} 
                  isLoading={status === GenerationStatus.PROCESSING_IMAGE} 
               />
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto pt-24 pb-8 text-center relative">
        {/* Decorative Border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 md:w-96 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-4">
          <div className="w-1.5 h-1.5 bg-amber-500/40 rounded-full twinkle"></div>
          <div className="w-1.5 h-1.5 bg-red-500/40 rounded-full twinkle" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-1.5 h-1.5 bg-amber-500/40 rounded-full twinkle" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="mt-8 mb-4">
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-900/50 to-transparent mx-auto mb-4"></div>
          <p className="text-amber-900/50 text-xs font-serif tracking-widest uppercase">
            Powered by Google Gemini 2.5 & 3.0
          </p>
          <p className="text-amber-900/30 text-xs font-serif mt-2 italic">
            May your year be filled with prosperity and joy
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;