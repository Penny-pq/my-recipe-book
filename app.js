/**
 * 暖心廚房日誌 (Cozy Kitchen Journal) 前端互動引擎
 * 功能：
 * 1. 讀取 recipes/manifest.json 建立食譜卡片總覽
 * 2. 支援分類篩選與關鍵字即時搜尋
 * 3. 點擊卡片時動態讀取對應的 recipes/<slug>.md 並解析渲染成廚房友善雙欄版面
 */

let allRecipes = [];
let activeCategory = "全部";
let searchQuery = "";

const listView = document.getElementById("list-view");
const detailView = document.getElementById("detail-view");
const recipeGrid = document.getElementById("recipe-grid");
const emptyState = document.getElementById("empty-state");
const recipeCounter = document.getElementById("recipe-counter");
const searchInput = document.getElementById("search-input");
const categoryTabs = document.getElementById("category-tabs");
const backToListBtn = document.getElementById("back-to-list");
const brandHomeBtn = document.getElementById("brand-home");
const recipeArticle = document.getElementById("recipe-article");

// 初始化載入食譜清單
async function init() {
  try {
    const res = await fetch("recipes/manifest.json");
    if (!res.ok) throw new Error("無法讀取 recipes/manifest.json");
    allRecipes = await res.json();
    recipeCounter.textContent = `已收錄 ${allRecipes.length} 道食譜`;
    renderRecipeGrid();
    handleHashRouting();
  } catch (err) {
    recipeGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p class="empty-emoji">⚠️</p>
        <h3>載入食譜資料失敗</h3>
        <p>請確認你是透過本機伺服器（如 VS Code Live Server / Python http.server）或 GitHub Pages 開啟網頁，而非直接雙擊本地檔案。</p>
      </div>
    `;
    console.error(err);
  }
}

// 渲染首頁食譜卡片網格
function renderRecipeGrid() {
  const filtered = allRecipes.filter((item) => {
    const matchCategory = activeCategory === "全部" || item.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));
    return matchCategory && matchSearch;
  });

  recipeGrid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  filtered.forEach((recipe) => {
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.innerHTML = `
      <div>
        <div class="card-top">
          <div class="card-emoji">${recipe.emoji || "🍽️"}</div>
          <span class="card-category">${escapeHtml(recipe.category)}</span>
        </div>
        <h2 class="card-title">${escapeHtml(recipe.title)}</h2>
        <p class="card-subtitle">${escapeHtml(recipe.subtitle)}</p>
      </div>
      <div>
        <div class="card-meta">
          <span>⏱ 備料 ${escapeHtml(recipe.prepTime)}</span>
          <span>🔥 烹調 ${escapeHtml(recipe.cookTime)}</span>
          <span>👥 ${recipe.servings} 人份</span>
        </div>
        <div class="card-tags">
          ${(recipe.tags || []).map((t) => `<span class="tag-pill">#${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.hash = `#/recipe/${recipe.slug}`;
    });
    recipeGrid.appendChild(card);
  });
}

// 解析食譜 Markdown 並渲染詳情頁
async function openRecipeDetail(slug) {
  const meta = allRecipes.find((r) => r.slug === slug);
  if (!meta) {
    showListView();
    return;
  }

  listView.classList.add("hidden");
  detailView.classList.remove("hidden");
  recipeArticle.innerHTML = `<p style="text-align:center;padding:40px;">正在載入食譜內容...</p>`;
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    const res = await fetch(`recipes/${slug}.md`);
    if (!res.ok) throw new Error(`找不到 recipes/${slug}.md`);
    const rawMd = await res.text();
    const parsed = parseRecipeMarkdown(rawMd);

    recipeArticle.innerHTML = `
      <header class="article-hero">
        <div class="article-hero-top">
          <div class="article-emoji">${meta.emoji || "🍽️"}</div>
          <div>
            <span class="card-category">${escapeHtml(meta.category)}</span>
            <h1 class="article-title">${escapeHtml(meta.title)}</h1>
            <p class="article-subtitle">${escapeHtml(meta.subtitle)}</p>
          </div>
        </div>
        <div class="article-stats">
          <span class="stat-badge">⏱ 備料時間：${escapeHtml(meta.prepTime)}</span>
          <span class="stat-badge">🔥 烹調時間：${escapeHtml(meta.cookTime)}</span>
          <span class="stat-badge">👥 份量：${meta.servings} 人份</span>
          <span class="stat-badge">📊 難度：${escapeHtml(meta.difficulty)}</span>
        </div>
      </header>

      ${parsed.intro ? `<div class="article-intro">${formatInlineBold(parsed.intro)}</div>` : ""}

      <div class="kitchen-layout">
        <aside class="ingredients-panel">
          <h2 class="panel-heading">🧺 準備食材（可勾選備料）</h2>
          <ul class="ingredient-list">
            ${parsed.ingredients
              .map(
                (ing, idx) => `
              <li class="ingredient-item">
                <label>
                  <input type="checkbox" id="ing-${idx}" />
                  <span>${formatInlineBold(ing)}</span>
                </label>
              </li>
            `
              )
              .join("")}
          </ul>
        </aside>

        <section class="steps-panel">
          <h2 class="panel-heading">👩‍🍳 製作步驟</h2>
          <ol class="steps-list">
            ${parsed.steps
              .map(
                (step, idx) => `
              <li class="step-item">
                <span class="step-num">${idx + 1}</span>
                <div class="step-text">${formatInlineBold(step)}</div>
              </li>
            `
              )
              .join("")}
          </ol>
        </section>
      </div>

      ${
        parsed.tips.length > 0
          ? `
        <aside class="chef-tips">
          <h3>💡 主廚小撇步</h3>
          <ul>
            ${parsed.tips.map((tip) => `<li>${formatInlineBold(tip)}</li>`).join("")}
          </ul>
        </aside>
      `
          : ""
      }
    `;
  } catch (err) {
    recipeArticle.innerHTML = `<p>載入食譜內容時發生錯誤：${escapeHtml(err.message)}</p>`;
  }
}

// 依據 AGENTS.md 定義的標準 Markdown 結構解析食譜
function parseRecipeMarkdown(mdText) {
  // 移除 YAML Frontmatter
  const body = mdText.replace(/^---[\s\S]*?---\s*/, "");
  const sections = body.split(/^##\s+/m);

  let intro = "";
  const ingredients = [];
  const steps = [];
  const tips = [];

  sections.forEach((sec) => {
    const lines = sec.trim().split("\n");
    const heading = lines[0].trim();
    const contentLines = lines.slice(1).map((l) => l.trim()).filter(Boolean);

    if (heading === "料理簡介") {
      intro = contentLines.join(" ");
    } else if (heading === "準備食材") {
      contentLines.forEach((line) => {
        if (line.startsWith("- ")) {
          ingredients.push(line.slice(2).trim());
        }
      });
    } else if (heading === "製作步驟") {
      contentLines.forEach((line) => {
        const match = line.match(/^\d+\.\s+(.*)$/);
        if (match) {
          steps.push(match[1].trim());
        }
      });
    } else if (heading === "主廚小撇步") {
      contentLines.forEach((line) => {
        if (line.startsWith("- ")) {
          tips.push(line.slice(2).trim());
        }
      });
    }
  });

  return { intro, ingredients, steps, tips };
}

function showListView() {
  detailView.classList.add("hidden");
  listView.classList.remove("hidden");
}

function handleHashRouting() {
  const hash = window.location.hash;
  if (hash.startsWith("#/recipe/")) {
    const slug = hash.replace("#/recipe/", "").trim();
    openRecipeDetail(slug);
  } else {
    showListView();
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInlineBold(str) {
  return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// 事件監聽
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderRecipeGrid();
});

categoryTabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeCategory = btn.dataset.category;
  renderRecipeGrid();
});

backToListBtn.addEventListener("click", () => {
  window.location.hash = "#/";
});

brandHomeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.hash = "#/";
});

window.addEventListener("hashchange", handleHashRouting);

init();
