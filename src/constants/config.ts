/**
 * Bot configuration constants
 */
export default {
  prefix: '!',
  urlChampions: 'https://ry2x.github.io/WildRift-Merged-Champion-Data/data_{{locale}}.json',
  urlRssWildRift: 'https://ry2x.github.io/wildrift-feeds/wildrift-news-ja-jp.json',
  urlWinRate: 'https://mlol.qt.qq.com/go/lgame_battle_info/hero_rank_list_v2',
  SUPPORTED_FILE_EXTENSIONS: ['.js', '.ts'],
  LeaderBoardError: {
    invalidServer: '❌このサーバーでは使用できません。',
    noData: '❌リーダーボードにデータがありません。',
  },
} as const;
