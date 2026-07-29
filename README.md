# SHIYO 生日戳戳樂

這是一份手機優先的互動式生日禮物網站，使用 React、Vite、TypeScript、Tailwind CSS、Framer Motion、Howler.js 與 canvas-confetti 製作，支援 PWA、iPhone Safari 與 Android Chrome。

## 本機啟動

```bash
npm install
npm run dev
```

正式建置：`npm run build`，Vite 的正式輸出目錄是 `dist`。

## 資料與素材設定

- `src/data/prizes.json`：獎品 1～50 的名稱與 ID。
- `src/data/characterBlessings.ts`：六位角色的第一輪與第二輪祝福語。
- `src/config/gameConfig.ts`：角色資料、前六個固定角色順序與圖片輪次規則。
- `src/config/imageMap.ts`：所有圖片引用與角色圖片對應。
- `src/assets/images/cards/`：專案內所有角色、生日與完成頁圖片素材。

前六個固定角色順序由 `fixedFirstRoundCharacterIds` 控制；獎品 1～12 使用人物圖片，獎品 13～50 使用動物／生日祝福圖片。遊戲分配結果會保存於 localStorage。

## GitHub 建立 Repository

1. 登入 GitHub，點擊右上角 `+` → `New repository`。
2. Repository name 輸入例如 `shiyo-birthday-gift`。
3. 選擇 Public 或 Private，按下 `Create repository`。
4. 不需要在 GitHub 先建立 README，避免與本機檔案衝突。

## 將專案推送至 GitHub

在專案根目錄執行：

```bash
git init
git add .
git commit -m "Create SHIYO birthday gift website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

請將 `YOUR_USERNAME/YOUR_REPOSITORY` 替換成你的 GitHub 帳號與 Repository 名稱。

## Vercel 部署

1. 登入 [Vercel](https://vercel.com/)。
2. 點擊 `Add New...` → `Project`。
3. 選擇 GitHub Repository，按 `Import`。
4. 設定：Framework Preset 為 `Vite`、Build Command 為 `npm run build`、Output Directory 為 `dist`、Install Command 為 `npm install`。
5. 按下 `Deploy`。
6. 部署完成後，Vercel 會提供公開 HTTPS 網址，例如 `https://shiyo-birthday-gift.vercel.app`。
7. 將網址直接貼到 LINE、Messenger 或手機瀏覽器即可開啟，不需要安裝 Node.js。

`vercel.json` 已設定 SPA rewrite，因此重新整理頁面不會出現 404。

## 更新與重新部署

修改檔案後執行：

```bash
git add .
git commit -m "Update birthday gift"
git push
```

Vercel 會偵測 GitHub 新 commit 並自動重新部署，也可以在 Vercel Project 的 `Deployments` 頁面重新部署。

## 自訂網址名稱

在 Vercel Project 開啟 `Settings` → `Domains`，輸入想使用的網域名稱。若使用自己的網域，依 Vercel 顯示的 DNS 設定新增 DNS record；Vercel 會自動配置 HTTPS 憑證。

## PWA 與遊戲進度

網站包含 manifest、favicon、Apple Touch Icon 與 Service Worker。使用者可在 iPhone Safari 的分享選單選擇「加入主畫面」。遊戲進度與角色分配保存在同一台裝置、同一個瀏覽器的 localStorage；清除網站資料或換裝置後不會共用進度。
