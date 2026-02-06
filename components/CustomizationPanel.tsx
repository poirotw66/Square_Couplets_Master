import React, { memo, useState } from 'react';
import type { CustomizationOptions, ArtStyle, ColorTheme, CalligraphyStyle, DecorationLevel } from '../types';

interface CustomizationPanelProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
  disabled?: boolean;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = memo(({ 
  options, 
  onChange, 
  disabled = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateOption = <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  // Expanded art style options
  const artStyleOptions: { value: ArtStyle; label: string; description: string }[] = [
    { value: 'traditional', label: '傳統風格', description: '經典傳統水墨畫風格' },
    { value: 'modern', label: '現代風格', description: '融合現代設計元素' },
    { value: 'minimalist', label: '簡約風格', description: '簡潔優雅的設計' },
    { value: 'luxurious', label: '華麗風格', description: '豐富的裝飾與細節' },
    { value: 'vintage', label: '復古風格', description: '懷舊復古的設計風格' },
    { value: 'contemporary', label: '當代風格', description: '當代藝術風格' },
    { value: 'abstract', label: '抽象風格', description: '抽象藝術表現' },
    { value: 'realistic', label: '寫實風格', description: '寫實主義風格' },
    { value: 'custom', label: '自定義', description: '輸入自己的風格描述' },
  ];

  // Expanded color theme options
  const colorThemeOptions: { value: ColorTheme; label: string; description: string }[] = [
    { value: 'classic-red-gold', label: '經典紅金', description: '傳統紅金配色' },
    { value: 'elegant-subtle', label: '淡雅色調', description: '柔和優雅的色彩' },
    { value: 'vibrant-rich', label: '濃郁色彩', description: '鮮豔豐富的配色' },
    { value: 'monochrome', label: '單色調', description: '黑白灰單色風格' },
    { value: 'pastel-soft', label: '粉彩柔和', description: '粉彩色調柔和風格' },
    { value: 'deep-mysterious', label: '深邃神秘', description: '深色神秘色調' },
    { value: 'warm-earth', label: '暖色大地', description: '暖色調大地色系' },
    { value: 'cool-blue', label: '冷色藍調', description: '冷色調藍色系' },
    { value: 'custom', label: '自定義', description: '輸入自己的顏色描述' },
  ];

  // Expanded calligraphy style options
  const calligraphyStyleOptions: { value: CalligraphyStyle; label: string; description: string }[] = [
    { value: 'kaishu', label: '楷書', description: '端莊工整的楷書字體' },
    { value: 'xingshu', label: '行書', description: '流暢優雅的行書字體' },
    { value: 'caoshu', label: '草書', description: '奔放瀟灑的草書字體' },
    { value: 'lishu', label: '隸書', description: '古樸典雅的隸書字體' },
    { value: 'zhuanshu', label: '篆書', description: '古樸典雅的篆書字體' },
    { value: 'weibei', label: '魏碑', description: '剛勁有力的魏碑字體' },
    { value: 'custom', label: '自定義', description: '輸入自己的字體描述' },
  ];

  // Expanded decoration level options
  const decorationLevelOptions: { value: DecorationLevel; label: string; description: string }[] = [
    { value: 'minimal', label: '簡約', description: '最少裝飾元素' },
    { value: 'moderate', label: '適中', description: '平衡的裝飾' },
    { value: 'rich', label: '豐富', description: '豐富的裝飾細節' },
    { value: 'extravagant', label: '極致', description: '極致華麗的裝飾' },
    { value: 'custom', label: '自定義', description: '輸入自己的裝飾描述' },
  ];

  // Helper function to get display label
  const getDisplayLabel = (
    value: ArtStyle | ColorTheme | CalligraphyStyle | DecorationLevel,
    options: Array<{ value: any; label: string }>
  ): string => {
    if (value === 'custom') {
      return '自定義';
    }
    return options.find(o => o.value === value)?.label || value;
  };

  // Handle option click
  const handleOptionClick = (
    category: 'artStyle' | 'colorTheme' | 'calligraphyStyle' | 'decorationLevel',
    value: ArtStyle | ColorTheme | CalligraphyStyle | DecorationLevel
  ) => {
    if (disabled) return;

    const nextOptions: CustomizationOptions = {
      ...options,
      [category]: value
    };

    if (value !== 'custom') {
      if (category === 'artStyle') {
        nextOptions.customArtStyle = undefined;
      } else if (category === 'colorTheme') {
        nextOptions.customColorTheme = undefined;
      } else if (category === 'calligraphyStyle') {
        nextOptions.customCalligraphyStyle = undefined;
      } else if (category === 'decorationLevel') {
        nextOptions.customDecorationLevel = undefined;
      }
    }

    onChange(nextOptions);
  };

  return (
    <div className="mt-6 relative">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-950/40 to-red-900/40 border-2 border-amber-500/30 rounded-xl hover:border-amber-500/50 transition-all duration-300 group"
        aria-expanded={isExpanded}
        aria-label="Toggle customization options"
      >
        <div className="flex items-center gap-3">
          <svg 
            className={`w-5 h-5 text-amber-500/60 group-hover:text-amber-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
          <span className="text-amber-200/80 font-serif font-medium">自定義選項</span>
          <span className="text-xs text-amber-500/50">（可選）</span>
        </div>
        <div className="flex gap-2">
          {!isExpanded && (
            <div className="flex gap-1 flex-wrap">
              <span className="text-xs text-amber-500/40 px-2 py-1 bg-amber-900/20 rounded">
                {getDisplayLabel(options.artStyle, artStyleOptions)}
              </span>
              <span className="text-xs text-amber-500/40 px-2 py-1 bg-amber-900/20 rounded">
                {getDisplayLabel(options.calligraphyStyle, calligraphyStyleOptions)}
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="mt-4 p-6 bg-gradient-to-br from-red-950/50 to-red-900/40 border-2 border-amber-500/20 rounded-xl space-y-6 animate-[fadeIn_0.3s_ease-out]">
          {/* Art Style */}
          <div>
            <label className="block text-amber-200/80 text-sm font-bold mb-3">
              藝術風格
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              {artStyleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleOptionClick('artStyle', option.value)}
                  className={`
                    relative cursor-pointer border rounded-lg p-3 transition-all duration-300 block text-left w-full
                    ${options.artStyle === option.value
                      ? 'bg-amber-900/40 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-black/20 border-amber-900/30 hover:bg-amber-900/20'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="text-center">
                    <div className="font-medium text-amber-200 text-sm mb-1">{option.label}</div>
                    <div className="text-xs text-amber-500/60">{option.description}</div>
                  </div>
                  {options.artStyle === option.value && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
            {options.artStyle === 'custom' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={options.customArtStyle || ''}
                  onChange={(e) => updateOption('customArtStyle', e.target.value || undefined)}
                  placeholder="例如：水彩畫風格、油畫風格、數位藝術風格..."
                  disabled={disabled}
                  maxLength={100}
                  className="w-full bg-black/40 border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-500/20 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                <p className="mt-2 text-xs text-amber-500/40">
                  請描述您想要的藝術風格
                </p>
              </div>
            )}
          </div>

          {/* Color Theme */}
          <div>
            <label className="block text-amber-200/80 text-sm font-bold mb-3">
              顏色主題
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              {colorThemeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleOptionClick('colorTheme', option.value)}
                  className={`
                    relative cursor-pointer border rounded-lg p-3 transition-all duration-300 block text-left w-full
                    ${options.colorTheme === option.value
                      ? 'bg-amber-900/40 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-black/20 border-amber-900/30 hover:bg-amber-900/20'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="text-center">
                    <div className="font-medium text-amber-200 text-sm mb-1">{option.label}</div>
                    <div className="text-xs text-amber-500/60">{option.description}</div>
                  </div>
                  {options.colorTheme === option.value && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
            {options.colorTheme === 'custom' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={options.customColorTheme || ''}
                  onChange={(e) => updateOption('customColorTheme', e.target.value || undefined)}
                  placeholder="例如：深紫色配金色、綠色配白色、漸層藍紫色..."
                  disabled={disabled}
                  maxLength={100}
                  className="w-full bg-black/40 border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-500/20 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                <p className="mt-2 text-xs text-amber-500/40">
                  請描述您想要的顏色搭配
                </p>
              </div>
            )}
          </div>

          {/* Calligraphy Style */}
          <div>
            <label className="block text-amber-200/80 text-sm font-bold mb-3">
              書法字體
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              {calligraphyStyleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleOptionClick('calligraphyStyle', option.value)}
                  className={`
                    relative cursor-pointer border rounded-lg p-3 transition-all duration-300 block text-left w-full
                    ${options.calligraphyStyle === option.value
                      ? 'bg-amber-900/40 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-black/20 border-amber-900/30 hover:bg-amber-900/20'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="text-center">
                    <div className="font-medium text-amber-200 text-sm mb-1">{option.label}</div>
                    <div className="text-xs text-amber-500/60">{option.description}</div>
                  </div>
                  {options.calligraphyStyle === option.value && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
            {options.calligraphyStyle === 'custom' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={options.customCalligraphyStyle || ''}
                  onChange={(e) => updateOption('customCalligraphyStyle', e.target.value || undefined)}
                  placeholder="例如：仿宋體風格、手寫風格、現代字體風格..."
                  disabled={disabled}
                  maxLength={100}
                  className="w-full bg-black/40 border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-500/20 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                <p className="mt-2 text-xs text-amber-500/40">
                  請描述您想要的字體風格
                </p>
              </div>
            )}
          </div>

          {/* Decoration Level */}
          <div>
            <label className="block text-amber-200/80 text-sm font-bold mb-3">
              裝飾程度
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              {decorationLevelOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleOptionClick('decorationLevel', option.value)}
                  className={`
                    relative cursor-pointer border rounded-lg p-3 transition-all duration-300 text-center block w-full
                    ${options.decorationLevel === option.value
                      ? 'bg-amber-900/40 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-black/20 border-amber-900/30 hover:bg-amber-900/20'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="font-medium text-amber-200 text-sm mb-1">{option.label}</div>
                  <div className="text-xs text-amber-500/60">{option.description}</div>
                  {options.decorationLevel === option.value && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
            {options.decorationLevel === 'custom' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={options.customDecorationLevel || ''}
                  onChange={(e) => updateOption('customDecorationLevel', e.target.value || undefined)}
                  placeholder="例如：僅有邊框裝飾、大量花卉圖案、幾何圖形裝飾..."
                  disabled={disabled}
                  maxLength={100}
                  className="w-full bg-black/40 border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-500/20 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                <p className="mt-2 text-xs text-amber-500/40">
                  請描述您想要的裝飾風格和程度
                </p>
              </div>
            )}
          </div>

          {/* Custom Blessing Phrase (Optional) */}
          <div>
            <label className="block text-amber-200/80 text-sm font-bold mb-3">
              自訂祝福語（選填）
            </label>
            <input
              type="text"
              value={options.customBlessingPhrase || ''}
              onChange={(e) => updateOption('customBlessingPhrase', e.target.value || undefined)}
              placeholder="例如：萬事如意（留空則自動生成）"
              disabled={disabled}
              maxLength={8}
              className="w-full bg-black/40 border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-500/20 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
            />
            <p className="mt-2 text-xs text-amber-500/40">
              可輸入 4-8 個中文字作為祝福語，留空則由 AI 自動生成
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

CustomizationPanel.displayName = 'CustomizationPanel';
