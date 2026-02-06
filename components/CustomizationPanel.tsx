import React, { useEffect, useState } from 'react';
import type { CustomizationOptions, ArtStyle, ColorTheme, CalligraphyStyle, DecorationLevel } from '../types';
import { OptionGroup } from './OptionGroup';

interface CustomizationPanelProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
  disabled?: boolean;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ 
  options, 
  onChange, 
  disabled = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isComposingBlessing, setIsComposingBlessing] = useState(false);
  const [blessingDraft, setBlessingDraft] = useState(options.customBlessingPhrase ?? '');

  useEffect(() => {
    if (!isComposingBlessing) {
      setBlessingDraft(options.customBlessingPhrase ?? '');
    }
  }, [isComposingBlessing, options.customBlessingPhrase]);

  const updateOption = <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => {
    // Create new options object with updated value
    const newOptions: CustomizationOptions = { 
      ...options, 
      [key]: value 
    };
    // Call onChange to update parent state
    onChange(newOptions);
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

  const normalizeBlessingPhrase = (value: string): string => {
    return value.replace(/[^\u4e00-\u9fa5]/g, '').slice(0, 8);
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
        <div className="mt-4 p-6 bg-gradient-to-br from-red-950/50 to-red-900/40 border-2 border-amber-500/20 rounded-xl space-y-6 animate-[fadeIn_0.3s_ease-out]" style={{ pointerEvents: 'auto' }}>
          {/* Art Style */}
          <OptionGroup
            title="藝術風格"
            options={artStyleOptions}
            selectedValue={options.artStyle}
            onSelect={(value) => handleOptionClick('artStyle', value)}
            disabled={disabled}
            customValue={options.customArtStyle}
            onCustomValueChange={(value) => updateOption('customArtStyle', value)}
            customPlaceholder="例如：水彩畫風格、油畫風格、數位藝術風格..."
            customHelpText="請描述您想要的藝術風格"
          />

          {/* Color Theme */}
          <OptionGroup
            title="顏色主題"
            options={colorThemeOptions}
            selectedValue={options.colorTheme}
            onSelect={(value) => handleOptionClick('colorTheme', value)}
            disabled={disabled}
            customValue={options.customColorTheme}
            onCustomValueChange={(value) => updateOption('customColorTheme', value)}
            customPlaceholder="例如：深紫色配金色、綠色配白色、漸層藍紫色..."
            customHelpText="請描述您想要的顏色搭配"
          />

          {/* Calligraphy Style */}
          <OptionGroup
            title="書法字體"
            options={calligraphyStyleOptions}
            selectedValue={options.calligraphyStyle}
            onSelect={(value) => handleOptionClick('calligraphyStyle', value)}
            disabled={disabled}
            customValue={options.customCalligraphyStyle}
            onCustomValueChange={(value) => updateOption('customCalligraphyStyle', value)}
            customPlaceholder="例如：仿宋體風格、手寫風格、現代字體風格..."
            customHelpText="請描述您想要的字體風格"
          />

          {/* Decoration Level */}
          <OptionGroup
            title="裝飾程度"
            options={decorationLevelOptions}
            selectedValue={options.decorationLevel}
            onSelect={(value) => handleOptionClick('decorationLevel', value)}
            disabled={disabled}
            customValue={options.customDecorationLevel}
            onCustomValueChange={(value) => updateOption('customDecorationLevel', value)}
            customPlaceholder="例如：僅有邊框裝飾、大量花卉圖案、幾何圖形裝飾..."
            customHelpText="請描述您想要的裝飾風格和程度"
            gridCols="3"
          />

          {/* Custom Blessing Phrase (Optional) */}
          <div>
            <label 
              htmlFor="custom-blessing-phrase"
              className="block text-amber-200/80 text-sm font-bold mb-3"
            >
              自訂祝福語（選填）
            </label>
            <input
              id="custom-blessing-phrase"
              type="text"
              value={blessingDraft}
              onChange={(e) => {
                const inputValue = e.target.value;
                setBlessingDraft(inputValue);
                if (isComposingBlessing) {
                  return;
                }
                const filteredValue = normalizeBlessingPhrase(inputValue);
                setBlessingDraft(filteredValue);
                updateOption('customBlessingPhrase', filteredValue.length > 0 ? filteredValue : undefined);
              }}
              onCompositionStart={() => setIsComposingBlessing(true)}
              onCompositionEnd={(e) => {
                setIsComposingBlessing(false);
                const filteredValue = normalizeBlessingPhrase(e.currentTarget.value);
                setBlessingDraft(filteredValue);
                updateOption('customBlessingPhrase', filteredValue.length > 0 ? filteredValue : undefined);
              }}
              onBlur={(e) => {
                const filteredValue = normalizeBlessingPhrase(e.currentTarget.value);
                setBlessingDraft(filteredValue);
                updateOption('customBlessingPhrase', filteredValue.length > 0 ? filteredValue : undefined);
              }}
              placeholder="例如：萬事如意（留空則自動生成）"
              disabled={disabled}
              maxLength={8}
              aria-label="自訂祝福語輸入"
              aria-describedby="blessing-phrase-help"
              className="w-full bg-black/40 border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-500/20 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
            />
            <div id="blessing-phrase-help" className="mt-2 space-y-1">
              <p className="text-xs text-amber-500/40">
                可輸入 4-8 個中文字作為祝福語，留空則由 AI 自動生成
              </p>
              <p className="text-xs text-amber-500/50 italic">
                💡 提示：上方輸入框決定主題和視覺元素，此處決定顯示的文字。建議兩者主題一致以獲得最佳效果。
              </p>
              {options.customBlessingPhrase && options.customBlessingPhrase.length > 0 && options.customBlessingPhrase.length < 4 && (
                <p className="text-xs text-amber-400/70 mt-1">
                  💡 建議輸入 4-8 個中文字以獲得最佳效果
                </p>
              )}
              {options.customBlessingPhrase && options.customBlessingPhrase.length > 0 && !/^[\u4e00-\u9fa5]+$/.test(options.customBlessingPhrase) && (
                <p className="text-xs text-red-400/70 mt-1">
                  ⚠️ 請只輸入中文字
                </p>
              )}
            </div>
          </div>

          {/* Custom Style Description (Optional) */}
          <div>
            <label 
              htmlFor="custom-style-description"
              className="block text-amber-200/80 text-sm font-bold mb-3"
            >
              自訂風格描述（選填）
            </label>
            <textarea
              id="custom-style-description"
              value={options.customStyleDescription || ''}
              onChange={(e) => {
                const inputValue = e.target.value;
                updateOption('customStyleDescription', inputValue.trim().length > 0 ? inputValue.trim() : undefined);
              }}
              placeholder="例如：希望整體呈現溫馨的氛圍，使用柔和的色調，搭配花卉圖案..."
              disabled={disabled}
              maxLength={200}
              rows={4}
              aria-label="自訂風格描述輸入"
              aria-describedby="style-description-help"
              className="w-full bg-black/40 border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-500/20 focus:outline-none focus:border-amber-500/50 transition-colors text-sm resize-y min-h-[100px]"
            />
            <div id="style-description-help" className="mt-2 space-y-1">
              <p className="text-xs text-amber-500/40">
                可輸入您想要的整體風格描述，AI 會參考此描述來生成春聯
              </p>
              <p className="text-xs text-amber-500/50 italic">
                💡 提示：此描述會與上方的選項結合使用，提供更詳細的風格指引
              </p>
              {options.customStyleDescription && options.customStyleDescription.length > 0 && (
                <p className="text-xs text-amber-400/70 mt-1">
                  已輸入 {options.customStyleDescription.length} / 200 字元
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CustomizationPanel.displayName = 'CustomizationPanel';
