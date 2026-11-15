# 暖心廚房日誌（Cozy Kitchen Journal）｜個人食譜收藏網站

> 本專案以 **規則驅動開發（Rule-Driven Development）** 理念建置，透過 `AGENTS.md` 定義清晰的資料格式與架構規範，讓 AI 能持續依照同一套標準新增食譜頁面並自動呈現於網頁上。

---

## 一、專案結構說明

```text
recipe-collection/
├── AGENTS.md                 # 【核心規範】給 AI 閱讀的專案開發與新增食譜規則
├── README.md                 # 專案說明與 GitHub Pages 部署教學
├── index.html                # 網站主頁（支援卡片瀏覽、分類篩選、搜尋與單篇食譜閱讀）
├── assets/
│   ├── css/style.css         # 暖心日系雜誌風格樣式表（支援手機與電腦 RWD）
│   ├── js/app.js             # 食譜載入、Markdown 解析與備料勾選互動腳本
│   └── images/               # 圖片存放目錄
└── recipes/                  # 食譜 Markdown 資料庫
    ├── manifest.json         # 食譜目錄清單
    ├── tomato-scrambled-eggs.md
    ├── japanese-curry-rice.md
    ├── garlic-butter-shrimp-pasta.md
    └── matcha-basque-cheesecake.md
```

---

## 二、如何在自己電腦上預覽網頁？

由於網頁會透過 `fetch()` 讀取 `recipes/manifest.json` 與 `.md` 食譜檔，請使用簡易本機伺服器開啟（直接雙擊 `index.html` 會受瀏覽器安全限制阻擋）：

- **方法 A（使用 VS Code）**：安裝 **Live Server** 擴充套件，對 `index.html` 按右鍵選擇 **Open with Live Server**。
- **方法 B（使用終端機 Python）**：在專案根目錄執行：
  ```bash
  python3 -m http.server 8000
  ```
  接著打開瀏覽器前往 `http://localhost:8000` 即可瀏覽。

---

## 三、如何上傳至 GitHub 並開啟 GitHub Pages 公開網站？

1. **建立 GitHub Repository**：
   登入 GitHub，點擊右上角 `+` → **New repository**，輸入專案名稱（例如 `my-recipe-book`），選擇 **Public**，點擊 **Create repository**。
2. **上傳專案檔案**：
   - **網頁直接上傳（最簡單）**：在新的 Repository 頁面點擊 **uploading an existing file**，將解壓縮後資料夾內的**所有檔案與資料夾**（`AGENTS.md`、`index.html`、`assets/`、`recipes/`、`README.md`）拖曳進去，點擊 **Commit changes**。
   - **或使用 Git 指令上傳**：
     ```bash
     git init
     git add .
     git commit -m "feat: initialize recipe collection website with AGENTS.md"
     git branch -M main
     git remote add origin https://github.com/你的帳號/my-recipe-book.git
     git push -u origin main
     ```
3. **開啟 GitHub Pages**：
   - 進入該 Repository 的 **Settings**（設定）→ 左側選單點選 **Pages**。
   - 在 **Build and deployment** 下的 **Source** 選擇 `Deploy from a branch`。
   - **Branch** 選擇 `main`、資料夾選擇 `/ (root)`，點擊 **Save**。
   - 等待約 1～2 分鐘重新整理頁面，上方就會出現你的公開網站網址（例如 `https://你的帳號.github.io/my-recipe-book/`）！

---

## 四、如何叫 AI 幫你繼續新增食譜？

以後你想新增任何新食譜時，只要把 `AGENTS.md` 與 `recipes/manifest.json` 貼給 AI（或在 Cursor / Claude Code 中開啟專案），然後對 AI 說：

> 「請嚴格遵守 `AGENTS.md` 的格式與規則，幫我新增一道『泰式打拋豬』的食譜，輸出 `recipes/thai-basil-pork.md` 的完整內容，以及更新後的 `recipes/manifest.json`。」

將 AI 產出的兩個檔案放進 `recipes/` 資料夾，網站首頁就會自動出現這道新食譜卡片！
