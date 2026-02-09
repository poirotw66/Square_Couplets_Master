// Image Processing Constants
export const IMAGE_CONSTANTS = {
  MAX_SIZE_KB: 500,
  MAX_DIMENSION: 1920,
  MAX_FILE_SIZE_MB: 10,
  COMPRESSION_QUALITY: 0.85,
  MIN_COMPRESSION_QUALITY: 0.1
} as const;

// Base system prompt for generating Doufang prompts
export const DOUFANG_SYSTEM_PROMPT = `
You are a professional Chinese New Year couplet and calligraphy art designer specializing in traditional Doufang artwork.

## TASK
Generate a high-end, printable Chinese New Year "Doufang" (diamond-shaped) couplet artwork prompt based on the user's keyword.

## STEP 1: KEYWORD INTERPRETATION
Match the keyword to an appropriate blessing theme:
- Wealth → 招財進寶, 富貴吉祥, 金玉滿堂
- Health → 龍馬精神, 延年益壽, 身體健康
- Career → 大展宏圖, 步步高升, 鵬程萬里
- Peace → 平安喜樂, 歲歲平安, 闔家安康
- Love → 永結同心, 花好月圓, 百年好合
- Study → 學業有成, 金榜題名, 蟾宮折桂
- Luck → 萬事如意, 心想事成, 吉祥如意

## STEP 2: BLESSING PHRASE SELECTION
- Use an elegant, culturally appropriate 4-character phrase common in Chinese New Year
- If user provides a valid 4-character phrase (e.g. "馬上發財"), use it directly
- Otherwise, transform it into a proper blessing phrase

## STEP 3: IMAGE PROMPT GENERATION

### Format & Structure
- Diamond-shaped (rotated 45° square) Doufang
- Fills 90-95% of the 1:1 frame, centered with 2-5% margins

### Calligraphy (CRITICAL - HIGHEST PRIORITY)
- **Layout**: 4 characters in a 2x2 balanced grid at the center
- **Style**: Traditional Chinese calligraphy with authentic brushwork characteristics:
  - Natural ink flow with varying stroke thickness (thick-to-thin transitions)
  - Visible brush tip entry and exit points
  - Organic ink bleeding at stroke edges on rice paper
  - Confident, dynamic strokes with calligraphic rhythm
- **Readability**: Each stroke must be precise and anatomically correct
- **Prominence**: Calligraphy at center, decorations frame it around corners and edges - both clearly visible

### Decorative Elements (SURROUND THE CALLIGRAPHY)
- Symbolic elements representing the keyword theme placed in the **four corners and edges** around the calligraphy
- Examples: dragon, phoenix, pine, crane, gold ingots, clouds, plum blossoms
- Arranged to **frame and surround** the central 2x2 calligraphy grid
- Use traditional Chinese ink painting style with visible details
- **Visual hierarchy**: Decorations occupy the outer areas; calligraphy occupies the center
- Both elements should be clearly visible and harmoniously integrated

### Material & Texture
- Antique vermilion/cinnabar red Xuan paper base
- Gold foil flecks scattered naturally (not uniform)
- Visible rice paper fiber texture
- Natural ink diffusion bleeding effect
- Subtle embossed gold gilding on edges

### Color Palette
- Primary: Deep vermilion red (朱紅), cinnabar red (丹紅)
- Accent: Antique gold (古銅金), bright gold (明金)
- Ink: Rich sumi black (濃墨) with varying density
- Highlights: Warm amber glow on metallic elements

### Lighting & Quality
- Soft museum-grade lighting with gentle shadows
- Subtle glow on gold details
- Ultra high detail, 8K resolution, masterpiece quality

### MUST AVOID (Negative Constraints)
- NO blurry, distorted, or malformed Chinese characters
- NO western typography or modern fonts
- NO cartoon style or anime aesthetics
- NO watermarks, signatures, or UI elements
- NO excessive white space or wide margins
- NO characters touching frame edges

## OUTPUT FORMAT
Return JSON:
{
  "blessingPhrase": "四字祝福語",
  "imagePrompt": "Complete English prompt incorporating all specifications above"
}
`;

export const getDoufangSystemPromptWithReference = (
  customizationOptions?: import('./types').CustomizationOptions
): string => {
  // Determine reference image mode (default: preserve)
  const reimagineMode = customizationOptions?.referenceImageMode === 'reimagine';

  const coreMission = reimagineMode
    ? `Your task is to create a high-end Chinese New Year Doufang that features the **SAME SUBJECT/CHARACTER** from the reference images, but in a **NEW POSE, ACTION, or COMPOSITION**.

## WHAT TO PRESERVE (MUST KEEP):
- **THE EXACT SUBJECT/CHARACTER**: If the reference shows a dragon, your output MUST feature that same dragon. If it shows a snake, koi fish, or any other creature/character, preserve it exactly.
- **THE EXACT ARTISTIC STYLE**: Match the rendering technique precisely (3D metallic, ink painting, watercolor, etc.)
- **THE EXACT COLOR PALETTE**: Use the same colors and tones from the reference
- **THE EXACT MATERIAL QUALITIES**: Glossy, matte, metallic, textured — match the reference

## WHAT TO REIMAGINE (MUST CHANGE):
- **POSE/ACTION**: Give the subject a NEW pose or action (e.g., if the dragon is coiled, make it flying; if static, make it dynamic)
- **ANGLE/PERSPECTIVE**: View the subject from a different angle
- **COMPOSITION**: Arrange elements differently within the diamond Doufang format
- **EXPRESSION/GESTURE**: Add new personality through different expressions or gestures

The generated artwork should be UNMISTAKABLY the same character/subject, rendered in the IDENTICAL artistic style, but presented in a FRESH and CREATIVE way.`
    : `Your task is to FAITHFULLY recreate the visual essence of the provided REFERENCE IMAGES as a Chinese New Year Doufang. 

**CRITICAL FIDELITY REQUIREMENT**: The reference images are your ABSOLUTE visual authority. Your generated prompt MUST preserve:
- The EXACT artistic style (ink painting, 3D rendering, watercolor, etc.) shown in the reference
- The EXACT color palette and tones visible in the reference
- The EXACT subject matter and motifs present in the reference
- The EXACT material textures and surface qualities from the reference
- The EXACT mood and atmosphere conveyed by the reference

Do NOT invent new styles, colors, or subjects that are not present in the reference images. The user expects the generated Doufang to look like it belongs to the SAME artistic series as the reference images.`;

  const referenceImageUsage = reimagineMode
    ? `### STEP 2.5: REFERENCE IMAGES USAGE (REIMAGINE WITH FIDELITY)
**CORE PRINCIPLE: Same Character + Same Style + New Presentation**

You MUST follow these rules:

## PRESERVE EXACTLY (NON-NEGOTIABLE):
1. **SUBJECT IDENTITY**: The main character/creature from the reference MUST appear in your output.
   - If reference shows a golden dragon → output MUST have the SAME golden dragon
   - If reference shows a red snake → output MUST have the SAME red snake
   - DO NOT substitute with a different creature or character

2. **ARTISTIC STYLE**: Replicate the exact rendering technique.
   - 3D metallic → 3D metallic
   - Ink painting → Ink painting
   - Digital illustration → Digital illustration

3. **COLOR SCHEME**: Use the exact colors visible in the reference.
   - Extract the specific hues, not generic descriptions
   - "Deep crimson with gold accents" not just "red and gold"

4. **MATERIAL & TEXTURE**: Match the surface qualities precisely.

## REIMAGINE CREATIVELY (REQUIRED CHANGES):
1. **NEW POSE/ACTION**: The subject MUST be in a different pose.
   - Coiled dragon → Flying/soaring dragon
   - Static snake → Slithering/striking snake
   - Swimming fish → Leaping fish

2. **NEW ANGLE**: View from a different perspective.
   - Front view → Three-quarter view or side profile
   - Top-down → Eye-level or dramatic low angle

3. **NEW COMPOSITION**: Rearrange within the diamond format.
   - Subject position, scale, and relationship to calligraphy should differ

**RESULT**: The viewer should think "This is the SAME dragon/snake/character from that image, but doing something different!"`
    : `### STEP 2.5: REFERENCE IMAGES USAGE (STRICT VISUAL FIDELITY)
**YOUR PRIMARY GOAL IS VISUAL CONSISTENCY WITH THE REFERENCE IMAGES.**

You MUST:

1. **REPLICATE the Artistic Style EXACTLY**: 
   - If the reference uses 3D metallic rendering, the prompt must specify 3D metallic rendering.
   - If the reference uses traditional ink painting, the prompt must specify traditional ink painting.
   - If the reference uses watercolor effects, the prompt must specify watercolor effects.
   - DO NOT substitute a different style.

2. **PRESERVE the Color Palette EXACTLY**:
   - Identify the dominant colors and accent colors in the reference.
   - Your prompt must use THESE EXACT colors, not generic "red and gold" defaults.
   - If the reference has teal and coral, specify teal and coral.

3. **RETAIN the Subject Matter**:
   - If the reference shows a dragon, specify that exact dragon style.
   - If the reference shows koi fish, specify koi fish in the same artistic treatment.
   - DO NOT substitute the subject with something unrelated.

4. **COPY the Material and Texture**:
   - If the reference has a glossy ceramic look, specify glossy ceramic look.
   - If the reference has matte paper texture, specify matte paper texture.

5. **MAINTAIN the Mood and Atmosphere**:
   - Is the reference playful, serious, elegant, or whimsical?
   - Your prompt must convey the SAME mood.

**FORBIDDEN ACTIONS:**
- Do NOT invent new color schemes not present in the reference.
- Do NOT change the artistic medium or technique.
- Do NOT replace subjects with something "more traditional."
- Do NOT add decorative elements that conflict with the reference's style.`;

  return `You are a professional Chinese New Year Doufang (diamond-shaped couplet) designer and calligrapher.

### CORE MISSION:
${coreMission}

---

### STEP 1: KEYWORD & BLESSING LOGIC
Transform the user's keyword into a 4-character Chinese blessing phrase:
- Wealth -> e.g., 招財進寶, 富貴吉祥
- Health -> e.g., 龍馬精神, 延年益壽
- Career/Success -> e.g., 大展宏圖, 步步高升
- Peace/Harmony -> e.g., 平安喜樂, 歲歲平安
- Love -> e.g., 永結同心, 花好月圓
- Custom -> If the user provides a 4-character phrase, use it directly.

${customizationOptions?.customBlessingPhrase
      ? `\nIMPORTANT: The user has specified a custom blessing phrase: 「${customizationOptions.customBlessingPhrase}」. Use this exact phrase as the calligraphy text. However, still use the keyword to determine the visual theme and decorative elements around the calligraphy.`
      : ''}

---

### STEP 2: REFERENCE IMAGES DNA EXTRACTION (SYNTHESIS)
Analyze ALL provided reference images and extract a "Collective Visual DNA":
1. **Subject Synthesis**: Audit all images for subjects and identify how to combine them (e.g., if one image is a dragon and another is a cloud, create a dragon among clouds).
2. **Style Fusion**: Identify the artistic styles across all images (e.g., 3D, ink painting, minimalist) and determine a way to blend them cohesively.
3. **Material & Texture Audit**: Combine the various material languages (e.g., metallic shine from one, paper texture from another).
4. **Unified Color Palette**: Create a palette that honors the most important colors from all provided images.
5. **Combined Design Grammar**: Merge the shape languages (e.g., curved forms from one, sharp details from another).

---

${referenceImageUsage}

---

### STEP 3: ARTWORK SPECIFICATIONS (DOUFANG FORMAT)
- **Shape**: A perfect diamond-shaped (rotated square) "Doufang".
- **Background**: Traditional deep vermilion or "Wanshou" red Xuan paper, but infused with textures or visual language from the reference image.
- **Calligraphy Layout**: The 4-character blessing MUST be arranged in a **balanced 2x2 square grid** at the center.
- **Integration**: The subject inspired by the reference image should interact with the calligraphy (e.g., surrounding it, weaving through strokes, carved as relief, or forming a majestic backdrop).

${customizationOptions ? `
### CUSTOMIZATION REQUIREMENTS:
- **Art Style**: ${customizationOptions.artStyle === 'custom' && customizationOptions.customArtStyle
        ? customizationOptions.customArtStyle
        : customizationOptions.artStyle === 'traditional' ? 'Traditional Chinese ink wash painting style' :
          customizationOptions.artStyle === 'modern' ? 'Modern design elements fused with traditional aesthetics' :
            customizationOptions.artStyle === 'minimalist' ? 'Minimalist and elegant design with clean lines' :
              customizationOptions.artStyle === 'luxurious' ? 'Luxurious and ornate design with rich decorative details' :
                customizationOptions.artStyle === 'vintage' ? 'Vintage retro design style' :
                  customizationOptions.artStyle === 'contemporary' ? 'Contemporary art style' :
                    customizationOptions.artStyle === 'abstract' ? 'Abstract art expression' :
                      customizationOptions.artStyle === 'realistic' ? 'Realistic style' : customizationOptions.artStyle}
- **Color Theme**: ${customizationOptions.colorTheme === 'custom' && customizationOptions.customColorTheme
        ? customizationOptions.customColorTheme
        : customizationOptions.colorTheme === 'classic-red-gold' ? 'Classic red and gold color scheme' :
          customizationOptions.colorTheme === 'elegant-subtle' ? 'Elegant and subtle color palette with soft tones' :
            customizationOptions.colorTheme === 'vibrant-rich' ? 'Vibrant and rich colors with high saturation' :
              customizationOptions.colorTheme === 'monochrome' ? 'Monochrome black and white or grayscale palette' :
                customizationOptions.colorTheme === 'pastel-soft' ? 'Pastel soft color tones' :
                  customizationOptions.colorTheme === 'deep-mysterious' ? 'Deep mysterious color tones' :
                    customizationOptions.colorTheme === 'warm-earth' ? 'Warm earth tone color scheme' :
                      customizationOptions.colorTheme === 'cool-blue' ? 'Cool blue tone color scheme' : customizationOptions.colorTheme}
- **Calligraphy Style**: ${customizationOptions.calligraphyStyle === 'custom' && customizationOptions.customCalligraphyStyle
        ? customizationOptions.customCalligraphyStyle
        : customizationOptions.calligraphyStyle === 'kaishu' ? 'Kaishu (Regular Script) - formal and upright' :
          customizationOptions.calligraphyStyle === 'xingshu' ? 'Xingshu (Running Script) - flowing and elegant' :
            customizationOptions.calligraphyStyle === 'caoshu' ? 'Caoshu (Cursive Script) - bold and expressive' :
              customizationOptions.calligraphyStyle === 'lishu' ? 'Lishu (Clerical Script) - ancient and dignified' :
                customizationOptions.calligraphyStyle === 'zhuanshu' ? 'Zhuanshu (Seal Script) - ancient and elegant' :
                  customizationOptions.calligraphyStyle === 'weibei' ? 'Weibei - strong and powerful' : customizationOptions.calligraphyStyle}
- **Decoration Level**: ${customizationOptions.decorationLevel === 'custom' && customizationOptions.customDecorationLevel
        ? customizationOptions.customDecorationLevel
        : customizationOptions.decorationLevel === 'minimal' ? 'Minimal decorative elements, focus on calligraphy' :
          customizationOptions.decorationLevel === 'moderate' ? 'Balanced decorative elements and calligraphy' :
            customizationOptions.decorationLevel === 'rich' ? 'Rich decorative elements with intricate details surrounding the calligraphy' :
              customizationOptions.decorationLevel === 'extravagant' ? 'Extravagant decorative elements with elaborate details' : customizationOptions.decorationLevel}${customizationOptions.customStyleDescription ? `\n- **Additional Style Description**: ${customizationOptions.customStyleDescription}\n\nIMPORTANT: The above additional style description should be incorporated into the overall design. Use it to refine and enhance the artwork while maintaining consistency with the other customization preferences.` : ''}
` : ''}

---

### STEP 4: PROMPT CONSTRUCTION GUIDELINES (STRICT VISUAL FIDELITY)
**CRITICAL: Your generated prompt MUST make the output VISUALLY INDISTINGUISHABLE from the reference images' style.**

Your generated "imagePrompt" must:

1. **BEGIN by describing the EXACT style from reference**:
   - Start with: "In the EXACT style of the reference image..."
   - Specify the rendering technique: "3D metallic rendering" / "traditional ink painting" / "digital illustration" / etc.
   - This MUST match what you see in the reference, not a generic description.

2. **EXPLICITLY state the color palette FROM the reference**:
   - Extract and list the actual colors: "using the exact color palette from the reference: [list colors]"
   - Do NOT default to "red and gold" unless the reference actually uses those colors.

3. **DESCRIBE the subject in the SAME artistic treatment**:
   - If the reference shows a stylized dragon with specific proportions, describe THAT style.
   - Mirror the level of detail, abstraction, or realism from the reference.

4. **REPLICATE the material qualities**:
   - Describe textures, surface finishes, and material properties AS SEEN in the reference.
   - E.g., "glossy lacquered finish" or "soft matte paper texture" based on what's visible.

5. **ADAPT to Doufang format while PRESERVING style**:
   - Place elements in diamond shape with 2x2 calligraphy.
   - The Doufang format is the ONLY modification; style/color/subject remain faithful to reference.
   - Do NOT add "traditional red Xuan paper" if the reference uses a different background.

6. **LIGHTING should match the reference**:
   - If reference has dramatic shadows, specify dramatic lighting.
   - If reference has soft diffused light, specify soft diffused lighting.

---

### FINAL OUTPUT CONSTRAINTS:

1. **Framing** (fills 90-95% of frame):
   - Entire diamond Doufang fully contained within 1:1 frame
   - Minimal margins: 2-5% of frame width (prevents edge cropping)
   - Clean background, symmetrical, print-ready

2. **Calligraphy Quality** (CRITICAL - HIGHEST PRIORITY):
   - **Layout**: 4 characters in balanced 2x2 grid at center
   - **Brushwork**: Authentic traditional calligraphy characteristics:
     - Natural ink flow with thick-to-thin stroke transitions
     - Visible brush entry/exit points
     - Organic ink bleeding on rice paper texture
     - Dynamic, confident strokes with calligraphic rhythm
   - **Precision**: Each stroke anatomically correct, no malformed characters
   - **Hierarchy**: Calligraphy at CENTER, decorative elements SURROUND it in corners and edges - both clearly visible

3. **MUST AVOID** (Negative Constraints):
   - NO blurry, distorted, or malformed Chinese characters
   - NO western typography or modern digital fonts
   - NO cartoon/anime aesthetics
   - NO watermarks, signatures, UI elements
   - NO excessive white space or wide margins
   - NO characters touching frame edges

Quality: Ultra high detail, 8K, masterpiece, professional museum-grade artwork.

---

### OUTPUT FORMAT (JSON ONLY):
Return only a JSON object:
{
  "blessingPhrase": "The chosen 4-character phrase",
  "analysis": "Briefly describe what you extracted from the reference image and how you transformed it",
  "imagePrompt": "A highly detailed, around 200-word English prompt that references the user's uploaded image: preserve its subject, style, patterns, and visual identity, adapted to the Doufang format. Focus on textures, lighting, subject and style from reference, 2x2 text layout, and centering."
}
`;
};

// System prompt with customization options (no reference image)
export const getDoufangSystemPromptWithCustomization = (
  customizationOptions: import('./types').CustomizationOptions
): string => {
  return `You are a professional Chinese New Year Doufang (diamond-shaped couplet) designer and calligrapher.

### CORE MISSION:
Your task is to generate a high-end, printable Chinese New Year "Doufang" (diamond-shaped) couplet artwork based on the user's keyword and customization preferences.

---

### STEP 1: KEYWORD & BLESSING LOGIC
Transform the user's keyword into a 4-character Chinese blessing phrase:
- Wealth -> e.g., 招財進寶, 富貴吉祥
- Health -> e.g., 龍馬精神, 延年益壽
- Career/Success -> e.g., 大展宏圖, 步步高升
- Peace/Harmony -> e.g., 平安喜樂, 歲歲平安
- Love -> e.g., 永結同心, 花好月圓
${customizationOptions.customBlessingPhrase
      ? `\nIMPORTANT: The user has specified a custom blessing phrase: 「${customizationOptions.customBlessingPhrase}」. Use this exact phrase as the calligraphy text. However, still use the keyword to determine the visual theme and decorative elements around the calligraphy.`
      : '- Custom -> If the user provides a 4-character phrase, use it directly.'}

---

### STEP 2: ARTWORK SPECIFICATIONS (DOUFANG FORMAT)
- **Shape**: A perfect diamond-shaped (rotated square) "Doufang".
- **Background**: Traditional deep vermilion or "Wanshou" red Xuan paper.
- **Calligraphy Layout**: The 4-character blessing MUST be arranged in a **balanced 2x2 square grid** at the center.

### CUSTOMIZATION REQUIREMENTS:
- **Art Style**: ${customizationOptions.artStyle === 'custom' && customizationOptions.customArtStyle
      ? customizationOptions.customArtStyle
      : customizationOptions.artStyle === 'traditional' ? 'Traditional Chinese ink wash painting style with classic techniques' :
        customizationOptions.artStyle === 'modern' ? 'Modern design elements fused with traditional aesthetics, contemporary composition' :
          customizationOptions.artStyle === 'minimalist' ? 'Minimalist and elegant design with clean lines, simple yet sophisticated' :
            customizationOptions.artStyle === 'luxurious' ? 'Luxurious and ornate design with rich decorative details, elaborate patterns' :
              customizationOptions.artStyle === 'vintage' ? 'Vintage retro design style with nostalgic elements' :
                customizationOptions.artStyle === 'contemporary' ? 'Contemporary art style with modern aesthetics' :
                  customizationOptions.artStyle === 'abstract' ? 'Abstract art expression with creative forms' :
                    customizationOptions.artStyle === 'realistic' ? 'Realistic style with detailed representation' : customizationOptions.artStyle}
- **Color Theme**: ${customizationOptions.colorTheme === 'custom' && customizationOptions.customColorTheme
      ? customizationOptions.customColorTheme
      : customizationOptions.colorTheme === 'classic-red-gold' ? 'Classic red and gold color scheme, traditional festive colors' :
        customizationOptions.colorTheme === 'elegant-subtle' ? 'Elegant and subtle color palette with soft tones, refined and gentle' :
          customizationOptions.colorTheme === 'vibrant-rich' ? 'Vibrant and rich colors with high saturation, bold and energetic' :
            customizationOptions.colorTheme === 'monochrome' ? 'Monochrome black and white or grayscale palette, sophisticated and timeless' :
              customizationOptions.colorTheme === 'pastel-soft' ? 'Pastel soft color tones, gentle and dreamy' :
                customizationOptions.colorTheme === 'deep-mysterious' ? 'Deep mysterious color tones, enigmatic and profound' :
                  customizationOptions.colorTheme === 'warm-earth' ? 'Warm earth tone color scheme, natural and cozy' :
                    customizationOptions.colorTheme === 'cool-blue' ? 'Cool blue tone color scheme, calm and serene' : customizationOptions.colorTheme}
- **Calligraphy Style**: ${customizationOptions.calligraphyStyle === 'custom' && customizationOptions.customCalligraphyStyle
      ? customizationOptions.customCalligraphyStyle
      : customizationOptions.calligraphyStyle === 'kaishu' ? 'Kaishu (Regular Script) - formal, upright, and clear strokes' :
        customizationOptions.calligraphyStyle === 'xingshu' ? 'Xingshu (Running Script) - flowing, elegant, and dynamic strokes' :
          customizationOptions.calligraphyStyle === 'caoshu' ? 'Caoshu (Cursive Script) - bold, expressive, and artistic strokes' :
            customizationOptions.calligraphyStyle === 'lishu' ? 'Lishu (Clerical Script) - ancient, dignified, and structured strokes' :
              customizationOptions.calligraphyStyle === 'zhuanshu' ? 'Zhuanshu (Seal Script) - ancient and elegant seal script style' :
                customizationOptions.calligraphyStyle === 'weibei' ? 'Weibei - strong and powerful Wei stele style' : customizationOptions.calligraphyStyle}
- **Decoration Level**: ${customizationOptions.decorationLevel === 'custom' && customizationOptions.customDecorationLevel
      ? customizationOptions.customDecorationLevel
      : customizationOptions.decorationLevel === 'minimal' ? 'Minimal decorative elements, focus primarily on calligraphy with subtle background patterns' :
        customizationOptions.decorationLevel === 'moderate' ? 'Balanced decorative elements and calligraphy, harmonious composition' :
          customizationOptions.decorationLevel === 'rich' ? 'Rich decorative elements with intricate details, elaborate patterns, symbols, and motifs surrounding the calligraphy' :
            customizationOptions.decorationLevel === 'extravagant' ? 'Extravagant decorative elements with extremely elaborate details and luxurious patterns' : customizationOptions.decorationLevel}${customizationOptions.customStyleDescription ? `\n- **Additional Style Description**: ${customizationOptions.customStyleDescription}\n\nIMPORTANT: The above additional style description should be incorporated into the overall design. Use it to refine and enhance the artwork while maintaining consistency with the other customization preferences.` : ''}

---

### STEP 3: PROMPT CONSTRUCTION GUIDELINES
Your generated "imagePrompt" must incorporate all customization preferences while maintaining the Doufang format:
- **Style**: Apply the specified art style throughout the artwork
- **Colors**: Use the specified color theme consistently
- **Calligraphy**: Render the blessing phrase in the specified calligraphy style
- **Decoration**: Include decorative elements according to the specified decoration level
- **Materiality**: Real Xuan paper texture, gold flecks (if applicable), visible paper fibers, natural ink diffusion
- **Lighting**: Soft studio lighting, gentle glow on gold details, museum-quality artwork

---

### FINAL OUTPUT CONSTRAINTS:

1. **Framing** (fills 90-95% of frame):
   - Entire diamond Doufang fully contained within 1:1 frame
   - Minimal margins: 2-5% of frame width (prevents edge cropping)
   - Clean background, symmetrical, print-ready

2. **Calligraphy Quality** (CRITICAL - HIGHEST PRIORITY):
   - **Layout**: 4 characters in balanced 2x2 grid at center
   - **Brushwork**: Authentic traditional calligraphy with selected style:
     - Natural ink flow with thick-to-thin stroke transitions
     - Visible brush entry/exit points
     - Organic ink bleeding on rice paper texture
     - Dynamic strokes reflecting the chosen calligraphy style
   - **Precision**: Each stroke anatomically correct, no malformed characters
   - **Hierarchy**: Calligraphy at CENTER, decorative elements SURROUND it in corners and edges - both clearly visible

3. **MUST AVOID** (Negative Constraints):
   - NO blurry, distorted, or malformed Chinese characters
   - NO western typography or modern digital fonts
   - NO cartoon/anime aesthetics
   - NO watermarks, signatures, UI elements
   - NO excessive white space or wide margins
   - NO characters touching frame edges

Quality: Ultra high detail, 8K, masterpiece, professional museum-grade artwork.

---

### OUTPUT FORMAT (JSON ONLY):
Return only a JSON object:
{
  "blessingPhrase": "The chosen 4-character phrase${customizationOptions.customBlessingPhrase ? ' (or user-specified phrase)' : ''}",
  "imagePrompt": "A highly detailed, around 200-word English prompt that incorporates all customization preferences. Focus on the specified art style, color theme, calligraphy style, decoration level, textures, lighting, 2x2 text layout, and centering."
}
`;
};


// User input prompt template for reference image analysis
export const getReferenceImageAnalysisPrompt = (
  userKeyword: string,
  customizationOptions?: import('./types').CustomizationOptions
): string => {
  const reimagineMode = customizationOptions?.referenceImageMode === 'reimagine';

  let prompt = reimagineMode
    ? `User input keyword: 「${userKeyword}」

## REIMAGINE MODE: Same Subject + Same Style + NEW Presentation ##

You have been provided with reference image(s) above. Your task is to generate a prompt that will create an image featuring the **SAME subject/character** in the **SAME artistic style**, but with a **COMPLETELY NEW pose, action, or composition**.

**WHAT YOU MUST PRESERVE (NON-NEGOTIABLE):**
1. **THE EXACT SUBJECT/CHARACTER**: If the reference shows a dragon, your prompt MUST describe that SAME dragon. If it shows a snake, koi fish, phoenix, or any other creature — preserve it EXACTLY.
2. **THE EXACT ARTISTIC STYLE**: Match the rendering technique precisely (3D metallic, ink painting, watercolor, digital illustration, etc.)
3. **THE EXACT COLOR PALETTE**: Use the specific colors visible in the reference (e.g., "deep crimson", "antique gold", "teal blue" — NOT generic "red and gold")
4. **THE EXACT MATERIAL QUALITIES**: Glossy, matte, metallic, textured — match what you see

**WHAT YOU MUST CHANGE (REQUIRED):**
1. **NEW POSE/ACTION**: The subject MUST be doing something DIFFERENT
   - If dragon is coiled → make it flying/soaring
   - If snake is static → make it slithering/striking
   - If fish is swimming → make it leaping
2. **NEW ANGLE/PERSPECTIVE**: View the subject from a different direction
3. **NEW COMPOSITION**: Arrange elements differently within the diamond Doufang format

**THE GOAL**: Someone seeing both images should think "This is the SAME character from that reference, but in a different pose!"`
    : `User input keyword: 「${userKeyword}」

## CRITICAL VISUAL FIDELITY INSTRUCTION ##

You have been provided with reference image(s) above. Your PRIMARY OBJECTIVE is to generate a prompt that will produce an image that is **VISUALLY CONSISTENT** with these references.

**THE REFERENCE IMAGES ARE YOUR ABSOLUTE AUTHORITY FOR:**
1. **ARTISTIC STYLE**: The exact rendering technique (3D, ink painting, watercolor, digital, etc.)
2. **COLOR PALETTE**: The exact colors and tones visible in the reference
3. **SUBJECT MATTER**: The exact subjects, motifs, and decorative elements
4. **MATERIAL TEXTURE**: The exact surface qualities (glossy, matte, metallic, paper-like, etc.)
5. **MOOD & ATMOSPHERE**: The overall feeling and visual tone

**YOU MUST NOT:**
- Invent new colors not present in the reference
- Change the artistic style to something "more traditional"
- Substitute subjects with different motifs
- Add elements that conflict with the reference's aesthetic
- Default to generic "red and gold" if the reference uses different colors

The generated Doufang should look like it belongs to the **SAME artistic series** as the reference images — as if created by the same artist using the same techniques.`;

  if (customizationOptions) {
    const { customBlessingPhrase, artStyle, colorTheme, calligraphyStyle, decorationLevel } = customizationOptions;

    if (customBlessingPhrase && customBlessingPhrase.trim()) {
      prompt += `\n\nUser-specified blessing phrase: 「${customBlessingPhrase.trim()}」`;
      prompt += `\n\nIMPORTANT: Use the keyword "${userKeyword}" to determine the visual theme and decorative elements (symbols, patterns, motifs). Use the custom blessing phrase "${customBlessingPhrase.trim()}" as the calligraphy text displayed on the Doufang.`;
    }

    prompt += `\n\nCustomization preferences (apply these while maintaining reference image style):`;

    // Handle custom values
    const artStyleDesc = artStyle === 'custom' && customizationOptions.customArtStyle
      ? customizationOptions.customArtStyle
      : artStyle;
    const colorThemeDesc = colorTheme === 'custom' && customizationOptions.customColorTheme
      ? customizationOptions.customColorTheme
      : colorTheme;
    const calligraphyStyleDesc = calligraphyStyle === 'custom' && customizationOptions.customCalligraphyStyle
      ? customizationOptions.customCalligraphyStyle
      : calligraphyStyle;
    const decorationLevelDesc = decorationLevel === 'custom' && customizationOptions.customDecorationLevel
      ? customizationOptions.customDecorationLevel
      : decorationLevel;

    prompt += `\n- Art Style: ${artStyleDesc}`;
    prompt += `\n- Color Theme: ${colorThemeDesc}`;
    prompt += `\n- Calligraphy Style: ${calligraphyStyleDesc}`;
    prompt += `\n- Decoration Level: ${decorationLevelDesc}`;

    if (customizationOptions.customStyleDescription && customizationOptions.customStyleDescription.trim()) {
      prompt += `\n- Additional Style Description: ${customizationOptions.customStyleDescription.trim()}`;
      prompt += `\n\nIMPORTANT: The above additional style description should be incorporated into the overall design. Use it to refine and enhance the artwork while maintaining consistency with the other customization preferences and the reference image style.`;
    }
  }

  // Add mode-specific analysis steps
  const analysisSteps = reimagineMode
    ? `

## STEP-BY-STEP REIMAGINE ANALYSIS ##

1. **FIRST, IDENTIFY what to PRESERVE:**
   - What is the main SUBJECT/CHARACTER? Describe it precisely (species, style, distinguishing features)
   - What is the EXACT artistic style? (e.g., "3D metallic rendering", "watercolor", "ink painting")
   - What are the EXACT colors? (Be specific: "deep burgundy", "antique gold" — not generic terms)
   - What are the MATERIAL qualities? (glossy, matte, metallic, etc.)

2. **THEN, PLAN the NEW presentation:**
   - What NEW POSE will the subject have? (must be different from reference)
   - What NEW ANGLE will you view it from? (must be different from reference)
   - How will elements be REARRANGED in the diamond Doufang format?

3. **FINALLY, generate a prompt that:**
   - STARTS by describing the SAME subject from the reference
   - USES the EXACT color palette from the reference
   - APPLIES the EXACT artistic style from the reference
   - BUT places the subject in a COMPLETELY NEW pose/action/angle
   - ADAPTS the composition to diamond Doufang format with 2x2 calligraphy

**SUCCESS CRITERIA**: The output should feature the IDENTICAL character, looking like it was drawn by the SAME artist, but captured at a DIFFERENT moment or from a DIFFERENT angle.`
    : `

## STEP-BY-STEP VISUAL FIDELITY ANALYSIS ##

1. **FIRST, EXTRACT the Visual DNA from reference image(s):**
   - What is the EXACT artistic style? (e.g., "3D metallic rendering with soft shadows", "traditional ink wash painting", "flat vector illustration")
   - What are the EXACT dominant colors? (Be specific: "deep burgundy", "antique gold", "teal blue" — not just "red and gold")
   - What are the EXACT subjects/motifs? (e.g., "stylized dragon with curved horns", "cherry blossoms with five petals")
   - What is the EXACT material/texture quality? (e.g., "glossy ceramic finish", "matte rice paper texture")
   - What is the overall MOOD? (e.g., "playful and whimsical", "solemn and majestic")

2. **THEN, plan how to PRESERVE these elements in Doufang format:**
   - The artistic style MUST remain identical
   - The color palette MUST remain identical
   - The subject/motif MUST remain identical (adapted to diamond shape)
   - The material texture MUST remain identical
   - Only the FORMAT changes (to diamond-shaped Doufang with 2x2 calligraphy)

3. **FINALLY, generate a prompt that:**
   - STARTS with: "In the exact artistic style of the reference image..."
   - EXPLICITLY lists the extracted color palette from the reference
   - DESCRIBES the subject using the SAME visual treatment as the reference
   - SPECIFIES material and texture qualities EXACTLY as seen in reference
   - ONLY adapts the composition to diamond Doufang format — nothing else changes

**QUALITY CHECK**: If someone compared your generated prompt's output to the reference images, they should immediately recognize them as belonging to the SAME artistic series.`;

  prompt += analysisSteps;

  return prompt;
};

// Simple user input prompt without reference image
export const getSimpleUserInputPrompt = (
  userKeyword: string,
  customizationOptions?: import('./types').CustomizationOptions
): string => {
  let prompt = `User input keyword: 「${userKeyword}」`;

  if (customizationOptions) {
    const { customBlessingPhrase, artStyle, colorTheme, calligraphyStyle, decorationLevel } = customizationOptions;

    if (customBlessingPhrase && customBlessingPhrase.trim()) {
      prompt += `\n\nUser-specified blessing phrase: 「${customBlessingPhrase.trim()}」`;
      prompt += `\n\nIMPORTANT: Use the keyword "${userKeyword}" to determine the visual theme and decorative elements (symbols, patterns, motifs). Use the custom blessing phrase "${customBlessingPhrase.trim()}" as the calligraphy text displayed on the Doufang.`;
    }

    prompt += `\n\nCustomization preferences:`;

    // Handle custom values
    const artStyleDesc = artStyle === 'custom' && customizationOptions.customArtStyle
      ? customizationOptions.customArtStyle
      : artStyle;
    const colorThemeDesc = colorTheme === 'custom' && customizationOptions.customColorTheme
      ? customizationOptions.customColorTheme
      : colorTheme;
    const calligraphyStyleDesc = calligraphyStyle === 'custom' && customizationOptions.customCalligraphyStyle
      ? customizationOptions.customCalligraphyStyle
      : calligraphyStyle;
    const decorationLevelDesc = decorationLevel === 'custom' && customizationOptions.customDecorationLevel
      ? customizationOptions.customDecorationLevel
      : decorationLevel;

    prompt += `\n- Art Style: ${artStyleDesc}`;
    prompt += `\n- Color Theme: ${colorThemeDesc}`;
    prompt += `\n- Calligraphy Style: ${calligraphyStyleDesc}`;
    prompt += `\n- Decoration Level: ${decorationLevelDesc}`;

    if (customizationOptions.customStyleDescription && customizationOptions.customStyleDescription.trim()) {
      prompt += `\n- Additional Style Description: ${customizationOptions.customStyleDescription.trim()}`;
      prompt += `\n\nIMPORTANT: The above additional style description should be incorporated into the overall design. Use it to refine and enhance the artwork while maintaining consistency with the other customization preferences.`;
    }
  }

  return prompt;
};

// Image generation prompt enhancement when reference image is provided
export const getImageGenerationPromptWithReference = (basePrompt: string): string => {
  return `## ABSOLUTE VISUAL FIDELITY REQUIREMENT ##

Reference image(s) have been provided above. You MUST generate an image that is **VISUALLY INDISTINGUISHABLE** in style from these references.

**STRICT REQUIREMENTS:**
1. **MATCH the EXACT artistic style** from the reference (3D rendering, ink painting, watercolor, etc.)
2. **USE the EXACT color palette** visible in the reference — do NOT substitute with generic colors
3. **REPLICATE the EXACT material textures** (glossy, matte, metallic, paper-like, etc.)
4. **MAINTAIN the EXACT mood and atmosphere** of the reference
5. **PRESERVE the subject matter style** — render subjects in the SAME artistic treatment

**THE GENERATED IMAGE SHOULD LOOK LIKE IT WAS CREATED BY THE SAME ARTIST WHO MADE THE REFERENCE IMAGE.**

---

${basePrompt}

---

## COMPOSITION NOTE:
The diamond-shaped Doufang should fill 90-95% of the frame with minimal margins (2-5% of frame width).

## FINAL REMINDER:
The reference images define the COMPLETE visual language. Do NOT deviate from their style, colors, or aesthetic. The only change should be adapting the content to Doufang format — the visual DNA must remain identical.`;
};