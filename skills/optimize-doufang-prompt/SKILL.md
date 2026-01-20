---
name: optimize-doufang-prompt
description: Optimize Doufang prompts to reduce excessive white margins and improve composition. Use when generated images have too much white space, poor framing, or when user wants to improve prompt quality.
---

# optimize-doufang-prompt Skill

## Instructions

When user reports that generated images have excessive white margins, poor composition, or wants to improve prompt quality:

1. **Identify margin-related issues:**
   - Look for phrases like "wide margins", "generous margins", "wide white margins", "blank margins"
   - Check for margin percentages > 5%
   - Look for "generous blank margins around all four corners"
   - Identify any instructions that might cause excessive white space

2. **Optimize the prompt by replacing problematic phrases:**
   
   **Remove/Replace:**
   - ❌ "with wide white margins"
   - ❌ "with generous blank margins"
   - ❌ "with wide safe margins"
   - ❌ "generous blank margins around all four corners"
   - ❌ "wide safe margins around the artwork"
   
   **Replace with:**
   - ✅ "centered with minimal elegant margins (approximately 2-5% of frame width, just enough to prevent edge cropping)"
   - ✅ "minimal margins - the Doufang should fill most of the frame (85-95% of image area)"
   - ✅ "The Doufang should occupy 85-95% of the image area, maximizing visual impact"

3. **Add explicit composition instructions:**
   - Add: "The Doufang should fill 85-95% of the frame"
   - Add: "Minimal margins (2-5% of frame width)"
   - Add: "Maximize visual impact by making the Doufang occupy most of the frame"
   - Add: "Avoid excessive white space or wide margins"

4. **Update framing requirements:**
   - Ensure instructions specify: "just enough to prevent edge cropping"
   - Emphasize: "maximizing visual impact"
   - Remove any mention of "wide" or "generous" margins

## Optimization Rules

### Rule 1: Margin Specification
**Before:**
```
"...with wide white margins around all four corners..."
```

**After:**
```
"...centered with minimal elegant margins (approximately 2-5% of frame width, just enough to prevent edge cropping)..."
```

### Rule 2: Frame Fill Percentage
**Before:**
```
"...with generous blank margins..."
```

**After:**
```
"...The Doufang should occupy 85-95% of the image area, maximizing visual impact..."
```

### Rule 3: Composition Emphasis
**Before:**
```
"...wide safe margins around the artwork..."
```

**After:**
```
"...minimal margins - the Doufang should fill most of the frame (85-95% of image area)..."
```

## Examples

### Example 1: Fixing Wide Margins

**Input Prompt (Problematic):**
```
A diamond-shaped Chinese New Year Doufang centered in a 1:1 frame with wide white margins. The artwork is a masterpiece of traditional ink-wash fusion...
```

**Optimized Prompt:**
```
A diamond-shaped Chinese New Year Doufang fills the majority of the 1:1 frame, centered with minimal elegant margins (approximately 2-5% of frame width, just enough to prevent edge cropping). The Doufang should occupy 85-95% of the image area, maximizing visual impact. The artwork is a masterpiece of traditional ink-wash fusion...
```

### Example 2: Improving Composition Instructions

**Input Prompt (Problematic):**
```
Composition: The diamond-shaped Doufang is fully visible and centered, with generous blank margins around all four corners. Clear safe area padding around the diamond shape for printing.
```

**Optimized Prompt:**
```
Composition: The diamond-shaped Doufang fills 85-95% of the 1:1 frame, centered with minimal elegant margins (approximately 2-5% of frame width, just enough to prevent edge cropping). The entire artwork is fully visible inside the frame, not touching any edge, not cropped, not cut off. The Doufang should occupy most of the image area, maximizing visual impact. Clean background, symmetrical, perfectly framed, suitable for printing and hanging on wall.
```

### Example 3: Complete Prompt Optimization

**Input Prompt (Problematic):**
```
Framing requirements:
- The entire diamond-shaped Doufang must be fully visible inside the image.
- Wide safe margins around the artwork.
- No cropping, no touching edges, no cut-off.
```

**Optimized Prompt:**
```
Framing requirements:
- The entire diamond-shaped Doufang must be fully visible inside the image.
- Minimal margins - the Doufang should fill most of the frame (85-95% of image area).
- No cropping, no touching edges, no cut-off.
- Maximize visual impact by making the Doufang occupy most of the frame.
```

## Key Optimization Principles

1. **Never use "wide" or "generous" margins** - Always specify minimal margins (2-5%)
2. **Always specify frame fill percentage** - 85-95% of image area
3. **Emphasize visual impact** - Over safety margins
4. **Be specific about margin size** - "2-5% of frame width"
5. **Clarify purpose** - "just enough to prevent edge cropping"

## When to Use

- User reports images have too much white space
- User wants to improve prompt quality
- Generated images have poor composition
- User wants tighter framing
- User mentions "too much margin" or "excessive white space"

## When NOT to Use

- User wants to generate a new prompt (use `generate-doufang-prompt` instead)
- User wants to generate an image (use `generate-doufang-image` instead)
- Prompt already has optimal composition instructions

## Integration with Other Skills

This skill works best when:
1. Used after `generate-doufang-prompt` if the generated prompt has margin issues
2. Used before `generate-doufang-image` to ensure optimal composition
3. Used to fix prompts that resulted in poor image composition

## Output Format

Return the optimized prompt as a string, maintaining all other aspects of the original prompt while only modifying the composition and margin-related instructions.

## Implementation Notes

- **CRITICAL: Use CLI Command Directly**
  - Execute: `doufang-optimize <prompt>`
  - **DO NOT create temporary .js, .ts, or any script files**
  - **DO NOT write code** - just execute the CLI command directly
  - The CLI command handles prompt optimization and returns the optimized prompt automatically
