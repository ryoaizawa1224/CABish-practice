# CABish Practice — CAB形式Webテスト練習ツール

CAB（Computer Aptitude Battery）形式の就活Webテストを、本番に近い環境で練習できるデスクトップアプリです。

---

## ダウンロード

👉 **[最新版をダウンロードする（Releases）](https://github.com/ryoaizawa1224/CABish-practice/releases/latest)**

| OS | ファイル |
|----|---------|
| Mac（M1 / M2 / M3） | `CAB.-x.x.x-arm64.dmg` |
| Mac（Intel） | `CAB.-x.x.x.dmg` |
| Windows | `CAB.Setup.x.x.x.exe` |

### Macでのインストール手順
1. `.dmg` ファイルを開く
2. アプリをApplicationsフォルダにドラッグ
3. 初回起動時に「開発元が未確認」と出たら → **システム設定 → プライバシーとセキュリティ → 「このまま開く」**

### Windowsでのインストール手順
1. `.exe` ファイルを実行
2. 「WindowsによってPCが保護されました」と出たら → **「詳細情報」→「実行」**

---

## 収録テスト

| テスト | 問題数 | 制限時間 | 内容 |
|--------|--------|----------|------|
| **四則逆算** | 50問 | 10分 | `□ + 3 = 7` のような穴埋め計算 |
| **法則性** | 30問 | 10分 | 数列のパターンを見つけて次の数を答える |
| **命令表** | 20問 | 10分 | 記号の命令を順に適用して最終値を求める |
| **暗号** | 20問 | 10分 | 記号と文字の対応表から4択で解読する |

- 問題は**毎回ランダム生成**されます
- タイマー・進捗バー・終了後の結果・間違い一覧あり

---

## スクリーンショット

> *(近日追加予定)*

---

## 開発者向け：ローカルで動かす

```bash
# リポジトリをクローン
git clone https://github.com/ryoaizawa1224/CABish-practice.git
cd CABish-practice

# 依存パッケージをインストール
npm install

# デスクトップアプリとして起動（ビルド込み）
npm run electron
```

### 新しいリリースを出す方法

```bash
git tag v1.x.x
git push origin v1.x.x
```

タグをpushするとGitHub Actionsが自動でMac・Windows向けのビルドを作成し、Releasesに公開します。

---

## 技術スタック

- [Next.js](https://nextjs.org/) + TypeScript（UI）
- [Tailwind CSS](https://tailwindcss.com/)（スタイリング）
- [Electron](https://www.electronjs.org/)（デスクトップアプリ化）
- GitHub Actions（自動ビルド・リリース）
