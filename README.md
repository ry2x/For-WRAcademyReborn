# Discord Bot Project 🎮

Discord.jsを使用したDiscordボットプロジェクトです！

## 🚀 機能

- Discord.js v14を使用した最新のボット実装
- TypeScriptによる型安全な開発環境
- Drizzle ORMを使用したデータベース管理
- ESLintとPrettierによるコード品質管理

## 🛠 技術スタック

- **言語**: TypeScript
- **ランタイム**: Node.js
- **パッケージマネージャー**: pnpm
- **フレームワーク**: Discord.js v14
- **ORM**: Drizzle ORM
- **データベース**: PostgreSQL
- **ロギング**: Winston + Logtail
- **コード品質**: ESLint, Prettier, Husky

## 📦 インストール

```bash
# 依存関係のインストール
pnpm install

# 開発環境のセットアップ
pnpm prepare:dev
```

## 🚀 開発サーバーの起動

```bash
# 開発モードで起動
pnpm start:dev

# 本番モードで起動
pnpm start:prod
```

## 🧪 テスト

```bash
# コードのコンパイル
pnpm compile

# コードのリント
pnpm lint

# コードのフォーマット
pnpm prettier
```

## 🔧 環境変数の設定

1. `RENAME.env`ファイルを`.env`にリネームしてください
2. 以下の環境変数を設定してください：

```env
TOKEN="your_discord_bot_token"
CLIENT_ID="your_discord_client_id"
DEFAULT_GUILD_ID="your_default_guild_id"
DEFAULT_CHANNEL_ID="your_default_channel_id"
LOGTAIL_TOKEN="your_logtail_token"
LOGTAIL_HOST="your_logtail_host"
ADMIN_WEBHOOK="your_admin_webhook_url"
DATABASE_URL="your_database_url"
```

## 📁 プロジェクト構造

```
.
├── drizzle/                 # データベースマイグレーションファイル
│   └── migrations/         # マイグレーションの履歴
│
└── src/                     # メインのソースコードディレクトリ
    ├── commands/           # スラッシュコマンドの実装
    │   ├── admin/         # 管理者用コマンド
    │   └── user/          # 一般ユーザー用コマンド
    │
    ├── components/         # Discord UIコンポーネント
    │   ├── buttons/       # ボタンコンポーネント
    │   └── selects/       # セレクトメニュー
    │
    ├── constants/          # 定数定義ファイル
    ├── contexts/           # コンテキストメニュー関連
    ├── data/              # 静的データファイル
    │
    ├── db/                # データベース関連
    │   ├── schema/       # テーブルスキーマ
    │   └── queries/      # SQLクエリ
    │
    ├── embeds/            # Discord埋め込みメッセージ
    ├── events/            # イベントハンドラー
    ├── messageCommands/    # レガシーメッセージコマンド
    ├── subCommands/       # サブコマンドの実装
    │
    ├── templates/         # メッセージテンプレート
    ├── types/            # TypeScript型定義
    ├── utils/            # ユーティリティ関数
    │
    ├── deployGlobalCommands.ts  # グローバルコマンドデプロイ
    ├── index.ts           # アプリケーションのエントリーポイント
    └── logger.ts          # ログ設定

```

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューは大歓迎です！✨
