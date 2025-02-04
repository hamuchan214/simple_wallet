# Simple Wallet backend

Simple Wallet のバックエンド API

## 機能

- ユーザー認証（登録・ログイン）
- 収支の記録と管理
- システムタグとカスタムタグによる分類
- 期間指定による統計情報の取得

## 技術スタック

- Node.js
- TypeScript
- Express
- Prisma (SQLite)
- JWT 認証

## セットアップ

1. 依存関係のインストール:

```bash
yarn
```

2. 環境変数の設定:\
   `.env_sample`を参考に`.env`ファイルを作成

3. サーバのセットアップ:

```bash
yarn setup
```

4. 動作開始:

```bash
yarn start
```

## API 仕様

API の詳細な仕様については`openapi.yaml`を参照してください。
