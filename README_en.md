# Square Couplets Master
[English](./README_en.md) | [繁體中文](./README.md)

An application that uses Google Gemini AI to generate traditional Chinese New Year Doufang (square couplet) artwork. Transform your wishes into exquisite calligraphy art pieces.

## ✨ Features

- 🎨 **AI-Generated Doufang**: Enter keywords to automatically generate traditional-style Chinese New Year couplet artwork
- 🖼️ **Reference Image Support**: Upload reference images, and AI will generate artwork referencing their style
- 📐 **Multiple Resolutions**: Supports 1K, 2K, and 4K resolution output
- 🎭 **Dual Model Selection**: Gemini 2.5 Flash (fast) and Gemini 3 Pro (high quality)

## 🚀 Quick Start

### Prerequisites

- Node.js (recommended: latest LTS version)

### Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up API Key:**
   - Set `GEMINI_API_KEY` in the [.env.local](.env.local) file to your Gemini API key
   - Or directly enter the API key in the application settings

3. **Run the application:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   - Visit `http://localhost:5173` (or the address shown in the terminal)

## 🌐 Deploy to GitHub Pages

This project is configured for automatic deployment to GitHub Pages. When you push code to the `main` or `master` branch, GitHub Actions will automatically build and deploy the application.

### Deployment Steps

1. **Enable GitHub Pages:**
   - Go to your GitHub repository's Settings
   - Click "Pages" on the left sidebar
   - Select "GitHub Actions" in the "Source" section

2. **Push code:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Check deployment status:**
   - Go to the repository's "Actions" tab
   - View the execution status of the deployment workflow

4. **Access the deployed application:**
   - After deployment completes, the application will be available at:
   - `https://[your-username].github.io/Square_Couplets_Master/`

### Manual Deployment Trigger

If you need to manually trigger deployment:
- Go to the "Actions" tab
- Select the "Deploy to GitHub Pages" workflow
- Click the "Run workflow" button

## 💡 Usage Recommendations

### ⭐ Recommended: Use Gemini 3 Pro Model for Best Experience

**Why Choose Gemini 3 Pro?**

- ✨ **Higher Quality**: Generated images have richer details and more refined visual effects
- 🎨 **Better Style Understanding**: More accurate understanding of reference image styles, generated works closer to your expectations
- 📐 **High Resolution Support**: Supports 2K and 4K resolutions, suitable for printing and high-quality display
- 🎯 **More Precise Composition**: More accurate grasp of traditional calligraphy and artistic styles

**Model Comparison:**

| Feature | Gemini 2.5 Flash | Gemini 3 Pro |
|---------|-----------------|--------------|
| Generation Speed | ⚡ Fast | 🐢 Slower |
| Image Quality | ✅ Good | ⭐ Excellent |
| Resolution Support | 1K only | 1K / 2K / 4K |
| Style Understanding | ✅ Good | ⭐ Excellent |
| Recommended Use | Quick testing, iteration | Final artwork, printing |

**Note:** Gemini 3 Pro requires a paid API Key (billing enabled). If your API Key doesn't have billing enabled, please use the Gemini 2.5 Flash model.

## 🎨 Example Artwork Comparison

The following example artworks were generated using the same keyword "萬馬奔騰" (Ten Thousand Horses Galloping), demonstrating the differences between the two models:

### Gemini 2.5 Flash Generated Artwork

<div align="center">
  <img src="images/gemini2-5-萬馬奔騰.png" alt="Gemini 2.5 Flash - 萬馬奔騰" width="512" />
  <p><em>Gemini 2.5 Flash Generated - Fast generation, good quality</em></p>
</div>

### Gemini 3 Pro Generated Artwork

<div align="center">
  <img src="images/gemin3-萬馬奔騰.png" alt="Gemini 3 Pro - 萬馬奔騰" width="512" />
  <p><em>Gemini 3 Pro Generated - Higher quality, rich details</em></p>
</div>

### Comparison Summary

From the above examples, we can see:

- **Gemini 2.5 Flash**: Fast generation speed, suitable for quick testing and iteration, good image quality
- **Gemini 3 Pro**: Longer generation time, but significantly improved image quality, richer details, more suitable for final artwork and printing purposes

**Recommendation:** If you pursue high-quality artwork, we strongly recommend using the Gemini 3 Pro model.

## 📖 Usage Instructions

1. **Enter keywords**: Enter your wishes or blessings in the input box (e.g., wealth, health, love, etc.)
2. **(Optional) Upload reference image**: Click the upload area to select an image as a style reference
3. **Select model and resolution**: Click the settings icon in the top right corner to select your preferred model and output resolution
4. **Generate artwork**: Click the "Generate" button and wait for AI to generate your exclusive Doufang artwork
5. **Download artwork**: After generation completes, click "Download Artwork" to download your work

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **AI Models**: Google Gemini 2.5 Flash / Gemini 3 Pro
- **Build Tool**: Vite

## 📦 NPM Installation

The Claude Agent Skills for this project have been published to npm and can be installed as follows.

> **🎉 v1.1.0 Update**: Brand new shared utilities architecture, progress indicator, --version support, enhanced DEBUG mode!

### Global CLI Installation (Recommended)

```bash
npm install -g @justin_666/square-couplets-master-skills
```

**New Features v1.1.0**:
- ⠋ **Progress Indicator** - Shows animated feedback during image generation
- 🏷️ **Version Query** - `doufang-prompt --version`
- 🐛 **DEBUG Mode** - `DEBUG_DOUFANG=1` to view detailed logs
- 🎨 **Smart Optimization** - Improved prompt optimization engine
- 📦 **Code Refactoring** - Eliminated 60% duplicate code, more stable and reliable

### Initialize Skills in Your Project

After installation, navigate to your project directory and initialize skills:

```bash
# Navigate to your project
cd /path/to/your/project

# Initialize for Cursor
doufang init --ai cursor

# Or initialize for Windsurf
doufang init --ai windsurf

# Or initialize for Antigravity
doufang init --ai antigravity

# Or initialize for Claude Code
doufang init --ai claude
```

### Using Slash Commands

After initialization, use slash commands in Cursor / Windsurf / Antigravity:

**In Cursor (auto-registered):**
- After executing `doufang init --ai cursor`, the `/doufang` command will be automatically registered
- Type `/` to see the `/doufang` option
- After selecting, enter your request, e.g., "Generate a prompt for wealth theme"
- Cursor will automatically use the CLI tool to execute, no need to manually write code

**In Windsurf / Antigravity:**
```
/doufang Generate a prompt for wealth theme
/doufang Create a 2K image using Gemini 3 Pro
/doufang Optimize this prompt to reduce white space
```

### CLI Tool Commands

After installation, you can use multiple CLI commands:

**Manage Skills:**
```bash
# List all available skills
doufang-skills list

# View content of a specific skill
doufang-skills show generate-doufang-prompt

# Get skill file path (for programmatic access)
doufang-skills path generate-doufang-image

# View version (new!)
doufang-skills --version

# View help
doufang-skills help
```

**Execute Skills (Agents can directly call):**
```bash
# Generate prompt
doufang-prompt "wealth"
doufang-prompt "health" images/reference.png
doufang-prompt --version  # View version (new!)

# Generate image (now with progress indicator!)
doufang-image "A diamond-shaped Doufang..." gemini-3-pro-image-preview 2K
# Shows: ⠋ Generating image... (this may take 30-60 seconds)

doufang-image "..." gemini-2.5-flash-image 1K images/ref.png output/my-doufang.png

# Optimize prompt (enhanced functionality!)
doufang-optimize "A diamond-shaped Doufang with wide white margins..."
# Shows optimization improvement summary

# Use AI optimization (experimental)
doufang-optimize "..." --ai
```

**DEBUG Mode (new!):**
```bash
# View detailed path lookup process
DEBUG_DOUFANG=1 doufang-prompt "test"
# Output:
# 🔍 Checking paths for services directory...
#    ✅ Found services at: /path/to/services

DEBUG_DOUFANG=1 doufang-image "..." gemini-3-pro-image-preview 2K
```

**Agent Usage:**
Agents can directly execute these CLI commands to generate images without manually writing code. For example:
- Agent executes: `doufang-prompt "wealth"` → Gets prompt
- Agent executes: `doufang-image "<prompt>" gemini-3-pro-image-preview 2K` → Generates image (with progress indicator)
- Agent executes: `doufang-optimize "<prompt>"` → Optimizes prompt (shows improvement summary)

### Local Installation

```bash
npm install @justin_666/square-couplets-master-skills
```

Then use in your project:

```javascript
import { readFileSync } from 'fs';
import { join } from 'path';

// Get skill file path
const skillPath = join(require.resolve('@justin_666/square-couplets-master-skills'), '../skills/generate-doufang-prompt/SKILL.md');
const skillContent = readFileSync(skillPath, 'utf-8');
```

## 🤖 Claude Agent Skills

This project includes three Claude Agent Skills that can be used in AI IDEs supporting this protocol (such as Cursor):

### 📝 generate-doufang-prompt
**Function**: Generate professional Doufang artwork prompts based on keywords

**Use Cases**:
- User provides keywords or wish phrases
- Need to generate traditional Chinese New Year artwork prompts
- Need to convert keywords into four-character blessing phrases

**Examples**:
```
"Help me generate a Doufang prompt about wealth"
"Create a Doufang prompt for health and longevity theme"
```

### 🎨 generate-doufang-image
**Function**: Generate actual Doufang artwork images using Google Gemini API

**Use Cases**:
- User already has a prompt and wants to generate an actual image
- Need to test different models or resolutions
- Need to generate artwork with reference image style

**Supported Models**:
- Gemini 2.5 Flash: Fast generation, 1K resolution
- Gemini 3 Pro: High quality, supports 1K/2K/4K resolutions

**Examples**:
```
"Generate a 2K resolution image using Gemini 3 Pro"
"Generate an image using this prompt, referencing the image style"
```

### ✨ optimize-doufang-prompt
**Function**: Optimize Doufang prompts to reduce excessive white space and improve composition

> **🎉 v1.1.0 Upgrade**: Brand new optimization engine, shows improvement summary, supports AI optimization (experimental)

**Use Cases**:
- Generated images have too much white space
- Need to improve prompt quality
- Generated images have poor composition
- Need tighter composition

**Optimization Focus**:
- Change "wide margins" to "minimal margins (2-5%)"
- Ensure Doufang occupies 90-95% of the frame space
- Emphasize visual impact rather than safety margins
- Display optimization improvement summary

**Examples**:
```
"Optimize this prompt to reduce white space"
"Improve composition to make Doufang occupy more of the frame"

# CLI Usage
doufang-optimize "A diamond with wide margins"
# Output:
# ✅ Optimized prompt: ...
# 📊 Improvements:
#    ✓ Added frame fill percentage
#    ✓ Specified minimal margins
#    ✓ Removed wide margin references

# Use AI optimization (experimental)
doufang-optimize "..." --ai
```

### 📂 Skills File Structure

```
skills/
├── generate-doufang-prompt/
│   └── SKILL.md
├── generate-doufang-image/
│   └── SKILL.md
└── optimize-doufang-prompt/
    └── SKILL.md
```

### 🚀 How to Use

In Cursor or other IDEs supporting Claude Agent Skills:

1. **Auto-load**: When you mention related tasks, the corresponding skill will automatically load
2. **Manual invocation**: Directly use skill names to invoke specific functions
3. **Combined use**: Multiple skills can be combined, e.g., first generate prompt, then optimize, finally generate image

**Note**: When using the `generate-doufang-image` skill, you need to configure the Gemini API Key.

## 📚 v1.1.0 Changelog

### 🎉 Major Improvements

**Architecture Optimization**:
- Created shared utilities module (`skills/shared/utils.js`)
- Eliminated 60% code duplication (from ~600 lines down to <100 lines)
- Unified error handling and path lookup logic

**User Experience Enhancements**:
- ⠋ Progress indicator - Shows animation during image generation
- 🏷️ --version flag - Quick version query
- 🐛 DEBUG mode - `DEBUG_DOUFANG=1` for detailed logs
- Clearer error messages

**Feature Enhancements**:
- Rewrote `optimize-doufang-prompt` (rule-based + AI ready)
- Extended MIME type support (JPG, JPEG, PNG, GIF, WebP, BMP)
- Optimization improvement summary display

**Code Quality**:
- All skills use consistent patterns
- Better maintainability and extensibility
- 100% backward compatible

View full update content: [CHANGELOG.md](CHANGELOG.md) | [RELEASE_v1.1.0.md](RELEASE_v1.1.0.md)

## 📝 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License** (CC BY-NC-SA 4.0).

Copyright (c) 2026 Justin

### You are free to:

- ✅ **Share** — Copy and distribute the work in any medium or format
- ✅ **Adapt** — Remix, transform, and build upon the work

### Under the following terms:

- 📌 **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made
- 📌 **NonCommercial** — You may not use the work for commercial purposes
- 📌 **ShareAlike** — If you remix, transform, or build upon the work, you must distribute your contributions under the same license as the original

### Commercial License

If you need to use this project for commercial purposes, please contact the author to obtain a commercial license:

- **GitHub:** [@poirotw66](https://github.com/poirotw66)
- **Project Issues:** [Square_Couplets_Master](https://github.com/poirotw66/Square_Couplets_Master)

### License Details

To view the complete license terms, please visit:
- [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Or view the [LICENSE](LICENSE) file in the project root directory.

---

**Disclaimer:** This software is provided "as is", without warranty of any kind, express or implied.
