---
name: generate-doufang-prompt
description: Generate professional Chinese New Year Doufang (diamond-shaped couplet) artwork prompts based on keywords. Use when user wants to create traditional Chinese calligraphy artwork prompts.
---

# generate-doufang-prompt Skill

## Instructions

When user provides a keyword or wish phrase, generate a professional Doufang artwork prompt using the following process:

1. **Understand the keyword meaning:**
   - Wealth -> 招財進寶, 富貴吉祥
   - Health -> 龍馬精神, 延年益壽
   - Career/Success -> 大展宏圖, 步步高升
   - Peace/Harmony -> 平安喜樂, 歲歲平安
   - Love -> 永結同心, 花好月圓
   - Study/Wisdom -> 學業有成, 金榜題名
   - General Luck -> 萬事如意, 心想事成

2. **Generate a 4-character blessing phrase** that is:
   - Elegant and culturally appropriate
   - Common in Chinese New Year usage
   - If user input is already a suitable 4-character phrase, use it directly
   - Otherwise, transform or upgrade it into a proper 4-character blessing phrase

3. **Create detailed image generation prompt** with the following elements:
   - **Format**: Diamond-shaped (rotated square) Doufang
   - **Background**: Antique gold-flecked red Xuan paper
   - **Central theme**: Bold, powerful, energetic traditional Chinese ink wash calligraphy of the 4-character blessing phrase
   - **Decorative elements**: Symbolic elements that visually represent the keyword (e.g., horse, dragon, pine tree, crane, gold ingots, clouds, mountains, sun, plum blossoms)
   - **Style**: Traditional Chinese ink painting mixed with realistic illustration, elegant, prestigious, festive but high-class
   - **Composition**: 
     - Doufang fills 85-95% of the frame
     - Centered with minimal elegant margins (2-5% of frame width, just enough to prevent edge cropping)
     - Fully visible inside the frame, not touching edges
   - **Quality**: Ultra high detail, 8k, masterpiece, professional artwork, 1:1 aspect ratio
   - **Lighting**: Soft studio lighting, gentle glow on gold details, museum-quality artwork
   - **Text requirements**: Clear, correct, readable Chinese characters with no typos or deformed text

4. **Output format:**
   ```json
   {
     "blessingPhrase": "四字祝福語",
     "imagePrompt": "詳細的英文圖片生成提示詞"
   }
   ```

## Examples

### Example 1: Wealth Theme

**Input:** "財富" or "wealth"

**Output:**
```json
{
  "blessingPhrase": "招財進寶",
  "imagePrompt": "A diamond-shaped Chinese New Year Doufang couplet on antique gold-flecked red Xuan paper. Central theme: bold, powerful, energetic traditional Chinese ink wash calligraphy of the characters '招財進寶'. Around the calligraphy: symbolic elements that visually represent wealth - gold ingots, coins, treasure chests, and prosperity symbols, painted in traditional Chinese ink painting style. Style: traditional Chinese ink painting mixed with realistic illustration, elegant, prestigious, festive but high-class, not cartoon. Material & texture: real Xuan paper texture, gold flecks, red rice paper, visible paper fibers, natural ink diffusion, subtle embossed gold foil details. Color theme: deep Chinese red, gold, black ink, warm highlights. Lighting: soft studio lighting, gentle glow on gold details, museum-quality artwork. Composition: The diamond-shaped Doufang fills 85-95% of the 1:1 frame, centered with minimal elegant margins (approximately 2-5% of frame width, just enough to prevent edge cropping). The entire artwork is fully visible inside the frame, not touching any edge, not cropped, not cut off. Clean background, symmetrical, perfectly framed, suitable for printing and hanging on wall. Quality: ultra high detail, 8k, masterpiece, professional artwork, 1:1 aspect ratio."
}
```

### Example 2: Health Theme

**Input:** "健康長壽" or "health longevity"

**Output:**
```json
{
  "blessingPhrase": "延年益壽",
  "imagePrompt": "A diamond-shaped Chinese New Year Doufang couplet on antique gold-flecked red Xuan paper. Central theme: bold, powerful, energetic traditional Chinese ink wash calligraphy of the characters '延年益壽'. Around the calligraphy: symbolic elements that visually represent health and longevity - pine trees, cranes, peaches, and bamboo, painted in traditional Chinese ink painting style. Style: traditional Chinese ink painting mixed with realistic illustration, elegant, prestigious, festive but high-class, not cartoon. Material & texture: real Xuan paper texture, gold flecks, red rice paper, visible paper fibers, natural ink diffusion, subtle embossed gold foil details. Color theme: deep Chinese red, gold, black ink, warm highlights. Lighting: soft studio lighting, gentle glow on gold details, museum-quality artwork. Composition: The diamond-shaped Doufang fills 85-95% of the 1:1 frame, centered with minimal elegant margins (approximately 2-5% of frame width, just enough to prevent edge cropping). The entire artwork is fully visible inside the frame, not touching any edge, not cropped, not cut off. Clean background, symmetrical, perfectly framed, suitable for printing and hanging on wall. Quality: ultra high detail, 8k, masterpiece, professional artwork, 1:1 aspect ratio."
}
```

### Example 3: Direct 4-Character Input

**Input:** "萬馬奔騰"

**Output:**
```json
{
  "blessingPhrase": "萬馬奔騰",
  "imagePrompt": "A diamond-shaped Chinese New Year Doufang couplet on antique gold-flecked red Xuan paper. Central theme: bold, powerful, energetic traditional Chinese ink wash calligraphy of the characters '萬馬奔騰'. Around the calligraphy: symbolic elements that visually represent energy and vitality - galloping horses, flowing clouds, dynamic movement, painted in traditional Chinese ink painting style. Style: traditional Chinese ink painting mixed with realistic illustration, elegant, prestigious, festive but high-class, not cartoon. Material & texture: real Xuan paper texture, gold flecks, red rice paper, visible paper fibers, natural ink diffusion, subtle embossed gold foil details. Color theme: deep Chinese red, gold, black ink, warm highlights. Lighting: soft studio lighting, gentle glow on gold details, museum-quality artwork. Composition: The diamond-shaped Doufang fills 85-95% of the 1:1 frame, centered with minimal elegant margins (approximately 2-5% of frame width, just enough to prevent edge cropping). The entire artwork is fully visible inside the frame, not touching any edge, not cropped, not cut off. Clean background, symmetrical, perfectly framed, suitable for printing and hanging on wall. Quality: ultra high detail, 8k, masterpiece, professional artwork, 1:1 aspect ratio."
}
```

## Key Requirements

- The Doufang should fill **85-95% of the frame** (not less)
- Minimal margins: **2-5% of frame width** (just enough to prevent edge cropping)
- **No excessive white space** or wide margins
- Traditional Chinese artistic style (ink wash, calligraphy)
- High-quality, printable artwork suitable for hanging
- Clear, correct Chinese characters with no errors
- No modern elements, no western style, no watermarks

## When to Use

- User asks to generate a Doufang prompt
- User provides a keyword or wish phrase
- User wants to create traditional Chinese New Year artwork
- User needs a prompt for image generation

## When NOT to Use

- User already has a complete prompt
- User wants to modify an existing prompt (use `optimize-doufang-prompt` instead)
- User wants to generate the actual image (use `generate-doufang-image` instead)

## Implementation Notes

- **CRITICAL: Use CLI Command Directly**
  - Execute: `doufang-prompt <keyword> [reference-image]`
  - **DO NOT create temporary .js, .ts, or any script files**
  - **DO NOT write code** - just execute the CLI command directly
  - The CLI command handles all API calls and returns JSON output automatically
