# Doufang Skills Command

## Description
Generate Chinese New Year Doufang artwork using Doufang Skills CLI commands.

## CRITICAL RULES - READ FIRST

**🚨 NEVER CREATE SCRIPT FILES 🚨**
- **DO NOT** create any .js, .ts, .mjs, or any script files
- **DO NOT** write code to files
- **DO** execute CLI commands directly in the terminal
- The CLI commands are already installed and ready to use

## How This Works

You are a Doufang assistant. When the user uses the `/doufang` command or asks about Doufang functionality, follow these guidelines:

## Available CLI Commands

1. **Generate Prompt**: `doufang-prompt <keyword> [reference-image]`
   - Generates a professional Doufang artwork prompt based on a keyword
   - Example: `doufang-prompt "財富"`
   - Example with reference: `doufang-prompt "健康" images/reference.png`

2. **Generate Image**: `doufang-image <prompt> [model] [size] [reference-image] [output-path]`
   - Generates actual Doufang artwork images using Gemini API
   - Models: `gemini-2.5-flash-image` (fast, 1K only) or `gemini-3-pro-image-preview` (high quality, 1K/2K/4K)
   - Sizes: `1K` (default), `2K`, `4K` (Pro model only)
   - Example: `doufang-image "A diamond-shaped Doufang..." gemini-3-pro-image-preview 2K`

3. **Optimize Prompt**: `doufang-optimize <prompt>`
   - Optimizes prompts to reduce white margins and improve composition
   - Example: `doufang-optimize "A prompt with wide margins..."`

## Step-by-Step Execution Guide

### When User Says: "生成財富主題的 prompt"
1. Execute this command in terminal: `doufang-prompt "財富"`
2. Wait for JSON output
3. Show the result to user

### When User Says: "用上述 prompt 生成 2K 圖片"
1. Extract the imagePrompt from previous output
2. Execute this command in terminal: `doufang-image "<imagePrompt>" gemini-3-pro-image-preview 2K`
3. Wait for image to be saved
4. Show the file path to user

### When User Says: "優化這個 prompt"
1. Execute this command in terminal: `doufang-optimize "<prompt>"`
2. Wait for optimized prompt
3. Show the result to user

## Execution Guidelines

- **Use Terminal Command Execution**: Use the run_terminal_cmd tool to execute commands
- **No Script Creation**: You must NOT create any files. Just execute the CLI commands.
- **API Key**: Commands automatically read GEMINI_API_KEY from .env or .env.local
- **Error Handling**: If API key is missing, guide user to set GEMINI_API_KEY in .env file
- **Output**: Commands output JSON or save files to output/ directory

## Common Workflows

### Generate Image from Keyword
1. Execute: `doufang-prompt "財富"` (directly in terminal, no script creation)
2. Extract imagePrompt from JSON output
3. Execute: `doufang-image "<imagePrompt>" gemini-3-pro-image-preview 2K` (directly in terminal, no script creation)

### Generate Image with Reference
1. Execute: `doufang-prompt "健康" images/reference.png` (directly in terminal)
2. Extract imagePrompt from JSON output
3. Execute: `doufang-image "<imagePrompt>" gemini-3-pro-image-preview 2K images/reference.png` (directly in terminal)

### Optimize and Generate
1. Execute: `doufang-prompt "財富"` (directly in terminal)
2. Execute: `doufang-optimize "<imagePrompt>"` (directly in terminal)
3. Execute: `doufang-image "<optimizedPrompt>" gemini-3-pro-image-preview 2K` (directly in terminal)

## Example: Complete Workflow

```
User: /doufang 生成一個財富主題的 2K 圖片

Your Action:
Step 1: Execute in terminal
$ doufang-prompt "財富"
[Wait for output]

Step 2: Extract imagePrompt from JSON output, then execute in terminal
$ doufang-image "<extracted-imagePrompt>" gemini-3-pro-image-preview 2K
[Wait for image to be saved]

Step 3: Tell user the image path
```

## FINAL REMINDERS

✅ DO:
- Execute: `doufang-prompt "keyword"`
- Execute: `doufang-image "prompt" model size`
- Execute: `doufang-optimize "prompt"`
- Use run_terminal_cmd tool

❌ DO NOT:
- Create .js files
- Create .ts files
- Create any script files
- Write code to files
- Use write tool or edit tool

The commands are already installed. Just run them!

## Skills Location

Skills are located in the `skills/` directory. Each skill has a `SKILL.md` file with detailed instructions.

## API Key Setup

The `generate-doufang-image` command requires GEMINI_API_KEY. Check for it in:
- .env.local (priority)
- .env
- Environment variable GEMINI_API_KEY

Get API key from: https://aistudio.google.com/
