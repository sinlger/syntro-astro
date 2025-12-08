import i18next from 'i18next';
import fs from 'fs';
import path from 'path';

// 翻译文件所在的根目录，例如: C:/.../syntro-astro/src/locales
const resourcesPath = path.join(process.cwd(), 'src', 'locales');
const NS = 'common'; // 命名空间，对应 common.json

/**
 * 在构建时为特定语言初始化一个独立的 i18next 实例
 * @param {string} locale - 当前需要加载的语言代码 (如: 'zh' 或 'en')
 * @returns {i18next.i18n} - 初始化后的 i18next 实例
 */
export function initI18n(locale) {
  const finalLocale = locale || 'zh';
  // 1. 构造翻译文件的绝对路径
  const translationFilePath = path.join(resourcesPath, finalLocale, `${NS}.json`);
  let translations = {};

  try {
    // 2. 同步读取 JSON 文件内容
    // 注意：这只在构建时的 Node.js 环境下运行
    translations = JSON.parse(fs.readFileSync(translationFilePath, 'utf-8'));
  } catch (e) {
    console.error(`无法加载 ${locale} 的翻译文件: ${translationFilePath}`, e);
    // 如果失败，返回空对象
  }

  // 3. 创建并初始化 i18next 实例
  const i18n = i18next.createInstance();
  i18n.init({
    lng: locale,
    fallbackLng: 'zh',
    ns: [NS],
    defaultNS: NS,
    resources: {
      [locale]: {
        [NS]: translations,
      }
    },
    // 确保实例在服务器端是独立的
    initImmediate: false,
    preload: [locale]
  });

  return i18n;
}