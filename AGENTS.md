# AGENTS.md — 暖心廚房日誌（Cozy Kitchen Journal）食譜收藏網站開發規範

本文件是「**暖心廚房日誌｜個人食譜收藏網站**」的核心開發與內容擴充指南。任何協助本專案的 AI 代理（AI Agent）或開發者在新增食譜、修改網頁樣式或調整架構時，**必須嚴格遵守本文件定義的所有規則**，確保網站能以一致的品質持續擴充。

---

## 1. 專案目的與定位

- **專案名稱**：暖心廚房日誌（Cozy Kitchen Journal）
- **核心目的**：建立一個簡潔、溫暖、易於在手機與電腦閱讀的個人食譜收藏網站，並可透過純靜態網頁（GitHub Pages）直接部署與分享。
- **設計哲學（規則驅動擴充）**：
  - **資料與版面分離**：所有食譜內容皆以標準化的 Markdown 檔案存放在 `recipes/` 目錄中，並由 `recipes/manifest.json` 統一註冊。新增食譜時**不需要改動任何 HTML/CSS 程式碼**。
  - **開箱即用、零後端依賴**：採用純原生 HTML、CSS 與 JavaScript（Vanilla JS）開發，無需資料庫或建置工具（Build Step），上傳至 GitHub Pages 即可直接運作。
  - **廚房友善閱讀體驗**：支援食材份數換算、購物清單勾選（Checklist）、烹飪時間與難度篩選，方便實際下廚時對照操作。

---

## 2. 網頁整體風格與視覺設計規範

- **風格定位**：日系雜誌感「暖心居家廚房（Warm Editorial Kitchen）」風格。
- **色彩系統（Color Palette）**：
  - 背景主色（Cream Paper）：`#FAF7F2`（溫潤米白，降低螢幕強光刺眼感）
  - 卡片底色（Pure Warm White）：`#FFFFFF`
  - 主強調色（Terracotta 陶土橘）：`#C85A32`（用於重點按鈕、分類標籤、步驟編號）
  - 輔助自然色（Sage Herb 鼠尾草綠）：`#4A6B5D`（用於時間標示、完成狀態、小撇步提示框）
  - 主要文字色（Espresso Charcoal）：`#2C2520`
  - 次要文字色（Warm Gray）：`#6E655F`
  - 邊框線條色（Soft Sand）：`#E8E0D5`
- **字體規範**：
  - 繁體中文優先使用 `Noto Sans TC`、`PingFang TC`、`Microsoft JhengHei`，搭配英數襯線體 `Georgia` 或無襯線 `Inter`，確保食材份量數字清晰易讀。
- **響應式設計（RWD）**：
  - 桌面版（> 768px）：食譜詳情頁採用「左側食材清單（固定欄）＋ 右側烹飪步驟」雙欄排版；首頁採用 3 欄卡片網格。
  - 手機版（≤ 768px）：自動堆疊為單欄排版，方便單手滑動查看步驟。

---

## 3. 資料夾結構與檔案命名規則

```text
recipe-collection/
├── AGENTS.md                 # 【核心規範】給 AI 閱讀的專案規則與擴充手冊（本文件）
├── README.md                 # 專案介紹、本機預覽與 GitHub Pages 部署教學
├── index.html                # 網站主頁面（包含食譜列表瀏覽與單篇食譜閱讀視圖）
├── assets/
│   ├── css/
│   │   └── style.css         # 全站視覺樣式與響應式排版定義
│   ├── js/
│   │   └── app.js            # 食譜載入、搜尋篩選、Markdown 解析與互動功能
│   └── images/               # 選用：存放自訂食譜照片（建議使用 .jpg 或 .webp）
└── recipes/                  # 【食譜資料庫】所有食譜檔案集中存放處
    ├── manifest.json         # 食譜總目錄清單（新增食譜時必須同步更新此檔）
    ├── tomato-scrambled-eggs.md
    ├── japanese-curry-rice.md
    ├── garlic-butter-shrimp-pasta.md
    └── matcha-basque-cheesecake.md
```

### 檔案命名規則（必須嚴格遵守）
- **食譜檔名**：一律使用**小寫英文、單字間以連字號 `-` 分隔（kebab-case）**，副檔名為 `.md`。
  - 正確範例：`braised-pork-rice.md`、`lemon-honey-chicken.md`
  - 錯誤範例：`滷肉飯.md`、`Braised Pork Rice.md`、`recipe_01.md`
- **分類代碼（Category Keys）**：目前網站支援以下 5 種標準分類（寫入 `manifest.json` 與 Frontmatter 時請使用中文標準名稱）：
  - `家常快手菜`
  - `異國主食`
  - `暖胃湯品`
  - `甜點烘焙`
  - `飲品輕食`

---

## 4. 新增食譜時的標準格式規範

每新增一道食譜，**必須同時完成兩件事**：
1. 在 `recipes/` 下建立 `<slug>.md` 檔案。
2. 在 `recipes/manifest.json` 陣列中新增該食譜的註冊資訊。

### 4.1 食譜 Markdown 檔案模板（`recipes/<slug>.md`）

每份食譜 `.md` 檔案**必須包含 YAML Frontmatter 與以下 4 個標準 `##` 章節**：

```markdown
---
title: "食譜中文名稱"
subtitle: "一句話吸引人的料理特色描述"
slug: "kebab-case-slug"
category: "家常快手菜 | 異國主食 | 暖胃湯品 | 甜點烘焙 | 飲品輕食"
prepTime: "10 分鐘"
cookTime: "15 分鐘"
servings: 2
difficulty: "簡單 | 中等 | 進階"
tags: ["標籤1", "標籤2", "標籤3"]
emoji: "🍳"
created: "YYYY-MM-DD"
---

## 料理簡介
用 2～3 句話介紹這道料理的風味特色、適合享用的時機，以及為什麼值得收藏。

## 準備食材
- 主食材名稱：份量與單位（例如：雞蛋 4 顆）
- 副食材名稱：份量與單位（例如：牛番茄 2 顆）
- 調味料名稱：份量與單位（例如：鹽 1/2 小匙）

## 製作步驟
1. **步驟標題（如：備料處理）**：詳細說明刀工、火候、時間與狀態判斷（例如：炒至表面微焦、香氣釋出）。
2. **步驟標題（如：下鍋烹調）**：清楚描述操作順序與注意事項。
3. **步驟標題（如：調味起鍋）**：說明最後收汁、擺盤與點綴方式。

## 主廚小撇步
- 提供 2～3 點能大幅提升成功率的關鍵技巧（例如火候控制、食材替代方案或保存方式）。
```

### 4.2 `recipes/manifest.json` 註冊格式

每次新增或刪除食譜時，必須同步更新 `recipes/manifest.json`，確保網頁首頁能正確顯示卡片與篩選分類：

```json
{
  "slug": "tomato-scrambled-eggs",
  "title": "經典滑嫩番茄炒蛋",
  "subtitle": "酸甜多汁、蛋香濃郁的國民家常零失敗料理",
  "category": "家常快手菜",
  "prepTime": "10 分鐘",
  "cookTime": "8 分鐘",
  "servings": 2,
  "difficulty": "簡單",
  "tags": ["家常菜", "15分鐘上菜", "高蛋白"],
  "emoji": "🍅",
  "created": "2026-11-15"
}
```

---

## 5. AI 新增或修改內容時必須遵守的規則

當使用者請 AI 新增食譜、修改現有食譜或擴充網站功能時，AI 必須按以下流程執行：

1. **先讀規範與現有清單**：先檢查 `AGENTS.md` 與 `recipes/manifest.json`，確認該食譜是否已經存在（避免重複建立相同料理）。
2. **嚴格遵守格式與用量清晰度**：
   - 使用**繁體中文（台灣慣用烹飪單位，如：大匙、小匙、克、ml、顆、瓣）**撰寫。
   - 食材清單**禁止只寫「適量」而不給參考範圍**（若為個人口味調整，請寫「鹽 1/2 小匙（可依口味微調）」）。
   - 步驟描述必須具體，包含**火候大小（大火／中火／小火）**與**視覺／時間判斷標準**。
3. **雙向同步原則**：
   - 建立 `recipes/<slug>.md` 後，**必須同步將該食譜的 Metadata 加入 `recipes/manifest.json`**，兩者的 `slug`、`title`、`category`、`servings` 等欄位必須完全一致。
4. **保持靜態相容性**：
   - 網頁前端不得引入需要 Node.js 編譯（如 Webpack、Vite 私有語法）或付費外部 API 的程式碼，確保使用者只要將檔案推上 GitHub Pages 就能立即瀏覽。
