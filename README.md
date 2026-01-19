# 春聯斗方大師 (Square Couplets Master)

一個使用 Google Gemini AI 生成傳統春聯斗方藝術作品的應用程式。將您的願望轉化為精美的書法藝術作品。

View your app in AI Studio: https://ai.studio/apps/drive/134htDa_3SXqpM65lyE57_S7pY5DiemK4

## ✨ 功能特色

- 🎨 **AI 生成春聯斗方**：輸入關鍵字，自動生成傳統風格的春聯藝術作品
- 🖼️ **參考圖片支持**：上傳參考圖片，AI 會參考其風格生成作品
- 📐 **多種解析度**：支持 1K、2K、4K 解析度輸出
- 🎭 **雙模型選擇**：Gemini 2.5 Flash（快速）和 Gemini 3 Pro（高品質）

## 🚀 快速開始

### 前置需求

- Node.js (建議使用最新 LTS 版本)

### 安裝步驟

1. **安裝依賴套件：**
   ```bash
   npm install
   ```

2. **設置 API Key：**
   - 在 [.env.local](.env.local) 文件中設置 `GEMINI_API_KEY` 為您的 Gemini API key
   - 或者直接在應用程式的設置中輸入 API key

3. **運行應用程式：**
   ```bash
   npm run dev
   ```

4. **打開瀏覽器：**
   - 訪問 `http://localhost:5173`（或終端顯示的地址）

## 🌐 部署到 GitHub Pages

本專案已配置自動部署到 GitHub Pages。當您推送代碼到 `main` 或 `master` 分支時，GitHub Actions 會自動構建並部署應用程式。

### 部署步驟

1. **啟用 GitHub Pages：**
   - 前往 GitHub 倉庫的 Settings
   - 點擊左側的 "Pages"
   - 在 "Source" 部分選擇 "GitHub Actions"

2. **推送代碼：**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **查看部署狀態：**
   - 前往倉庫的 "Actions" 標籤頁
   - 查看部署工作流程的執行狀態

4. **訪問部署的應用：**
   - 部署完成後，應用將在以下地址可用：
   - `https://[您的用戶名].github.io/Square_Couplets_Master/`

### 手動觸發部署

如果需要手動觸發部署，可以：
- 前往 "Actions" 標籤頁
- 選擇 "Deploy to GitHub Pages" 工作流程
- 點擊 "Run workflow" 按鈕

## 💡 使用建議

### ⭐ 推薦使用 Gemini 3 Pro 模型以獲得最佳體驗

**為什麼選擇 Gemini 3 Pro？**

- ✨ **更高品質**：生成的圖片具有更豐富的細節和更精緻的視覺效果
- 🎨 **更好的風格理解**：對參考圖片的風格理解更準確，生成的作品更貼近您的期望
- 📐 **支持高解析度**：支持 2K 和 4K 解析度，適合打印和高品質展示
- 🎯 **更精確的構圖**：對傳統書法和藝術風格的把握更準確

**模型對比：**

| 特性 | Gemini 2.5 Flash | Gemini 3 Pro |
|------|-----------------|--------------|
| 生成速度 | ⚡ 快速 | 🐢 較慢 |
| 圖片品質 | ✅ 良好 | ⭐ 優秀 |
| 解析度支持 | 1K 僅 | 1K / 2K / 4K |
| 風格理解 | ✅ 良好 | ⭐ 優秀 |
| 推薦用途 | 快速測試、迭代 | 最終作品、打印 |

**注意：** Gemini 3 Pro 需要付費 API Key（已啟用帳單）。如果您的 API Key 未啟用帳單，請使用 Gemini 2.5 Flash 模型。

## 📖 使用說明

1. **輸入關鍵字**：在輸入框中輸入您的願望或祝福語（例如：財富、健康、愛情等）
2. **（可選）上傳參考圖片**：點擊上傳區域選擇一張圖片作為風格參考
3. **選擇模型和解析度**：點擊右上角設置圖標，選擇您偏好的模型和輸出解析度
4. **生成作品**：點擊「Generate」按鈕，等待 AI 生成您的專屬春聯斗方
5. **下載作品**：生成完成後，點擊「Download Artwork」下載您的作品

## 🛠️ 技術棧

- **前端框架**：React 19 + TypeScript
- **樣式**：Tailwind CSS
- **AI 模型**：Google Gemini 2.5 Flash / Gemini 3 Pro
- **構建工具**：Vite

## 📝 授權 (License)

本專案採用 **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License** (CC BY-NC-SA 4.0) 授權。

Copyright (c) 2026 Justin

### 您可以自由地：

- ✅ **分享** — 在任何媒介以任何形式複製、發行本作品
- ✅ **衍生** — 修改、轉換或依本作品進行創作

### 惟需遵守下列條件：

- 📌 **姓名標示** — 您必須給予適當的署名，並提供本授權條款的連結
- 📌 **非商業性** — 您不得將本作品用於商業目的
- 📌 **相同方式分享** — 如果您改變、轉變或依據本作品進行創作，您必須採用與原先授權條款相同的授權方式來散布您的貢獻

### 商業授權

如需將本專案用於商業目的，請聯繫作者以取得商業授權：

- **GitHub:** [@poirotw66](https://github.com/poirotw66)
- **Project Issues:** [Square_Couplets_Master](https://github.com/poirotw66/Square_Couplets_Master)

### 授權條款詳情

要查看完整的授權條款，請訪問：
- [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

或查看專案根目錄的 [LICENSE](LICENSE) 文件。

---

**免責聲明：** 本軟體按「現狀」提供，不提供任何形式的明示或暗示擔保。
