/**
 * 示例：使用 Gemini 3 Pro 生成 2K 解析度的財富主題春聯斗方
 * 
 * 使用方法：
 * 1. 確保已在 .env.local 中設置 GEMINI_API_KEY
 * 2. 運行：npx tsx examples/generate-wealth-doufang.ts
 */

import { generateDoufangPrompt, generateDoufangImage } from '../services/geminiService';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 讀取 .env.local 文件
function loadEnvLocal() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envPath = path.join(__dirname, '../.env.local');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      }
    }
  }
}

async function generateWealthDoufang2K() {
  try {
    // 載入 .env.local
    loadEnvLocal();
    
    // 從環境變數獲取 API Key
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
      console.error('❌ 錯誤：請設置 GEMINI_API_KEY 環境變數');
      console.log('💡 提示：export GEMINI_API_KEY="your-api-key"');
      process.exit(1);
    }

    console.log('🎨 開始生成財富主題的春聯斗方...\n');

    // Step 1: 生成 Prompt
    console.log('📝 Step 1: 生成 Doufang Prompt...');
    const keyword = '財富';
    const promptData = await generateDoufangPrompt(keyword, apiKey);
    
    console.log('✅ 祝福語：', promptData.blessingPhrase);
    console.log('✅ Prompt 生成完成\n');

    // Step 2: 生成圖片（Gemini 3 Pro, 2K 解析度）
    console.log('🖼️  Step 2: 使用 Gemini 3 Pro 生成 2K 解析度圖片...');
    console.log('   模型：gemini-3-pro-image-preview');
    console.log('   解析度：2K (2048×2048)');
    console.log('   這可能需要一些時間，請稍候...\n');

    const imageBase64 = await generateDoufangImage(
      promptData.imagePrompt,
      apiKey,
      'gemini-3-pro-image-preview', // 使用 Pro 模型
      '2K',                          // 2K 解析度
      null                           // 無參考圖片
    );

    // Step 3: 保存圖片
    console.log('💾 Step 3: 保存圖片...');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 從 base64 提取圖片數據
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const filename = `doufang-${promptData.blessingPhrase}-2K-${Date.now()}.png`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    
    console.log('✅ 圖片已保存：', filepath);
    console.log('✅ 文件大小：', (buffer.length / 1024 / 1024).toFixed(2), 'MB');
    console.log('\n🎉 生成完成！');

    // 顯示提示詞摘要
    console.log('\n📋 使用的 Prompt 摘要：');
    console.log('─'.repeat(60));
    console.log(promptData.imagePrompt.substring(0, 200) + '...');
    console.log('─'.repeat(60));

  } catch (error: any) {
    console.error('\n❌ 發生錯誤：');
    
    if (error.message?.includes('API Key')) {
      console.error('   請檢查您的 API Key 是否正確設置');
      console.error('   提示：export GEMINI_API_KEY="your-api-key"');
    } else if (error.message?.includes('billing') || error.message?.includes('BILLING_REQUIRED')) {
      console.error('   Gemini 3 Pro 需要付費 API Key（已啟用帳單）');
      console.error('   請切換到 Flash 模型或啟用帳單');
    } else if (error.message?.includes('2K') || error.message?.includes('resolution')) {
      console.error('   2K 解析度可能不被支援');
      console.error('   請嘗試使用 1K 解析度');
    } else {
      console.error('   錯誤詳情：', error.message);
    }
    
    process.exit(1);
  }
}

// 執行
generateWealthDoufang2K();
