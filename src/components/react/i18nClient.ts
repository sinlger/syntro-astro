import i18next, { type i18n as I18nInstance } from 'i18next'

/**
 * Create an isolated i18next instance for a client island.
 *
 * The instance is created once per component module, but `setupI18n` is called
 * on every render (server-side too). Therefore each call MUST register the
 * bundle for the requested language before switching to it: during a static
 * build the same module instance renders every locale one after another, and
 * only the first locale used to have its resources registered. Any later
 * locale then fell back to `fallbackLng` (previously `zh`), which is exactly
 * why non-Chinese tool pages rendered Chinese UI text.
 */
export function createI18nClient() {
  const instance: I18nInstance = i18next.createInstance()

  const setupI18n = (locale: string, translations: any) => {
    const lng = locale || 'en'
    const bundle =
      translations && typeof translations === 'object' ? translations : {}

    if (!instance.isInitialized) {
      instance.init({
        lng,
        resources: { [lng]: { common: bundle } },
        // Never fall back to Chinese; English is the safe neutral fallback.
        fallbackLng: 'en',
        ns: ['common'],
        defaultNS: 'common',
        interpolation: { escapeValue: false },
      })
      return
    }

    // Always (re)register the bundle for the language of this render so every
    // locale has its own resources, no matter which locale initialized first.
    instance.addResourceBundle(lng, 'common', bundle, true, true)
    if (instance.language !== lng) {
      instance.changeLanguage(lng)
    }
  }

  return { i18nClient: instance, setupI18n }
}
