import i18next, { type i18n } from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Initializes the i18next instance with configuration for internationalization
 * @returns {Promise<i18n>} Configured i18next instance
 */
export async function initI18n(): Promise<i18n> {
  await i18next.use(Backend).init({
    supportedLngs: ['en_US'],
    fallbackLng: process.env.DEFAULT_LOCALE ?? 'en_US',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.json'),
    },
  });

  return i18next;
}

/**
 * Translates a given key to the current language
 * @param {string} key - The translation key to look up
 * @param {Record<string, any>} [options] - Optional parameters for translation (e.g., interpolation values)
 * @returns {string} The translated text
 */
function translate(key: string, options?: Record<string, any>): string {
  return i18next.t(key, options);
}

export const t = translate;
