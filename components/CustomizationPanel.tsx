import React, { useEffect, useState } from 'react';
import type { CustomizationOptions, ArtStyle, ColorTheme, CalligraphyStyle, DecorationLevel, ReferenceImageMode, VisualLayout } from '../types';
import { OptionGroup } from './OptionGroup';

interface CustomizationPanelProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
  disabled?: boolean;
  hasReferenceImage?: boolean;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  options,
  onChange,
  disabled = false,
  hasReferenceImage = false
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
    { value: 'traditional', label: '傳統', description: '傳統水墨畫' },
    { value: 'modern', label: '現代', description: '融合設計元素' },
    { value: 'minimalist', label: '簡約', description: '簡潔優雅' },
    { value: 'luxurious', label: '華麗', description: '豐富細節' },
    { value: 'cartoon', label: '卡通', description: '美式/日式卡通' },
    { value: 'childlike', label: '童趣', description: '純真可愛風格' },
    { value: 'hand-drawn', label: '手繪', description: '溫厚手製感' },
    { value: '3d-render', label: '3D 立體', description: '立體擬真質感' },
    { value: 'watercolor', label: '水彩', description: '渲染透明感' },
    { value: 'paper-cut', label: '剪紙', description: '傳統剪紙鏤空' },
    { value: 'cyberpunk', label: '賽博龐克', description: '霓虹未來感' },
    { value: 'pixel-art', label: '像素', description: '復古點陣風' },
    { value: 'custom', label: '自定義', description: '輸入風格描述' },
  ];

  // Expanded color theme options
  const colorThemeOptions: { value: ColorTheme; label: string; description: string }[] = [
    { value: 'classic-red-gold', label: '經典紅金', description: '傳統紅金' },
    { value: 'elegant-subtle', label: '淡雅', description: '柔和優雅' },
    { value: 'vibrant-rich', label: '濃郁', description: '鮮豔豐富' },
    { value: 'monochrome', label: '單色', description: '黑白灰' },
    { value: 'pastel-soft', label: '粉彩', description: '柔和少女心' },
    { value: 'custom', label: '自定義', description: '輸入顏色描述' },
  ];

  // Expanded calligraphy style options
  const calligraphyStyleOptions: { value: CalligraphyStyle; label: string; description: string }[] = [
    { value: 'kaishu', label: '楷書', description: '工整端莊' },
    { value: 'xingshu', label: '行書', description: '流暢優雅' },
    { value: 'caoshu', label: '草書', description: '奔放瀟灑' },
    { value: 'cute', label: '可愛字體', description: '圓潤萌系' },
    { value: 'pop', label: 'POP 體', description: '生動活潑' },
    { value: 'handwriting', label: '手寫體', description: '自然隨性' },
    { value: 'crayon', label: '蠟筆體', description: '童趣塗鴉感' },
    { value: 'chalk', label: '粉筆體', description: '黑板報風格' },
    { value: 'custom', label: '自定義', description: '輸入字體描述' },
  ];

  // Expanded decoration level options
  const decorationLevelOptions: { value: DecorationLevel; label: string; description: string }[] = [
    { value: 'minimal', label: '簡約', description: '極簡裝飾' },
    { value: 'moderate', label: '適中', description: '平衡裝飾' },
    { value: 'rich', label: '豐富', description: '精緻裝飾' },
    { value: 'extravagant', label: '極致', description: '頂級華麗' },
  ];

  // Visual layout options
  const visualLayoutOptions: { value: VisualLayout; label: string; description: string }[] = [
    { value: 'default', label: '預設佈局', description: '文字居中，背景或四角主體襯托' },
    // 中心型
    { value: 'center-surround', label: '文字中心・環繞型', description: '文字在中央，主體環繞排佈' },
    { value: 'center-background', label: '文字中心・背景型', description: '文字在中央，主體位於後景層' },
    { value: 'center-corners', label: '文字中心・四角型', description: '文字在中央，主體分佈於四角' },
    // 邊緣型
    { value: 'edge-left', label: '左側型', description: '文字沿左側邊緣直排，主體靠右' },
    { value: 'edge-top', label: '上方型', description: '文字沿頂部邊緣橫排，主體在下' },
    // 分區型
    { value: 'split-top-bottom', label: '上下分型', description: '畫面上方文字，下方主體' },
    { value: 'split-left-right', label: '左右分型', description: '畫面左側文字，右側主體' },
    // 藝術型
    { value: 'diagonal', label: '對角平衡型', description: '文字與主體呈對角分佈，富有動感' },
    { value: 'negative-space', label: '留白藝術型', description: '強調大量留白，文字出現在空白處' },
    // 景深型
    { value: 'depth-layering', label: '前後景深型', description: '利用前後景分層，創造 3D 空間感' },
    // 主體中心型
    { value: 'subject-center-text-corners', label: '主體中心・文字四角型', description: '主體居於中央，四個書法字分佈於四個角落' },
  ];

  // Helper function to get display label
  const getDisplayLabel = (
    value: ArtStyle | ColorTheme | CalligraphyStyle | DecorationLevel | VisualLayout,
    options: Array<{ value: any; label: string }>
  ): string => {
    if (value === 'custom') {
      return '自定義';
    }
    return options.find(o => o.value === value)?.label || value;
  };

  // Handle option click
  const handleOptionClick = (
    category: 'artStyle' | 'colorTheme' | 'calligraphyStyle' | 'decorationLevel' | 'visualLayout',
    value: ArtStyle | ColorTheme | CalligraphyStyle | DecorationLevel | VisualLayout
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
            <div className="flex gap-1 flex-wrap justify-end">
              <span className="text-xs text-amber-500/40 px-2 py-1 bg-amber-900/20 rounded">
                {getDisplayLabel(options.artStyle, artStyleOptions)}
              </span>
              <span className="text-xs text-amber-500/40 px-2 py-1 bg-amber-900/20 rounded">
                {getDisplayLabel(options.visualLayout || 'default', visualLayoutOptions)}
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

          {/* Visual Layout */}
          <OptionGroup
            title="視覺佈局 (視覺順序)"
            options={visualLayoutOptions}
            selectedValue={options.visualLayout || 'default'}
            onSelect={(value) => handleOptionClick('visualLayout', value)}
            disabled={disabled}
            gridCols="2"
          />

          {/* Reference Image Mode - Only show when reference image is provided */}
          {hasReferenceImage && (
            <div>
              <label className="block text-amber-200/80 text-sm font-bold mb-3">
                參考圖片模式
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateOption('referenceImageMode', 'preserve')}
                  disabled={disabled}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${(options.referenceImageMode ?? 'preserve') === 'preserve'
                    ? 'border-amber-500/60 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'border-amber-900/40 bg-black/20 hover:border-amber-500/40 hover:bg-amber-500/5'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-amber-100 font-bold text-sm">保留原樣</span>
                  </div>
                  <p className="text-xs text-amber-500/60">
                    保留參考圖片的主體、姿勢和構圖，直接轉換為斗方格式
                  </p>
                  {(options.referenceImageMode ?? 'preserve') === 'preserve' && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => updateOption('referenceImageMode', 'reimagine')}
                  disabled={disabled}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${options.referenceImageMode === 'reimagine'
                    ? 'border-amber-500/60 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'border-amber-900/40 bg-black/20 hover:border-amber-500/40 hover:bg-amber-500/5'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span className="text-amber-100 font-bold text-sm">重新設計</span>
                  </div>
                  <p className="text-xs text-amber-500/60">
                    參考原圖風格，創作全新的姿勢、角度或構圖變化
                  </p>
                  {options.referenceImageMode === 'reimagine' && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-amber-500/40">
                💡 「保留原樣」會盡量保持參考圖片的外觀；「重新設計」會創作風格相似但姿勢不同的新圖案
              </p>
            </div>
          )}

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
