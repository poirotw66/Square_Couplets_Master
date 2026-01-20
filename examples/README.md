# 使用示例

本目錄包含使用春聯斗方大師功能的示例腳本。

## 生成財富主題的 2K 圖片

使用 Gemini 3 Pro 生成 2K 解析度的財富主題春聯斗方。

### 前置需求

1. 已安裝依賴：`npm install`
2. 設置 API Key（支援多種方式）：
   
   **方式 1：使用 .env 文件（推薦）**
   
   在專案根目錄創建 `.env` 或 `.env.local` 文件：
   ```bash
   # .env 或 .env.local
   GEMINI_API_KEY=your-api-key-here
   ```
   
   腳本會自動讀取 `.env.local`（優先）或 `.env` 文件。
   
   **方式 2：使用環境變數**
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```
   
   **支援的環境變數名稱：**
   - `GEMINI_API_KEY`（優先）
   - `API_KEY`
   - `GOOGLE_GENAI_API_KEY`

### 運行示例

```bash
# 使用 tsx 運行（需要安裝 tsx）
npx tsx examples/generate-wealth-doufang.ts

# 或使用 ts-node
npx ts-node examples/generate-wealth-doufang.ts
```

### 輸出

生成的圖片將保存在 `output/` 目錄中，文件名格式：
```
doufang-招財進寶-2K-{timestamp}.png
```

### 注意事項

- **Gemini 3 Pro 需要付費 API Key**（已啟用帳單）
- 如果您的 API Key 未啟用帳單，請使用 Flash 模型：
  - 修改腳本中的模型為 `'gemini-2.5-flash-image'`
  - 解析度改為 `'1K'`（Flash 模型僅支援 1K）

## 使用參考圖片生成

使用參考圖片作為風格參考，生成融合參考圖片風格的春聯斗方。

### 運行示例

```bash
# 基本用法
npx tsx examples/generate-with-reference.ts "龍馬精神" images/gemini2-5-萬馬奔騰.png

# 使用不同的關鍵字和圖片
npx tsx examples/generate-with-reference.ts "財富" images/gemin3-萬馬奔騰.png
```

### 參數說明

- **第一個參數**：關鍵字或祝福語（例如："龍馬精神"、"財富"）
- **第二個參數**：參考圖片路徑（相對於專案根目錄）

### 輸出

生成的圖片將保存在 `output/` 目錄中，文件名格式：
```
doufang-{祝福語}-ref-{圖片名稱}-2K-{timestamp}.png
```

### 功能特點

- ✅ **風格融合**：AI 會分析參考圖片的風格、色彩、構圖等特徵
- ✅ **創意轉換**：將參考圖片的視覺元素轉換為春聯斗方格式
- ✅ **保持原創**：不會直接複製參考圖片，而是創造性地重新設計
- ✅ **高品質輸出**：使用 Gemini 3 Pro 生成 2K 解析度圖片

### 注意事項

- 參考圖片會被自動壓縮以符合 API 要求
- 生成的圖片會融合參考圖片的風格，但不會直接複製
- 建議使用風格明顯的參考圖片以獲得更好的效果

## 其他示例

更多示例將陸續添加...
