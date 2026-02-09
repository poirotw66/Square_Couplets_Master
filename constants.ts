// Image Processing Constants
export const IMAGE_CONSTANTS = {
  MAX_SIZE_KB: 500,
  MAX_DIMENSION: 1920,
  MAX_FILE_SIZE_MB: 10,
  COMPRESSION_QUALITY: 0.85,
  MIN_COMPRESSION_QUALITY: 0.1
} as const;

import type { VisualLayout, CustomizationOptions } from './types';

// Helper function to generate visual layout instructions
export const getVisualLayoutInstructions = (layout: VisualLayout): { layering: string; negativeConstraints: string } => {
  const highestPrinciple = "CRITICAL: The calligraphy MUST NOT obscure the primary features of the subject (face, eyes, or core identity). They should frame each other in a 'mutually supportive' relationship.";

  switch (layout) {
    case 'center-surround':
      return {
        layering: `Calligraphy at the ABSOLUTE CENTER. The subject is arranged to SURROUND and CIRCLE the text. ${highestPrinciple}`,
        negativeConstraints: "NO calligraphy overlapping the central features of the subject."
      };
    case 'center-background':
      return {
        layering: `Calligraphy at the CENTER. The subject is placed in the BACKGROUND LAYER, acting as a majestic backdrop behind the text. ${highestPrinciple}`,
        negativeConstraints: "Calligraphy must be bold but should not hide the core details of the background subject."
      };
    case 'center-corners':
      return {
        layering: `Calligraphy at the CENTER. The subject is split or distributed across the FOUR CORNERS (top, bottom, left, right quadrants), framing the text. ${highestPrinciple}`,
        negativeConstraints: "Keep a clear boundary between the central text and the corner ornaments."
      };
    case 'edge-left':
      return {
        layering: `The subject is vertically centered or slightly to the right. Calligraphy is arranged in a VERTICAL COLUMN along the LEFT EDGE of the Doufang. ${highestPrinciple}`,
        negativeConstraints: "Text must stay within the left margin area and not cross into the subject's face."
      };
    case 'edge-top':
      return {
        layering: `The subject is centered in the middle and bottom half. Calligraphy is arranged in a HORIZONTAL LINE along the TOP EDGE. ${highestPrinciple}`,
        negativeConstraints: "Text must remain in the upper margin, framing the subject from above."
      };
    case 'split-top-bottom':
      return {
        layering: `Horizontal split. Calligraphy occupies the TOP HALF; the subject emerges from the BOTTOM HALF. They meet harmoniously at the equator. ${highestPrinciple}`,
        negativeConstraints: "Subjects must not reach up to the top and hide the text; text must stay high."
      };
    case 'split-left-right':
      return {
        layering: `Vertical split. Calligraphy occupies the LEFT SIDE; the subject occupies the RIGHT SIDE. A clear balance between typography and art. ${highestPrinciple}`,
        negativeConstraints: "Visual weight must be balanced on both sides without overlapping across the center line."
      };
    case 'diagonal':
      return {
        layering: `Diagonal balance. Calligraphy is in one corner (e.g., top-right) and the subject is in the OPPOSITE DIAGONAL corner (e.g., bottom-left), creating dynamic movement. ${highestPrinciple}`,
        negativeConstraints: "Ensure a strong sense of diagonal flow without the elements crashing in the middle."
      };
    case 'negative-space':
      return {
        layering: `Prioritize NEGATIVE SPACE. The subject is placed to one side, purposefully leaving the largest natural void for the calligraphy to reside in. ${highestPrinciple}`,
        negativeConstraints: "Do not fill the entire Doufang; whitespace is essential for this artistic balance."
      };
    case 'depth-layering':
      return {
        layering: `3D depth layering. Front layer: decorative elements; Mid layer: the main subject; Back layer: calligraphy (semi-translucent or subtly faded). Calligraphy frames the subject from behind. ${highestPrinciple}`,
        negativeConstraints: "Subject must be fully identifiable in the middle; text should not clutter the foreground."
      };
    case 'subject-center-text-corners':
      return {
        layering: `The main subject is prominently placed at the ABSOLUTE CENTER of the red diamond. The 4-character calligraphy is split, with ONE character placed in EACH of the FOUR INNER QUADRANTS of the red diamond (top-left, top-right, bottom-left, and bottom-right areas WITHIN the red area). CRITICAL: All characters MUST be placed 100% inside the red paper boundaries. ${highestPrinciple}`,
        negativeConstraints: "ABSOLUTELY NO text allowed on the white outer background. Characters must be nested inside the red diamond's corners, framing the central subject."
      };
    case 'default':
    default:
      return {
        layering: `Calligraphy at the center. The subject interacts harmoniously by framing the text or forming a majestic backdrop. ${highestPrinciple}`,
        negativeConstraints: "NO calligraphy overlapping and obscuring the main decorative subject's face or core details."
      };
  }
};

// Base system prompt for generating Doufang prompts (no reference)
export const DOUFANG_SYSTEM_PROMPT = `
You are a professional Chinese New Year couplet and calligraphy art designer specializing in traditional Doufang artwork.

## TASK
Generate a high-end, printable Chinese New Year "Doufang" (diamond-shaped) couplet artwork prompt.

## STEP 1: KEYWORD INTERPRETATION
Match keyword themes to: Wealth, Health, Career, Peace, Love, Study, Luck.

## STEP 2: BLESSING PHRASE SELECTION
Use 4-character phrases common in Chinese New Year.

## STEP 3: IMAGE PROMPT GENERATION
- Diamond-shaped Doufang, 1:1 format.
- Calligraphy: 2x2 grid at center.
- Composition: STRICT CONTAINMENT within diamond borders.
- Layering: Calligraphy and subjects must frame each other, NO obscuring.

### MUST AVOID
- NO spilling beyond borders.
- NO obscuring subject faces.
- NO western fonts.
`;

export const getDoufangSystemPromptWithReference = (
  customizationOptions?: CustomizationOptions
): string => {
  const reimagineMode = customizationOptions?.referenceImageMode === 'reimagine';
  const layout = customizationOptions?.visualLayout || 'default';
  const layoutInst = getVisualLayoutInstructions(layout);

  const coreMission = reimagineMode
    ? `Your task is to create a Doufang that features the **SAME SUBJECT** from the reference, but in a **NEW POSE/ACTION**. Preserve Style/Color/Material faithfully.`
    : `Your task is to FAITHFULLY recreate the visual essence of the provided REFERENCE IMAGES in Doufang format. Absolute visual fidelity to Style/Color/Subject/Material.`;

  return `You are a professional Chinese New Year Doufang designer.

### CORE MISSION:
${coreMission}

### VISUAL LAYOUT (SELECTED BY USER):
- **Selected Layout**: ${layout}
- **Layering Rule**: ${layoutInst.layering}
- **Constraints**: ${layoutInst.negativeConstraints}

### STEP 1: REFERENCE DNA EXTRACTION
Extract Style, Color, Subject, and Material from reference images.

### STEP 2: ARTWORK SPECIFICATIONS
- Perfect diamond "Doufang" shape.
- Calligraphy: 2x2 grid.
- **Strict Containment**: 100% inside diamond borders.
- **Non-Obscurity**: Calligraphy MUST NOT hide subject core features.

### OUTPUT FORMAT (JSON ONLY):
{
  "blessingPhrase": "4 characters",
  "analysis": "Brief analysis of reference",
  "imagePrompt": "Detailed prompt incorporating style, colors, subject from reference, and the ${layout} layout logic."
}
`;
};

export const getDoufangSystemPromptWithCustomization = (
  options: CustomizationOptions
): string => {
  const layout = options.visualLayout || 'default';
  const layoutInst = getVisualLayoutInstructions(layout);

  return `You are a professional Chinese New Year Doufang designer.

### CORE MISSION:
Generate a Doufang based on user preferences.

### VISUAL LAYOUT:
- **Style**: ${layout}
- **Layering**: ${layoutInst.layering}

### CUSTOMIZATION:
- Art Style: ${options.artStyle === 'cartoon' ? 'Vibrant cartoon style (Western or Anime style)' :
    options.artStyle === 'childlike' ? 'Childlike and innocent drawing style' :
      options.artStyle === 'hand-drawn' ? 'Warm, textured hand-drawn illustration' :
        options.artStyle === '3d-render' ? 'Modern 3D render with depth and realistic lighting' :
          options.artStyle === 'watercolor' ? 'Soft watercolor painting with translucent bleeds' :
            options.artStyle === 'paper-cut' ? 'Traditional Chinese paper-cut style with intricate silhouettes' :
              options.artStyle === 'cyberpunk' ? 'Neon cyberpunk aesthetic with futuristic elements' :
                options.artStyle === 'pixel-art' ? 'Retro pixel art / 8-bit aesthetic' : options.artStyle}
- Color Theme: ${options.colorTheme}
- Calligraphy Style: ${options.calligraphyStyle === 'cute' ? 'Cute, rounded, and bubbly artistic font' :
    options.calligraphyStyle === 'pop' ? 'Dynamic and lively POP art style font' :
      options.calligraphyStyle === 'handwriting' ? 'Natural and casual personal handwriting' :
        options.calligraphyStyle === 'crayon' ? 'Playful crayon / wax pencil texture font' :
          options.calligraphyStyle === 'chalk' ? 'Textured chalk drawing style font' : options.calligraphyStyle}

### FINAL CONSTRAINTS:
- **STRICT CONTAINMENT**: No spilling beyond diamond borders.
- **NON-OBSCURING**: No overlapping on core features.
- Layout: 2x2 central text or per-layout specification.
- Quality: 8K, professional.

### OUTPUT FORMAT (JSON ONLY):
{
  "blessingPhrase": "4 characters",
  "imagePrompt": "Detailed prompt applying ${options.artStyle} style and ${layout} layout."
}
`;
};

export const getReferenceImageAnalysisPrompt = (
  userKeyword: string,
  customizationOptions?: CustomizationOptions
): string => {
  const reimagineMode = customizationOptions?.referenceImageMode === 'reimagine';
  const layout = customizationOptions?.visualLayout || 'default';
  const layoutInst = getVisualLayoutInstructions(layout);

  let prompt = `User input keyword: 「${userKeyword}」\n\n`;
  prompt += reimagineMode
    ? `## REIMAGINE MODE: Same Subject + Same Style + NEW Presentation ##`
    : `## PRESERVE MODE: Absolute Visual Fidelity ##`;

  prompt += `\n\n## VISUAL LAYOUT REQUIREMENT: ${layout} ##\n${layoutInst.layering}`;

  prompt += `\n\n## COMPOSITION INTEGRITY ##
1. **STRICT CONTAINMENT**: 100% inside diamond borders. No spilling.
2. **LAYERED VISUALS**: Follow the ${layout} rules to ensure calligraphy and subject frame each other without obscuring core details.`;

  return prompt;
};

export const getSimpleUserInputPrompt = (
  userKeyword: string,
  customizationOptions?: CustomizationOptions
): string => {
  return `User keyword: 「${userKeyword}」\nPreferences: ${JSON.stringify(customizationOptions)}`;
};

export const getImageGenerationPromptWithReference = (
  basePrompt: string,
  customizationOptions?: CustomizationOptions
): string => {
  const layout = customizationOptions?.visualLayout || 'default';
  const layoutInst = getVisualLayoutInstructions(layout);

  return `## COMPOSITION & LAYERING (STRICT) ##
1. **STRICT CONTAINMENT**: Artwork MUST be 100% inside diamond boundaries. NO spilling onto background.
2. **VISUAL LAYOUT (${layout})**: ${layoutInst.layering}
3. **NON-OBSCURING**: Ensure calligraphy and subject core features do not overlap.

---

${basePrompt}

---

## FINAL REMINDER:
Fidelity to reference style and STRICT containment within the Doufang borders are top priorities. Balance the subject and text according to the ${layout} layout.`;
};