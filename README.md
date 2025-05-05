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
# Discord application credential (required)
TOKEN=""
CLIENT_ID=""

# Discord server Leaderboard (optional)
DEFAULT_GUILD_ID=""
DEFAULT_CHANNEL_ID=""
DATABASE_URL=""

# Logtail (optional)
LOGTAIL_TOKEN=""
LOGTAIL_HOST=""

# Admin Webhook (optional)
ADMIN_WEBHOOK=""

# i18n Language ex:ja_JP (optional:default = en_US)
DEFAULT_LOCALE=""

# Enable / Disable command in discord server (required, true/false)
ENABLE_SUBCOMMAND_PING=""
ENABLE_SUBCOMMAND_SLOT=""
ENABLE_SUBCOMMAND_CHAMPION=""
ENABLE_SUBCOMMAND_DEV=""
ENABLE_SUBCOMMAND_LEVEL=""
ENABLE_SUBCOMMAND_NEWS=""
ENABLE_SUBCOMMAND_TEAM=""
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
