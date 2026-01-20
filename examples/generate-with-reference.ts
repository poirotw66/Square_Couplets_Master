/**
 * 示例：使用參考圖片生成春聯斗方
 * 
 * 使用方法：
 * 1. 設置 API Key（支援多種方式）：
 *    - 在專案根目錄創建 .env 或 .env.local 文件：GEMINI_API_KEY="your-api-key"
 *    - 或使用環境變數：export GEMINI_API_KEY="your-api-key"
 * 2. 運行：npx tsx examples/generate-with-reference.ts <keyword> <image-path>
 * 
 * 示例：
 * npx tsx examples/generate-with-reference.ts "龍馬精神" images/gemini2-5-萬馬奔騰.png
 * 
 * 支援的環境變數名稱：
 * - GEMINI_API_KEY（優先）
 * - API_KEY
 * - GOOGLE_GENAI_API_KEY
 */

import { generateDoufangPrompt, generateDoufangImage } from '../services/geminiService';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// 讀取圖片並轉換為 base64
async function loadImageAsDataUrl(imagePath: string): Promise<string> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const fullPath = path.isAbsolute(imagePath) 
    ? imagePath 
    : path.join(__dirname, '..', imagePath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`圖片文件不存在: ${fullPath}`);
  }
  
  // 讀取文件並轉換為 base64
  const fileBuffer = fs.readFileSync(fullPath);
  const base64 = fileBuffer.toString('base64');
  
  // 判斷文件類型
  const ext = path.extname(fullPath).toLowerCase();
  let mimeType = 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') {
    mimeType = 'image/jpeg';
  } else if (ext === '.png') {
    mimeType = 'image/png';
  }
  
  // 返回 data URL（如果需要壓縮，可以在這裡添加壓縮邏輯）
  // 對於 Node.js 環境，我們直接返回 base64，壓縮會在瀏覽器環境中處理
  return `data:${mimeType};base64,${base64}`;
}

async function generateWithReference() {
  try {
    // 載入環境變數（優先順序：.env.local > .env）
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const projectRoot = path.join(__dirname, '..');
    
    // 先嘗試載入 .env.local（如果存在）
    const envLocalPath = path.join(projectRoot, '.env.local');
    if (fs.existsSync(envLocalPath)) {
      config({ path: envLocalPath });
    }
    
    // 再載入 .env（如果存在）
    const envPath = path.join(projectRoot, '.env');
    if (fs.existsSync(envPath)) {
      config({ path: envPath });
    }
    
    // 獲取參數
    const keyword = process.argv[2] || '龍馬精神';
    const imagePath = process.argv[3] || 'images/gemini2-5-萬馬奔騰.png';
    
    // 從環境變數獲取 API Key（支援多種變數名稱）
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ 錯誤：請設置 GEMINI_API_KEY 環境變數');
      console.log('💡 提示：');
      console.log('   1. 在 .env 或 .env.local 文件中設置：GEMINI_API_KEY="your-api-key"');
      console.log('   2. 或使用環境變數：export GEMINI_API_KEY="your-api-key"');
      process.exit(1);
    }

    console.log('🎨 開始使用參考圖片生成春聯斗方...\n');
    console.log('📋 參數：');
    console.log('   關鍵字：', keyword);
    console.log('   參考圖片：', imagePath);
    console.log('   模型：Gemini 3 Pro');
    console.log('   解析度：2K\n');

    // Step 1: 載入參考圖片
    console.log('🖼️  Step 1: 載入並處理參考圖片...');
    const referenceImageDataUrl = await loadImageAsDataUrl(imagePath);
    console.log('✅ 參考圖片已載入並壓縮\n');

    // Step 2: 生成 Prompt（帶參考圖片）
    console.log('📝 Step 2: 生成 Doufang Prompt（分析參考圖片風格）...');
    const promptData = await generateDoufangPrompt(keyword, apiKey, referenceImageDataUrl);
    
    console.log('✅ 祝福語：', promptData.blessingPhrase);
    console.log('✅ Prompt 生成完成（已融入參考圖片風格）\n');

    // Step 3: 生成圖片（Gemini 3 Pro, 2K 解析度，帶參考圖片）
    console.log('🖼️  Step 3: 使用 Gemini 3 Pro 生成 2K 解析度圖片...');
    console.log('   模型：gemini-3-pro-image-preview');
    console.log('   解析度：2K (2048×2048)');
    console.log('   參考圖片：已包含');
    console.log('   這可能需要一些時間，請稍候...\n');

    const imageBase64 = await generateDoufangImage(
      promptData.imagePrompt,
      apiKey,
      'gemini-3-pro-image-preview', // 使用 Pro 模型
      '2K',                          // 2K 解析度
      referenceImageDataUrl           // 包含參考圖片
    );

    // Step 4: 保存圖片
    console.log('💾 Step 4: 保存圖片...');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 從 base64 提取圖片數據
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const timestamp = Date.now();
    const imageName = path.basename(imagePath, path.extname(imagePath));
    const filename = `doufang-${promptData.blessingPhrase}-ref-${imageName}-2K-${timestamp}.png`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    
    console.log('✅ 圖片已保存：', filepath);
    console.log('✅ 文件大小：', (buffer.length / 1024 / 1024).toFixed(2), 'MB');
    console.log('\n🎉 生成完成！');

    // 顯示提示詞摘要
    console.log('\n📋 使用的 Prompt 摘要：');
    console.log('─'.repeat(60));
    console.log(promptData.imagePrompt.substring(0, 300) + '...');
    console.log('─'.repeat(60));
    console.log('\n💡 提示：生成的圖片融合了參考圖片的風格特徵');

  } catch (error: any) {
    console.error('\n❌ 發生錯誤：');
    
    if (error.message?.includes('圖片文件不存在')) {
      console.error('   請檢查圖片路徑是否正確');
      console.error('   示例：npx tsx examples/generate-with-reference.ts "龍馬精神" images/gemini2-5-萬馬奔騰.png');
    } else if (error.message?.includes('API Key')) {
      console.error('   請檢查您的 API Key 是否正確設置');
      console.error('   提示：在 .env 或 .env.local 文件中設置 GEMINI_API_KEY="your-api-key"');
    } else if (error.message?.includes('billing') || error.message?.includes('BILLING_REQUIRED')) {
      console.error('   Gemini 3 Pro 需要付費 API Key（已啟用帳單）');
      console.error('   請切換到 Flash 模型或啟用帳單');
    } else {
      console.error('   錯誤詳情：', error.message);
      if (error.stack) {
        console.error('\n   堆疊追蹤：');
        console.error(error.stack);
      }
    }
    
    process.exit(1);
  }
}

// 執行
generateWithReference();
