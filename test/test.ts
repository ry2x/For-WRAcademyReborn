import { initI18n, t } from '../src/utils/i18n.js';
import logger from '../src/utils/logger.js';

async function test() {
  console.log('test');

  await initI18n();

  logger.info(t('ready.success', { name: 'test' }));
}

test();
