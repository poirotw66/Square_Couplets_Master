import React, { memo } from 'react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = memo(({ onOpenSettings }) => {
  return (
    <header className="text-center py-12 px-4 relative z-10 w-full">
      {/* Decorative Lanterns */}
      <div className="absolute top-4 left-4 md:left-8 lantern-glow pointer-events-none">
        <div className="relative">
          <div className="w-12 h-16 bg-gradient-to-b from-red-600 to-red-800 rounded-full border-2 border-amber-500 shadow-lg">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-400 rounded-full opacity-80"></div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-amber-600"></div>
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full"></div>
        </div>
      </div>
      
      <div className="absolute top-4 right-16 md:right-24 lantern-glow pointer-events-none" style={{ animationDelay: '1s' }}>
        <div className="relative">
          <div className="w-12 h-16 bg-gradient-to-b from-red-600 to-red-800 rounded-full border-2 border-amber-500 shadow-lg">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-400 rounded-full opacity-80"></div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-amber-600"></div>
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full"></div>
        </div>
      </div>

      {/* Settings Button */}
      <button 
        onClick={onOpenSettings}
        className="absolute top-6 right-6 md:top-8 md:right-8 p-3 bg-red-950/40 backdrop-blur-md border border-amber-500/20 rounded-full text-amber-500/60 hover:text-amber-200 hover:border-amber-500/50 hover:bg-red-900/60 transition-all duration-300 group z-20"
        title="Settings"
      >
        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </button>

      {/* Traditional Decorative Border Top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 md:w-96 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-4">
        <div className="w-2 h-2 bg-amber-500 rounded-full twinkle"></div>
        <div className="w-2 h-2 bg-red-500 rounded-full twinkle" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-2 h-2 bg-amber-500 rounded-full twinkle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="inline-flex items-center gap-2 border-2 border-amber-500/40 px-6 py-2 rounded-full mb-8 bg-gradient-to-r from-red-950/60 via-red-900/60 to-red-950/60 backdrop-blur-md shadow-2xl transition-transform hover:scale-105 duration-500 gold-pulse">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
        <span className="text-amber-200 text-xs tracking-[0.3em] font-bold uppercase">Chinese New Year 2025</span>
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
      </div>
      
      <h1 className="text-6xl md:text-8xl font-calligraphy text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] mb-4 animate-float relative">
        <span className="relative z-10">春聯斗方大師</span>
        {/* Text Glow Effect */}
        <span className="absolute inset-0 text-6xl md:text-8xl font-calligraphy text-amber-500/30 blur-xl -z-10">春聯斗方大師</span>
      </h1>
      
      {/* Decorative Chinese Characters */}
      <div className="flex justify-center gap-8 mb-4 opacity-30">
        <span className="text-3xl font-calligraphy text-amber-500/40">福</span>
        <span className="text-3xl font-calligraphy text-red-500/40">財</span>
        <span className="text-3xl font-calligraphy text-amber-500/40">壽</span>
      </div>
      
      <h2 className="text-lg md:text-xl text-amber-100/70 font-serif tracking-[0.3em] uppercase mb-8">
        The Art of Blessing
      </h2>
      
      <p className="max-w-md mx-auto text-amber-200/50 font-light text-sm leading-relaxed">
        Transform your wishes into masterpieces. Experience the fusion of traditional ink wash painting and modern AI generation.
      </p>
      
      {/* Decorative Border Bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 md:w-96 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
    </header>
  );
});

Header.displayName = 'Header';