# 打字練習網 (Vue 3 Typing Practice)

一個使用 Vue 3 開發的打字練習網站，支援難度分級、統計記錄、資料持久化和排行榜功能。

## 功能特點

- 📚 **難度分級題目** - 簡單、普通、困難三種難度，內建豐富詞庫
- 📊 **統計與紀錄** - 實時顯示 WPM（每分鐘字數）、準確率等數據
- 💾 **資料持久化** - 使用 localStorage 本地儲存所有統計和排行榜數據
- 🏆 **排行榜功能** - 按難度分組顯示本地排行榜
- 🎨 **現代簡約 UI** - 使用 Tailwind CSS 打造的美觀介面

## 技術棧

- **Vue 3** - 使用 Composition API 和 `<script setup>` 語法
- **Vite** - 預設構建工具
- **Pinia** - 狀態管理
- **Tailwind CSS** - 樣式框架
- **LocalStorage** - 資料持久化

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

### 建構生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 專案結構

```
vue-typing-qlm/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.js              # 應用入口
│   ├── App.vue              # 根組件
│   ├── components/
│   │   ├── TypingBox.vue    # 打字輸入區
│   │   ├── StatsPanel.vue   # 統計面板
│   │   ├── DifficultySelector.vue  # 難度選擇器
│   │   └── Leaderboard.vue  # 排行榜
│   ├── composables/
│   │   └── typingStore.js   # Pinia 狀態管理
│   ├── data/
│   │   └── wordLibraries.js # 難度分級詞庫
│   └── styles/
│       └── main.css         # 全局樣式
```

## 使用說明

1. **選擇難度** - 從簡單、普通、困難三種難度中選擇一種
2. **開始打字** - 點擊輸入框或按 `Enter` 鍵開始
3. **查看統計** - 右側面板顯示即時 WPM 和準確率
4. **完成挑戰** - 打完所有文字後自動結束，顯示最終成績
5. **查看排行** - 底部排行榜顯示歷史最佳成績

## 預設鍵盤快捷鍵

- `Enter` - 開始打字
- `Ctrl + Enter` - 快速開始打字
- `Backspace` - 刪除字符（打字過程中）

## 設計理念

- 專注於提升打字技巧
- 簡潔直觀的使用體驗
- 即時反饋和數據分析
- 本地數據儲存，隱私安全

## License

MIT