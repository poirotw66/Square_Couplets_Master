import React, { memo, useState, useEffect } from 'react';

interface ImageResultProps {
  imageUrl: string;
  isLoading: boolean;
}

export const ImageResult: React.FC<ImageResultProps> = memo(({ imageUrl, isLoading }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset error state when imageUrl changes
    setImageError(false);
  }, [imageUrl]);

  if (isLoading) {
    return (
      <div 
        className="w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-red-950/20 to-red-900/10 border-2 border-amber-500/30 rounded-xl backdrop-blur-sm flex flex-col items-center justify-center p-8 relative overflow-hidden gold-pulse"
        role="status"
        aria-live="polite"
        aria-label="Generating image"
      >
        {/* Decorative Pattern Background */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute top-8 left-8 text-6xl font-calligraphy text-amber-500">福</div>
          <div className="absolute bottom-8 right-8 text-6xl font-calligraphy text-amber-500">財</div>
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" aria-hidden="true"></div>
        
        <div className="relative z-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative" aria-hidden="true">
                 <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.2)]"></div>
                 <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                 <div className="absolute inset-4 bg-amber-500/10 rounded-full animate-pulse"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
                 </div>
            </div>
            <p className="text-2xl font-calligraphy text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-500 mb-2">Creating Art</p>
            <p className="text-amber-200/50 text-xs tracking-widest uppercase">Applying Ink Wash...</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) return null;

  return (
    <div className="relative group max-w-md mx-auto perspective-1000">
      
      {/* Main Art Container */}
      <div className="relative z-10 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.01]">
        
        {/* Gallery Mount (White Board) */}
        <div className="bg-[#fcfbf9] p-6 sm:p-8 rounded-sm shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)] border-2 border-amber-500/20 relative">
          {/* Decorative Red Paper Border */}
          <div className="absolute -inset-1 bg-gradient-to-br from-red-600 to-red-800 rounded-sm opacity-20 -z-10"></div>
           
           {/* Inner Shadow / Emboss for the cut-out */}
           <div className="relative w-full aspect-square overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] bg-gray-100">
                 {imageError ? (
                   <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-800 p-4">
                     <svg className="w-12 h-12 mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                     </svg>
                     <p className="text-sm font-medium text-center">圖片載入失敗</p>
                     <p className="text-xs text-red-600 mt-1 text-center">請重新生成圖片</p>
                   </div>
                 ) : (
                   <img 
                     src={imageUrl} 
                     alt="Generated Doufang artwork" 
                     className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                     loading="lazy"
                     onError={() => setImageError(true)}
                   />
                 )}
                 {/* Paper Texture Overlay */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-20 pointer-events-none mix-blend-multiply"></div>
                 
                 {/* Inner border detail */}
                 <div className="absolute inset-0 border border-black/5 pointer-events-none"></div>
           </div>

           {/* Artist Signature Simulation */}
           <div className="absolute bottom-3 right-8 opacity-40 mix-blend-multiply pointer-events-none">
              <div className="w-6 h-6 border border-red-800 bg-red-900/10 rounded-sm"></div>
           </div>
        </div>

        {/* Tassel Decoration */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none opacity-90 z-20">
             {/* Knot */}
            <div className="w-3 h-3 bg-red-800 rotate-45 rounded-sm shadow-md mb-0.5"></div>
            <div className="w-1 h-12 bg-red-700 shadow-sm"></div>
            {/* Fringe */}
            <div className="relative">
                <div className="w-10 h-16 bg-gradient-to-b from-red-800 to-red-600 rounded-b-xl shadow-lg blur-[0.5px]"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/vertical-lines.png')] opacity-30 mix-blend-overlay"></div>
            </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-20 flex justify-center animate-[fadeIn_1s_ease-out_forwards]">
        <a 
          href={imageUrl} 
          download="doufang-cny-2025.png"
          className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-red-950 transition duration-300 ease-out border-2 border-amber-500 rounded-full shadow-md hover:shadow-xl"
          aria-label="Download generated artwork"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-amber-600 group-hover:translate-x-0 ease">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-red-950 bg-amber-400 group-hover:translate-x-full ease">
            <span className="font-bold tracking-widest uppercase text-sm">Download Artwork</span>
          </span>
          <span className="relative invisible">Download Artwork</span>
        </a>
      </div>
    </div>
  );
});

ImageResult.displayName = 'ImageResult';