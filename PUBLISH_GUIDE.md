# 📦 發布指南

## 發布新版本步驟

### 1. 重新登錄 npm（如果 token 過期）

```bash
npm login
```

或使用 token 登錄：

```bash
npm login --auth-type=legacy
```

### 2. 驗證登錄狀態

```bash
npm whoami
```

應該顯示您的 npm 用戶名（例如：`justin_666`）

### 3. 發布包

```bash
npm publish --access public
```

## 當前版本

- **版本號**: 1.0.2
- **包名**: @justin_666/square-couplets-master-skills

## 新功能

- ✅ 添加了 `doufang init` CLI 命令
- ✅ 支持 Cursor / Windsurf / Antigravity / Claude Code
- ✅ 自動創建配置文件
- ✅ Slash command 支持 (`/doufang`)

## 發布內容

發布的包包含：
- `bin/doufang-init.js` - 初始化工具
- `bin/doufang-skills.js` - Skills 管理工具
- `skills/` - 三個技能文件
- `README.md` - 文檔
- `LICENSE` - 授權文件

## 如果遇到錯誤

### 401 Unauthorized
- Token 已過期，需要重新登錄
- 執行 `npm login` 重新認證

### 404 Not Found
- 檢查包名是否正確
- 確保 token 有發布 scoped package 的權限
- 如果是第一次發布，確保 npm 帳號已啟用 2FA（對於 scoped packages）

### 403 Forbidden
- 需要啟用 2FA（Two-Factor Authentication）
- 或使用具有 2FA bypass 權限的 granular access token
