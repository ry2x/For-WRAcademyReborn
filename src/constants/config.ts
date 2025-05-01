/**
 * Bot configuration constants
 */
export default {
  prefix: '!',
  urlChampions: 'https://ry2x.github.io/WildRift-Merged-Champion-Data/data_ja_JP.json',
  urlRssWildRift: 'https://ry2x.github.io/wildrift-feeds/wildrift-news-ja-jp.json',
  urlWinRate: 'https://mlol.qt.qq.com/go/lgame_battle_info/hero_rank_list_v2',
  SUPPORTED_FILE_EXTENSIONS: ['.js', '.ts'],
  ButtonError: {
    timeOut: '❌このボタンは3分が経過したので使用できません。',
    invalidUser: '❌ 利用者以外はボタンは使用できません。',
  },
  LeaderBoardError: {
    invalidServer: '❌このサーバーでは使用できません。',
    noData: '❌リーダーボードにデータがありません。',
  },
} as const;
