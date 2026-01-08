import i18next from 'i18next';

// 静态导入所有翻译文件，以便 Vite 可以打包它们，适用于 Cloudflare 等 Edge 环境
import zhCommon from './locales/zh/common.json';
import enCommon from './locales/en/common.json';
import jaCommon from './locales/ja/common.json';
import koCommon from './locales/ko/common.json';
import frCommon from './locales/fr/common.json';
import deCommon from './locales/de/common.json';
import esCommon from './locales/es/common.json';

const NS = 'common';

const resources = {
  zh: { [NS]: zhCommon },
  en: { [NS]: enCommon },
  ja: { [NS]: jaCommon },
  ko: { [NS]: koCommon },
  fr: { [NS]: frCommon },
  de: { [NS]: deCommon },
  es: { [NS]: esCommon },
};

/**
 * 为特定语言初始化一个独立的 i18next 实例
 * @param {string} locale - 当前需要加载的语言代码 (如: 'zh' 或 'en')
 * @returns {i18next.i18n} - 初始化后的 i18next 实例
 */
export function initI18n(locale) {
  const finalLocale = locale || 'zh';
  
  // 创建并初始化 i18next 实例
  const i18n = i18next.createInstance();
  i18n.init({
    lng: finalLocale,
    fallbackLng: 'zh',
    ns: [NS],
    defaultNS: NS,
    resources: {
      // 只加载当前语言和回退语言（为了效率，虽然这里资源对象已经包含了所有）
      // 其实 i18next 会自动处理，这里传入完整 resources 也是可以的
      // 或者为了节省内存，只传入需要的
      [finalLocale]: resources[finalLocale] || resources['zh'],
      zh: resources['zh']
    },
    // 确保实例在服务器端是独立的
    initImmediate: false
  });

  return i18n;
}
