#!/bin/bash

echo "🔍 NPM 認證狀態檢查"
echo "===================="
echo ""

# 檢查是否已登入
echo "1. 檢查登入狀態："
if npm whoami > /dev/null 2>&1; then
    echo "   ✅ 已登入為: $(npm whoami)"
else
    echo "   ❌ 未登入"
    echo "   請執行: npm login"
    exit 1
fi

echo ""
echo "2. 檢查認證配置："
REGISTRY=$(npm config get registry)
echo "   Registry: $REGISTRY"

echo ""
echo "3. 檢查 2FA 狀態："
echo "   ⚠️  無法通過 CLI 直接檢查 2FA 狀態"
echo "   請前往以下網址確認："
echo "   https://www.npmjs.com/settings/$(npm whoami)/two-factor-auth"
echo ""

echo "4. 測試發布權限："
echo "   執行預覽發布..."
if npm pack --dry-run > /dev/null 2>&1; then
    echo "   ✅ 打包預覽成功"
else
    echo "   ❌ 打包預覽失敗"
fi

echo ""
echo "📋 下一步操作："
echo ""
echo "如果遇到 403 錯誤，請執行以下步驟："
echo ""
echo "1. 啟用 2FA（必須選擇 'Authorization and Publishing'）："
echo "   https://www.npmjs.com/settings/$(npm whoami)/two-factor-auth"
echo ""
echo "2. 重新登入："
echo "   npm logout"
echo "   npm login"
echo ""
echo "3. 重新發布："
echo "   npm publish --access public"
echo ""
