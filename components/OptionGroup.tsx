import React, { memo } from 'react';

interface Option<T extends string> {
  value: T;
  label: string;
  description: string;
}

interface OptionGroupProps<T extends string> {
  title: string;
  options: Option<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  disabled?: boolean;
  customValue?: string;
  onCustomValueChange?: (value: string | undefined) => void;
  customPlaceholder?: string;
  customHelpText?: string;
  gridCols?: '2' | '3';
}

function OptionGroupComponent<T extends string>({
  title,
  options,
  selectedValue,
  onSelect,
  disabled = false,
  customValue,
  onCustomValueChange,
  customPlaceholder,
  customHelpText,
  gridCols = '3'
}: OptionGroupProps<T>) {
  const isCustom = selectedValue === 'custom';
  const gridClass = gridCols === '2' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3';

  return (
    <div>
      <label className="block text-amber-200/80 text-sm font-bold mb-3" id={`${title}-label`}>
        {title}
      </label>
      <div
        className={`grid ${gridClass} gap-3 mb-3`}
        role="radiogroup"
        aria-labelledby={`${title}-label`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.value)}
            aria-checked={selectedValue === option.value}
            role="radio"
            aria-label={`${title}: ${option.label}`}
            className={`
              relative cursor-pointer border rounded-lg p-3 transition-all duration-300 block text-left w-full
              ${selectedValue === option.value
                ? 'bg-amber-900/40 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-black/20 border-amber-900/30 hover:bg-amber-900/20'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-amber-500/50
            `}
          >
            <div className="text-center">
              <div className="font-medium text-amber-200 text-sm mb-1">{option.label}</div>
              <div className="text-xs text-amber-500/60">{option.description}</div>
            </div>
            {selectedValue === option.value && (
              <div
                className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full"
                aria-hidden="true"
              ></div>
            )}
          </button>
        ))}
      </div>
      {isCustom && onCustomValueChange && (
        <div className="mt-3">
          <input
            type="text"
            value={customValue || ''}
            onChange={(e) => onCustomValueChange(e.target.value || undefined)}
            placeholder={customPlaceholder}
            disabled={disabled}
            maxLength={100}
            aria-label={`${title} 自定義輸入`}
            aria-describedby={`${title}-custom-help`}
            className="w-full bg-black/40 border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-500/20 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
            onClick={(e) => e.stopPropagation()}
          />
          {customHelpText && (
            <p id={`${title}-custom-help`} className="mt-2 text-xs text-amber-500/40">
              {customHelpText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Use Function to allow generic component with memo
export const OptionGroup = memo(OptionGroupComponent) as <T extends string>(
  props: OptionGroupProps<T>
) => React.ReactNode;

(OptionGroup as any).displayName = 'OptionGroup';
