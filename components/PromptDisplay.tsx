import React, { useState } from 'react';

interface PromptDisplayProps {
  promptText: string;
  blessingPhrase: string;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ promptText, blessingPhrase }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
      
      <div className="relative bg-gradient-to-br from-red-950/90 via-red-900/80 to-red-950/90 border-2 border-amber-500/30 rounded-xl p-1 backdrop-blur-sm shadow-2xl gold-pulse">
        {/* Decorative Corners */}
        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg pointer-events-none"></div>
        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg pointer-events-none"></div>
        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg pointer-events-none"></div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg pointer-events-none"></div>
        
        <div className="border-2 border-amber-900/50 rounded-lg p-6 md:p-8 flex flex-col h-full bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] relative">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-500/10">
            <span className="text-amber-500/40 text-xs font-bold tracking-widest uppercase">
              Gemini Vision
            </span>
            <div className="flex gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60"></div>
            </div>
          </div>

          <div className="text-center mb-8 relative">
             {/* Decorative Chinese Characters */}
             <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-2xl font-calligraphy text-amber-500/20">「</div>
             <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-2xl font-calligraphy text-amber-500/20">」</div>
             
             <div className="inline-block relative">
                <span className="absolute -inset-4 blur-xl bg-gradient-to-r from-red-500/20 via-amber-500/20 to-red-500/20 rounded-full"></span>
                <div className="relative text-5xl md:text-6xl font-calligraphy-blessing text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" style={{ fontFamily: '"LXGW WenKai Screen", "LXGW WenKai", "华文行楷", "STXingkai", "STKaiti", "KaiTi", "標楷體", "楷體", "SimKai", "DFKai-SB", "BiauKai", cursive, serif' }}>
                  {blessingPhrase}
                </div>
             </div>
             <div className="mt-4 flex items-center justify-center gap-2">
               <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-500/40"></div>
               <p className="text-amber-500/50 text-xs tracking-widest uppercase">Blessing Inscription</p>
               <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-500/40"></div>
             </div>
          </div>

          <div className="relative flex-1 bg-black/20 rounded-lg p-4 font-mono text-xs md:text-sm text-amber-100/70 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar border border-white/5 shadow-inner">
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-amber-500/30"></div>
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber-500/30"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber-500/30"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-amber-500/30"></div>
            {promptText}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCopy}
              className={`
                group/btn relative px-6 py-2 rounded-full border transition-all duration-300 overflow-hidden
                ${copied 
                  ? 'bg-green-900/30 border-green-500/50 text-green-400' 
                  : 'bg-amber-900/10 border-amber-500/20 text-amber-400 hover:border-amber-500/50 hover:bg-amber-900/30'
                }
              `}
            >
              <span className="relative z-10 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                    <span>Copy Prompt</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};