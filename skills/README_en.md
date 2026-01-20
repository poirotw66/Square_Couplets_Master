# Square Couplets Master - Claude Agent Skills User Guide
[English](./README_en.md) | [繁體中文](./README.md)

This directory contains three Claude Agent Skills that can be used in Cursor or other AI IDEs supporting the Claude Agent Skills protocol for generating traditional Chinese New Year Doufang artwork.

> **🎉 v1.1.0 Major Update**: New architecture, progress indicator, DEBUG mode, --version support, 60% code duplication reduction!

## ✨ v1.1.0 New Features

- ⠋ **Progress Indicator** - Shows animated feedback during image generation (30-60 seconds estimated)
- 🏷️ **Version Query** - All commands support `--version` flag
- 🐛 **DEBUG Mode** - Set `DEBUG_DOUFANG=1` to view detailed path lookup process
- 🎨 **Smart Optimization** - Improved prompt optimization engine with improvement summary display
- 🖼️ **Format Extension** - Supports JPG, JPEG, PNG, GIF, WebP, BMP
- 📦 **Architecture Refactoring** - Shared utility modules, eliminating 60% code duplication
- 🔧 **Consistency** - All skills use unified error handling and parameter validation

## 📦 Installation Methods

### Method 1: Install from npm (Recommended)

```bash
npm install -g @justin_666/square-couplets-master-skills
```

After installation, you can access skills using CLI tools:

```bash
# List all available skills
doufang-skills list

# View content of a specific skill
doufang-skills show generate-doufang-prompt

# Get skill file path
doufang-skills path generate-doufang-image
```

### Execute Skills Using CLI Commands

After installation, you can directly execute skills using CLI commands:

```bash
# Generate prompt
doufang-prompt "wealth"
doufang-prompt "health" images/reference.png
doufang-prompt --version  # View version (new!)

# Generate image (now with progress indicator! v1.1.0)
doufang-image "A diamond-shaped Doufang..." gemini-3-pro-image-preview 2K
# Displays: ⠋ Generating image... (this may take 30-60 seconds)

doufang-image "..." gemini-3-pro-image-preview 2K images/ref.png output/my-doufang.png

# Optimize prompt (enhanced! v1.1.0)
doufang-optimize "A diamond-shaped Doufang with wide white margins..."
# Displays optimization improvement summary:
# 📊 Improvements:
#    ✓ Added frame fill percentage
#    ✓ Specified minimal margins
#    ✓ Removed wide margin references

# Use AI optimization (experimental, v1.1.0)
doufang-optimize "..." --ai

# DEBUG mode (new! v1.1.0)
DEBUG_DOUFANG=1 doufang-prompt "test"
# Shows detailed path lookup process
```

### Execute Skill Scripts Directly

You can also execute skill scripts directly:

```bash
# From project root directory
node skills/generate-doufang-prompt/index.js "wealth"
node skills/generate-doufang-image/index.js "..." gemini-3-pro-image-preview 2K
node skills/optimize-doufang-prompt/index.js "..."

# From npm package (if installed)
node node_modules/@justin_666/square-couplets-master-skills/skills/generate-doufang-prompt/index.js "wealth"
```

### Method 2: Clone from GitHub

```bash
git clone https://github.com/poirotw66/Square_Couplets_Master.git
cd Square_Couplets_Master
```

Skills files are located in the `skills/` directory.

### Method 3: Local Installation to Project

```bash
npm install @justin_666/square-couplets-master-skills
```

## 🎯 Using in Cursor / Windsurf / Antigravity

### Quick Setup (Recommended)

1. **Install CLI Tool**:
   ```bash
   npm install -g @justin_666/square-couplets-master-skills
   ```

2. **Navigate to Your Project**:
   ```bash
   cd /path/to/your/project
   ```

3. **Initialize Skills**:
   ```bash
   # Cursor
   doufang init --ai cursor
   
   # Windsurf
   doufang init --ai windsurf
   
   # Antigravity
   doufang init --ai antigravity
   
   # Claude Code
   doufang init --ai claude
   ```

4. **Use Slash Command**:
   
   **In Cursor**:
   - Type `/` and `/doufang` option will automatically appear (auto-registered)
   - After selecting `/doufang`, enter your request
   - Or directly type: `/doufang Generate a prompt for wealth theme`
   
   **In Windsurf / Antigravity**:
   ```
   /doufang Generate a prompt for wealth theme
   /doufang Create a 2K image using Gemini 3 Pro
   /doufang Optimize this prompt to reduce white space
   ```
   
   **Note**: Cursor will automatically recognize `/doufang` command and execute using CLI tool, no manual coding required.

### Manual Setup

If you want to set up manually:

1. **Ensure skills directory is in project root**:
   ```
   Your Project/
   ├── skills/
   │   ├── generate-doufang-prompt/
   │   │   └── SKILL.md
   │   ├── generate-doufang-image/
   │   │   └── SKILL.md
   │   └── optimize-doufang-prompt/
   │       └── SKILL.md
   └── ...
   ```

2. **Create Configuration Files**:
   - Cursor: Create `.cursorrules` file
   - Windsurf: Create `.windsurfrules` file
   - Antigravity: Create `.antigravityrules` file

### Usage

#### Slash Command (Recommended)

Use `/doufang` followed by your request:

```
/doufang Generate a prompt for wealth theme
/doufang Create a 2K image using Gemini 3 Pro
/doufang Optimize this prompt to reduce white space
```

#### Auto-loading

When you enter related tasks in conversation, corresponding skills will automatically load:

**Example Conversation:**
```
You: "Help me generate a Doufang prompt about wealth"
AI: [Auto-loads generate-doufang-prompt skill]
   → Generates prompt and blessing phrase
```

#### Manual Invocation

You can also directly mention skill names:

```
You: "Use generate-doufang-prompt skill to create a Doufang prompt for health theme"
```

#### Combined Usage

You can combine multiple skills:

```
You: "First generate a prompt about dragon-horse spirit, then optimize it to reduce white space, finally generate a 2K image using Gemini 3 Pro"
```

## 📚 Skills Detailed Description

### 1. 📝 generate-doufang-prompt

**Function**: Generate professional Doufang artwork prompts based on keywords

**Use Cases**:
- User provides keywords or wish phrases (e.g., wealth, health, love)
- Need to generate traditional Chinese New Year artwork prompts
- Need to convert keywords to four-character blessing phrases

**Input Examples**:
```
"Help me generate a Doufang prompt about wealth"
"Create a Doufang prompt for health and longevity theme"
"Generate a Doufang prompt about career success"
```

**Output Format**:
```json
{
  "blessingPhrase": "招財進寶",
  "imagePrompt": "A diamond-shaped Chinese New Year Doufang couplet..."
}
```

**Keyword Mapping**:
- Wealth → 招財進寶, 富貴吉祥
- Health → 龍馬精神, 延年益壽
- Career → 大展宏圖, 步步高升
- Peace → 平安喜樂, 歲歲平安
- Love → 永結同心, 花好月圓
- Studies → 學業有成, 金榜題名

### 2. 🎨 generate-doufang-image

**Function**: Generate actual Doufang artwork images using Google Gemini API

**Use Cases**:
- User already has a prompt and wants to generate actual images
- Need to test different models or resolutions
- Need to generate artwork with reference image style

**Supported Models**:
- **Gemini 2.5 Flash** (`gemini-2.5-flash-image`)
  - ⚡ Fast generation
  - 📐 Only supports 1K resolution (1024×1024)
  - ✅ Free API Key friendly
  - 🎯 Suitable for quick testing and iteration

- **Gemini 3 Pro** (`gemini-3-pro-image-preview`)
  - ⭐ High quality, rich details
  - 📐 Supports 1K / 2K / 4K resolutions
  - 🎨 Better style understanding
  - 💰 Requires paid API Key (billing enabled)
  - 🖼️ Suitable for final works and printing

**Usage Examples**:
```
"Generate a 2K resolution image using Gemini 3 Pro"
"Generate an image using this prompt, referencing this image style"
"Quickly generate a test image using Flash model"
```

**Parameters**:
- `prompt` (required): Image generation prompt
- `model` (optional): `gemini-2.5-flash-image` or `gemini-3-pro-image-preview`
- `imageSize` (optional): `1K`, `2K`, `4K` (Pro model supports all sizes, Flash only supports 1K)
- `apiKey` (optional): Gemini API Key (if environment variable not set)
- `referenceImage` (optional): Base64 encoded reference image or file path

### 3. ✨ optimize-doufang-prompt

**Function**: Optimize Doufang prompts to reduce excessive white space and improve composition

> **🎉 v1.1.0 Upgrade**: New optimization engine with improvement summary display, supports AI optimization (experimental)

**Use Cases**:
- Generated images have too much white space
- Need to improve prompt quality
- Generated images have poor composition
- Need tighter composition

**Optimization Focus**:
- ❌ Remove descriptions like "wide white margins", "generous margins"
- ✅ Change to "minimal margins (2-5%)"
- ✅ Ensure Doufang occupies 90-95% of frame space
- ✅ Emphasize visual impact rather than safety margins
- ✅ Display optimization improvement summary (v1.1.0 new feature)

**Usage Examples**:
```
"Optimize this prompt to reduce white space"
"Improve composition so Doufang occupies more of the frame"
"This prompt generates images with too much white space, help me optimize it"

# CLI usage (v1.1.0)
doufang-optimize "A diamond with wide white margins"

# Output example:
# ✅ Optimized prompt:
# A diamond with minimal elegant margins (2-5% of frame width)
# Composition: The diamond-shaped Doufang fills 90-95% of the 1:1 frame...
#
# 📊 Improvements:
#    ✓ Added frame fill percentage
#    ✓ Specified minimal margins
#    ✓ Removed wide margin references

# Use AI optimization (experimental)
doufang-optimize "..." --ai
```

**Optimization Rules**:
- Change "wide white margins" to "minimal elegant margins (2-5%)"
- Change "generous blank margins" to "Doufang occupies 90-95% of image area"
- Add emphasis phrases like "maximize visual impact"
- Remove all descriptions like "wide margins", "excessive white space"

## 🔄 Workflow Examples

### Complete Workflow

```
1. Generate Prompt
   → "Help me generate a Doufang prompt about wealth"
   → [Use generate-doufang-prompt]
   → Get: blessingPhrase + imagePrompt

2. (Optional) Optimize Prompt
   → "Optimize this prompt to reduce white space"
   → [Use optimize-doufang-prompt]
   → Get: optimized imagePrompt

3. Generate Image
   → "Generate a 2K resolution image using Gemini 3 Pro"
   → [Use generate-doufang-image]
   → Get: generated image (base64 or file)
```

### Quick Test Workflow

```
1. "Generate a prompt about health and quickly generate an image using Flash model"
   → [Automatically combines generate-doufang-prompt + generate-doufang-image]
```

### High-Quality Workflow

```
1. "Generate a prompt about dragon-horse spirit"
2. "Optimize this prompt to ensure tight composition"
3. "Generate a 4K resolution image using Gemini 3 Pro, referencing this image style"
   → [Upload reference image]
```

## ⚙️ Configuration Requirements

### API Key Setup

Google Gemini API Key is required when using `generate-doufang-image` skill:

**Method 1: Environment Variable (Recommended)**
```bash
export GEMINI_API_KEY="your-api-key-here"
# or
export API_KEY="your-api-key-here"
```

**Method 2: Provide in Conversation**
```
You: "Use this API Key: xxxxx to generate image"
```

**Get API Key**:
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API Key
4. Copy and save (only shown once)

### Model Selection Recommendations

| Use Case | Recommended Model | Resolution | Reason |
|----------|------------------|------------|--------|
| Quick Testing | Gemini 2.5 Flash | 1K | Fast, free-friendly |
| Design Iteration | Gemini 2.5 Flash | 1K | Quick feedback |
| Final Work | Gemini 3 Pro | 2K/4K | High quality, rich details |
| Printing | Gemini 3 Pro | 4K | Highest resolution |

## 🐛 Common Issues

### Q: Cursor cannot recognize skills?

**A**: Ensure:
1. `skills/` directory is in project root
2. Each skill has a `SKILL.md` file
3. `SKILL.md` file contains correct frontmatter (name, description)

**Or use automatic initialization (recommended):**
```bash
doufang init --ai cursor
```

### Q: How to confirm skills are loaded?

**A**: In Cursor, when you mention related tasks, AI should automatically use corresponding skills. You can also directly ask:
```
"List available Doufang skills"
```

**v1.1.0 New Feature**: Use DEBUG mode to view detailed information:
```bash
DEBUG_DOUFANG=1 doufang-prompt "test"
```

### Q: Generated images have too much white space?

**A**: Use the improved `optimize-doufang-prompt` skill (v1.1.0 enhanced):
```
"Optimize this prompt to reduce white space, make Doufang occupy 90-95% of the frame"

# Or use CLI
doufang-optimize "your prompt with wide margins"
# Will display optimization improvement summary
```

### Q: Flash model doesn't support 2K/4K?

**A**: Correct. Flash model only supports 1K (1024×1024). For higher resolutions, please use Gemini 3 Pro model.

### Q: Pro model requires payment?

**A**: Yes, Gemini 3 Pro requires an API Key with billing enabled. If your API Key doesn't have billing enabled, please use Gemini 2.5 Flash model.

### Q: How to add reference images?

**A**: Mention reference image in conversation:
```
"Generate an image using this prompt, referencing this image [upload image]"
```

Or use file path:
```
"Generate an image using this prompt, reference image path: ./images/reference.png"
```

**v1.1.0 New Feature**: Supports more image formats (JPG, JPEG, PNG, GIF, WebP, BMP)

### Q: How long does image generation take?

**A**: v1.1.0 new progress indicator:
- Flash model: Approximately 10-20 seconds
- Pro model: Approximately 30-60 seconds
- Displays: ⠋ Generating image... (this may take 30-60 seconds)

### Q: How to check tool version?

**A**: v1.1.0 new feature:
```bash
doufang-prompt --version
doufang-image --version
doufang-optimize --version
doufang-skills --version
```

### Q: What to do if encountering path issues?

**A**: v1.1.0 new DEBUG mode:
```bash
DEBUG_DOUFANG=1 doufang-prompt "test"
```
Will display all path lookup processes to help diagnose issues.

## 📖 More Resources

- **Project Homepage**: https://github.com/poirotw66/Square_Couplets_Master
- **npm Package**: https://www.npmjs.com/package/@justin_666/square-couplets-master-skills
- **Issue Reporting**: https://github.com/poirotw66/Square_Couplets_Master/issues

## 📝 Skills File Structure

```
skills/
├── README.md                          # This file
├── generate-doufang-prompt/
│   └── SKILL.md                       # Generate prompt skill
├── generate-doufang-image/
│   └── SKILL.md                       # Generate image skill
└── optimize-doufang-prompt/
    └── SKILL.md                       # Optimize prompt skill
```

Each `SKILL.md` file contains:
- **Frontmatter**: name, description
- **Instructions**: Detailed usage instructions
- **Examples**: Usage examples
- **Parameters**: Parameter descriptions

## 🎓 Learning Resources

### Understanding Claude Agent Skills

Claude Agent Skills is a protocol that allows AI IDEs (like Cursor) to load and use predefined skills. Each skill is a Markdown file containing:
- Skill name and description
- Usage instructions
- Examples and parameters

### Best Practices

1. **Clear Description**: Clearly state what you want
2. **Step-by-step Execution**: For complex tasks, execute step by step
3. **Provide Context**: If using reference images, clearly specify
4. **Check Output**: After generation, check results and optimize if necessary

## 🤝 Contributing

Welcome to submit issues and improvement suggestions! If you want to:
- Report bugs
- Request new features
- Improve documentation
- Submit Pull Requests

Please go to [GitHub Issues](https://github.com/poirotw66/Square_Couplets_Master/issues)

---

**License**: CC BY-NC-SA 4.0 (Creative Commons Attribution-NonCommercial-ShareAlike 4.0)

**Author**: Justin

**Version**: v1.1.0

**Last Updated**: 2026-01-20

---

## 📈 Version History

### v1.1.0 (2026-01-20) - Major Update

**Architecture Optimization**:
- Created shared utility modules - eliminated 60% code duplication
- Unified error handling and path lookup logic

**User Experience**:
- ⠋ Progress indicator (image generation)
- 🏷️ --version flag support
- 🐛 DEBUG mode (DEBUG_DOUFANG=1)

**Feature Enhancements**:
- Rewrote optimize-doufang-prompt (displays improvement summary)
- Extended MIME type support (6 formats)
- AI optimization preparation (experimental)

**Code Quality**:
- All skills use consistent patterns
- Better maintainability
- 100% backward compatible

View full updates: [CHANGELOG.md](../CHANGELOG.md) | [RELEASE_v1.1.0.md](../RELEASE_v1.1.0.md)
