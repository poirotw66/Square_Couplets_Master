# 春聯斗方大師 - Claude Agent Skills 使用指南

本目錄包含三個 Claude Agent Skills，可在 Cursor 或其他支援 Claude Agent Skills 協定的 AI IDE 中使用，用於生成傳統中國新年春聯斗方藝術作品。

## 📦 安裝方式

### 方式 1：從 npm 安裝（推薦）

```bash
npm install -g @justin_666/square-couplets-master-skills
```

安裝後，您可以使用 CLI 工具訪問 skills：

```bash
# 列出所有可用的 skills
doufang-skills list

# 查看特定 skill 的內容
doufang-skills show generate-doufang-prompt

# 獲取 skill 文件路徑
doufang-skills path generate-doufang-image
```

### 方式 2：從 GitHub 克隆

```bash
git clone https://github.com/poirotw66/Square_Couplets_Master.git
cd Square_Couplets_Master
```

skills 文件位於 `skills/` 目錄中。

### 方式 3：本地安裝到專案

```bash
npm install @justin_666/square-couplets-master-skills
```

## 🎯 在 Cursor / Windsurf / Antigravity 中使用

### 快速設置（推薦）

1. **安裝 CLI 工具**：
   ```bash
   npm install -g @justin_666/square-couplets-master-skills
   ```

2. **前往您的專案**：
   ```bash
   cd /path/to/your/project
   ```

3. **初始化 Skills**：
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

4. **使用 Slash Command**：
   在 Cursor / Windsurf / Antigravity 的聊天中輸入：
   ```
   /doufang Generate a prompt for wealth theme
   /doufang Create a 2K image using Gemini 3 Pro
   /doufang Optimize this prompt to reduce white space
   ```

### 手動設置

如果您想手動設置：

1. **確保 skills 目錄在專案根目錄**：
   ```
   您的專案/
   ├── skills/
   │   ├── generate-doufang-prompt/
   │   │   └── SKILL.md
   │   ├── generate-doufang-image/
   │   │   └── SKILL.md
   │   └── optimize-doufang-prompt/
   │       └── SKILL.md
   └── ...
   ```

2. **創建配置文件**：
   - Cursor: 創建 `.cursorrules` 文件
   - Windsurf: 創建 `.windsurfrules` 文件
   - Antigravity: 創建 `.antigravityrules` 文件

### 使用方式

#### Slash Command（推薦）

使用 `/doufang` 後跟您的請求：

```
/doufang Generate a prompt for wealth theme
/doufang Create a 2K image using Gemini 3 Pro
/doufang Optimize this prompt to reduce white space
```

#### 自動載入

當您在對話中輸入相關任務時，對應的 skill 會自動載入：

**示例對話：**
```
您: "幫我生成一個關於財富的春聯斗方 prompt"
AI: [自動載入 generate-doufang-prompt skill]
   → 生成提示詞和祝福語
```

#### 手動調用

您也可以直接提及 skill 名稱：

```
您: "使用 generate-doufang-prompt skill 為健康主題創建一個 Doufang prompt"
```

#### 組合使用

可以將多個 skills 組合使用：

```
您: "先生成一個關於龍馬精神的 prompt，然後優化它減少留白，最後用 Gemini 3 Pro 生成 2K 圖片"
```

## 📚 Skills 詳細說明

### 1. 📝 generate-doufang-prompt

**功能**：根據關鍵字生成專業的春聯斗方藝術作品提示詞

**使用場景**：
- 用戶提供關鍵字或願望短語（如：財富、健康、愛情）
- 需要生成傳統中國新年藝術作品提示詞
- 需要將關鍵字轉換為四字祝福語

**輸入示例**：
```
"幫我生成一個關於財富的春聯斗方 prompt"
"為健康長壽主題創建一個 Doufang prompt"
"生成一個關於事業成功的春聯斗方提示詞"
```

**輸出格式**：
```json
{
  "blessingPhrase": "招財進寶",
  "imagePrompt": "A diamond-shaped Chinese New Year Doufang couplet..."
}
```

**關鍵字映射**：
- 財富 → 招財進寶, 富貴吉祥
- 健康 → 龍馬精神, 延年益壽
- 事業 → 大展宏圖, 步步高升
- 平安 → 平安喜樂, 歲歲平安
- 愛情 → 永結同心, 花好月圓
- 學業 → 學業有成, 金榜題名

### 2. 🎨 generate-doufang-image

**功能**：使用 Google Gemini API 生成實際的春聯斗方藝術作品圖片

**使用場景**：
- 用戶已有提示詞，想要生成實際圖片
- 需要測試不同模型或解析度
- 需要生成帶參考圖片風格的藝術作品

**支持的模型**：
- **Gemini 2.5 Flash** (`gemini-2.5-flash-image`)
  - ⚡ 快速生成
  - 📐 僅支持 1K 解析度 (1024×1024)
  - ✅ 免費 API Key 友好
  - 🎯 適合快速測試和迭代

- **Gemini 3 Pro** (`gemini-3-pro-image-preview`)
  - ⭐ 高品質，細節豐富
  - 📐 支持 1K / 2K / 4K 解析度
  - 🎨 更好的風格理解
  - 💰 需要付費 API Key（已啟用帳單）
  - 🖼️ 適合最終作品和打印

**使用示例**：
```
"用 Gemini 3 Pro 生成 2K 解析度的圖片"
"使用這個 prompt 生成圖片，參考圖片風格"
"用 Flash 模型快速生成一個測試圖片"
```

**參數**：
- `prompt` (必需): 圖片生成提示詞
- `model` (可選): `gemini-2.5-flash-image` 或 `gemini-3-pro-image-preview`
- `imageSize` (可選): `1K`, `2K`, `4K`（Pro 模型支持所有尺寸，Flash 僅支持 1K）
- `apiKey` (可選): Gemini API Key（如果未設置環境變數）
- `referenceImage` (可選): 參考圖片的 base64 編碼或文件路徑

### 3. ✨ optimize-doufang-prompt

**功能**：優化 Doufang 提示詞，減少過多留白，改善構圖

**使用場景**：
- 生成的圖片留白過多
- 需要改善提示詞品質
- 生成的圖片構圖不佳
- 需要更緊湊的構圖

**優化重點**：
- ❌ 移除「寬留白」、「generous margins」等描述
- ✅ 改為「最小留白（2-5%）」
- ✅ 確保 Doufang 佔據 85-95% 的畫面空間
- ✅ 強調視覺衝擊力而非安全邊距

**使用示例**：
```
"優化這個 prompt，減少留白"
"改善構圖，讓 Doufang 佔據更多畫面"
"這個 prompt 生成的圖片留白太多，幫我優化一下"
```

**優化規則**：
- 將「wide white margins」改為「minimal elegant margins (2-5%)」
- 將「generous blank margins」改為「Doufang occupies 85-95% of image area」
- 添加「maximize visual impact」等強調語句

## 🔄 工作流程示例

### 完整工作流程

```
1. 生成 Prompt
   → "幫我生成一個關於財富的春聯斗方 prompt"
   → [使用 generate-doufang-prompt]
   → 獲得: blessingPhrase + imagePrompt

2. （可選）優化 Prompt
   → "優化這個 prompt，減少留白"
   → [使用 optimize-doufang-prompt]
   → 獲得: 優化後的 imagePrompt

3. 生成圖片
   → "用 Gemini 3 Pro 生成 2K 解析度的圖片"
   → [使用 generate-doufang-image]
   → 獲得: 生成的圖片（base64 或文件）
```

### 快速測試流程

```
1. "生成一個關於健康的 prompt 並用 Flash 模型快速生成圖片"
   → [自動組合使用 generate-doufang-prompt + generate-doufang-image]
```

### 高品質作品流程

```
1. "生成一個關於龍馬精神的 prompt"
2. "優化這個 prompt，確保構圖緊湊"
3. "用 Gemini 3 Pro 生成 4K 解析度的圖片，參考這張圖片風格"
   → [上傳參考圖片]
```

## ⚙️ 配置要求

### API Key 設置

使用 `generate-doufang-image` skill 時需要 Google Gemini API Key：

**方法 1：環境變數（推薦）**
```bash
export GEMINI_API_KEY="your-api-key-here"
# 或
export API_KEY="your-api-key-here"
```

**方法 2：在對話中提供**
```
您: "使用這個 API Key: xxxxx 生成圖片"
```

**獲取 API Key**：
1. 前往 [Google AI Studio](https://aistudio.google.com/)
2. 登入您的 Google 帳號
3. 創建新的 API Key
4. 複製並保存（只顯示一次）

### 模型選擇建議

| 用途 | 推薦模型 | 解析度 | 原因 |
|------|---------|--------|------|
| 快速測試 | Gemini 2.5 Flash | 1K | 速度快，免費友好 |
| 迭代設計 | Gemini 2.5 Flash | 1K | 快速反饋 |
| 最終作品 | Gemini 3 Pro | 2K/4K | 高品質，細節豐富 |
| 打印用途 | Gemini 3 Pro | 4K | 最高解析度 |

## 🐛 常見問題

### Q: Cursor 無法識別 skills？

**A**: 確保：
1. `skills/` 目錄在專案根目錄
2. 每個 skill 都有 `SKILL.md` 文件
3. `SKILL.md` 文件包含正確的 frontmatter（name, description）

### Q: 如何確認 skills 已載入？

**A**: 在 Cursor 中，當您提到相關任務時，AI 應該會自動使用對應的 skill。您也可以直接問：
```
"列出可用的 Doufang skills"
```

### Q: 生成的圖片留白太多？

**A**: 使用 `optimize-doufang-prompt` skill：
```
"優化這個 prompt，減少留白，讓 Doufang 佔據 85-95% 的畫面"
```

### Q: Flash 模型不支持 2K/4K？

**A**: 正確。Flash 模型僅支持 1K (1024×1024)。如需更高解析度，請使用 Gemini 3 Pro 模型。

### Q: Pro 模型需要付費？

**A**: 是的，Gemini 3 Pro 需要已啟用帳單的 API Key。如果您的 API Key 未啟用帳單，請使用 Gemini 2.5 Flash 模型。

### Q: 如何添加參考圖片？

**A**: 在對話中提及參考圖片：
```
"使用這個 prompt 生成圖片，參考這張圖片 [上傳圖片]"
```

或使用文件路徑：
```
"使用這個 prompt 生成圖片，參考圖片路徑: ./images/reference.png"
```

## 📖 更多資源

- **專案主頁**: https://github.com/poirotw66/Square_Couplets_Master
- **npm 包**: https://www.npmjs.com/package/@justin_666/square-couplets-master-skills
- **問題回報**: https://github.com/poirotw66/Square_Couplets_Master/issues

## 📝 Skills 文件結構

```
skills/
├── README.md                          # 本文件
├── generate-doufang-prompt/
│   └── SKILL.md                       # 生成提示詞 skill
├── generate-doufang-image/
│   └── SKILL.md                       # 生成圖片 skill
└── optimize-doufang-prompt/
    └── SKILL.md                       # 優化提示詞 skill
```

每個 `SKILL.md` 文件包含：
- **Frontmatter**: name, description
- **Instructions**: 詳細的使用說明
- **Examples**: 使用示例
- **Parameters**: 參數說明

## 🎓 學習資源

### 了解 Claude Agent Skills

Claude Agent Skills 是一個協定，允許 AI IDE（如 Cursor）載入和使用預定義的技能。每個 skill 是一個 Markdown 文件，包含：
- 技能名稱和描述
- 使用說明
- 示例和參數

### 最佳實踐

1. **明確描述需求**：清楚地說明您想要什麼
2. **逐步執行**：對於複雜任務，分步驟執行
3. **提供上下文**：如果使用參考圖片，明確說明
4. **檢查輸出**：生成後檢查結果，必要時優化

## 🤝 貢獻

歡迎提交問題和改進建議！如果您想：
- 報告 bug
- 請求新功能
- 改進文檔
- 提交 Pull Request

請前往 [GitHub Issues](https://github.com/poirotw66/Square_Couplets_Master/issues)

---

**授權**: CC BY-NC-SA 4.0 (Creative Commons Attribution-NonCommercial-ShareAlike 4.0)

**作者**: Justin

**最後更新**: 2026-01-19
