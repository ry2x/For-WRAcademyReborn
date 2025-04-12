/**
 * Bot configuration constants
 */
export default {
  prefix: '!',
  urlChampions: 'https://ry2x.github.io/WildRift-Champs/hero.json',
  urlRssWildRift: 'https://ry2x.github.io/wildrift-feeds/wildrift-news-ja-jp.json',
  urlWinRate: 'https://mlol.qt.qq.com/go/lgame_battle_info/hero_rank_list_v2',
  championError: {
    notFound: '❌ 該当するチャンピオンが見つかりません。',
    notAvailable: '❌チャンピオンはワイルドリフトで使用可能ではありません。',
    invalidRank: '❌ランクが正しく指定されていません。',
    invalidChampion: '❌チャンピオンの名前が指定されていません。',
  },
  ButtonError: {
    timeOut: '❌このボタンは3分が経過したので使用できません。',
    invalidUser: '❌ 利用者以外はボタンは使用できません。',
  },
  LeaderBoardError: {
    invalidServer: '❌このサーバーでは使用できません。',
    noData: '❌リーダーボードにデータがありません。',
  },
} as const;
