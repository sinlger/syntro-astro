import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

export type VCardField = {
  key: string
  labelKey: string
  v3: boolean
  v4: boolean
  descKey: string
}

// --- vCard 字段定义 ---

export const VERSION: VCardField = { key: 'VERSION', labelKey: 'vcard.field.VERSION.label', v3: true, v4: true, descKey: 'vcard.field.VERSION.desc' }
export const FN: VCardField = { key: 'FN', labelKey: 'vcard.field.FN.label', v3: true, v4: true, descKey: 'vcard.field.FN.desc' }
export const N: VCardField = { key: 'N', labelKey: 'vcard.field.N.label', v3: true, v4: true, descKey: 'vcard.field.N.desc' }
export const TEL: VCardField = { key: 'TEL', labelKey: 'vcard.field.TEL.label', v3: true, v4: true, descKey: 'vcard.field.TEL.desc' }
export const EMAIL: VCardField = { key: 'EMAIL', labelKey: 'vcard.field.EMAIL.label', v3: true, v4: true, descKey: 'vcard.field.EMAIL.desc' }
export const ORG: VCardField = { key: 'ORG', labelKey: 'vcard.field.ORG.label', v3: true, v4: true, descKey: 'vcard.field.ORG.desc' }
export const TITLE: VCardField = { key: 'TITLE', labelKey: 'vcard.field.TITLE.label', v3: true, v4: true, descKey: 'vcard.field.TITLE.desc' }
export const ADR: VCardField = { key: 'ADR', labelKey: 'vcard.field.ADR.label', v3: true, v4: true, descKey: 'vcard.field.ADR.desc' }
export const URL: VCardField = { key: 'URL', labelKey: 'vcard.field.URL.label', v3: true, v4: true, descKey: 'vcard.field.URL.desc' }
export const NOTE: VCardField = { key: 'NOTE', labelKey: 'vcard.field.NOTE.label', v3: true, v4: true, descKey: 'vcard.field.NOTE.desc' }
export const BDAY: VCardField = { key: 'BDAY', labelKey: 'vcard.field.BDAY.label', v3: true, v4: true, descKey: 'vcard.field.BDAY.desc' }
export const NICKNAME: VCardField = { key: 'NICKNAME', labelKey: 'vcard.field.NICKNAME.label', v3: true, v4: true, descKey: 'vcard.field.NICKNAME.desc' }
export const LABEL: VCardField = { key: 'LABEL', labelKey: 'vcard.field.LABEL.label', v3: true, v4: false, descKey: 'vcard.field.LABEL.desc' }
export const PHOTO: VCardField = { key: 'PHOTO', labelKey: 'vcard.field.PHOTO.label', v3: true, v4: true, descKey: 'vcard.field.PHOTO.desc' }
export const UID: VCardField = { key: 'UID', labelKey: 'vcard.field.UID.label', v3: true, v4: true, descKey: 'vcard.field.UID.desc' }
export const REV: VCardField = { key: 'REV', labelKey: 'vcard.field.REV.label', v3: true, v4: true, descKey: 'vcard.field.REV.desc' }
export const CATEGORIES: VCardField = { key: 'CATEGORIES', labelKey: 'vcard.field.CATEGORIES.label', v3: true, v4: true, descKey: 'vcard.field.CATEGORIES.desc' }
export const GENDER: VCardField = { key: 'GENDER', labelKey: 'vcard.field.GENDER.label', v3: false, v4: true, descKey: 'vcard.field.GENDER.desc' }
export const ANNIVERSARY: VCardField = { key: 'ANNIVERSARY', labelKey: 'vcard.field.ANNIVERSARY.label', v3: false, v4: true, descKey: 'vcard.field.ANNIVERSARY.desc' }
export const LANG: VCardField = { key: 'LANG', labelKey: 'vcard.field.LANG.label', v3: false, v4: true, descKey: 'vcard.field.LANG.desc' }
export const ROLE: VCardField = { key: 'ROLE', labelKey: 'vcard.field.ROLE.label', v3: true, v4: true, descKey: 'vcard.field.ROLE.desc' }
export const TZ: VCardField = { key: 'TZ', labelKey: 'vcard.field.TZ.label', v3: true, v4: true, descKey: 'vcard.field.TZ.desc' }
export const X_PREFIX: VCardField = { key: 'X-*', labelKey: 'vcard.field.X_PREFIX.label', v3: true, v4: true, descKey: 'vcard.field.X_PREFIX.desc' }
export const IMPP: VCardField = { key: 'IMPP', labelKey: 'vcard.field.IMPP.label', v3: false, v4: true, descKey: 'vcard.field.IMPP.desc' }
export const SOUND: VCardField = { key: 'SOUND', labelKey: 'vcard.field.SOUND.label', v3: true, v4: true, descKey: 'vcard.field.SOUND.desc' }

// --- TYPE 参数值定义（v3 与 v4 通用和 v4 特有）---

/**
 * 通用的 TYPE 参数值 (v3/v4)
 * v4 推荐使用 `PREF` 代替 `TYPE=PREF` 的形式，改用参数 `PREF=1`。
 */
export const VCardTypeCommon = {
  PREF: 'PREF', // v3 习惯用法：首选值 (Preferred)
}

// --- v4 特有的电话、地址等字段的通用类型值 ---

/**
 * vCard 4.0 中，TEL 和 ADR 等字段通常使用 `TYPE` 参数的不同值来指示联系方式的分类。
 * v4 倾向于使用更清晰、小写的类型值，并支持自定义类型。
 */
export const VCardTypeV4Common = {
  // v4 推荐使用的通用场所类型
  WORK: 'work',   // 工作
  HOME: 'home',   // 家庭/个人
  
  // v4 中推荐使用的通信媒介类型 (通常用于 TEL)
  VOICE: 'voice', // 语音通话
  CELL: 'cell',   // 移动电话 / 手机
  FAX: 'fax',     // 传真
  TEXT: 'text',   // 短信/文本信息
  VIDEO: 'video', // 视频通话
  PAGER: 'pager', // 寻呼机
  TEXTPHONE: 'textphone', // TTY/TDD 设备
}

/**
 * TEL (电话号码) 字段的 TYPE 参数值 (v3/v4 兼容和 v4 推荐)
 */
export const VCardTypeTel = {
  // v3 习惯用法 (大写)
  HOME_V3: 'HOME',   
  WORK_V3: 'WORK',   
  CELL_V3: 'CELL',   
  FAX_V3: 'FAX',     
  VOICE_V3: 'VOICE',
  PAGER_V3: 'PAGER', 
  
  // v4 推荐用法 (小写，包含在 VCardTypeV4Common 中)
  ...VCardTypeV4Common,
}

/**
 * EMAIL (电子邮箱) 字段的 TYPE 参数值 (v3/v4 兼容)
 * v4 规范更灵活，不强制要求类型，但常用的仍是 INTERNET。
 */
export const VCardTypeEmail = {
  INTERNET: 'INTERNET', // 互联网邮件地址（v3/v4 常用）
  A400: 'A400',         // X.400 邮件系统（较少见）
}

/**
 * ADR (地址) 字段的 TYPE 参数值 (v3/v4 兼容和 v4 推荐)
 */
export const VCardTypeAdr = {
  // v3 习惯用法 (大写)
  HOME_V3: 'HOME',     
  WORK_V3: 'WORK',     
  POSTAL_V3: 'POSTAL', // 邮政地址（用于邮件投递）
  PARCEL_V3: 'PARCEL', // 包裹投递地址（用于快递）
  
  // v4 推荐用法 (小写，包含在 VCardTypeV4Common 中)
  ...VCardTypeV4Common,

  // v4 特有的地址投递类型
  dom: 'dom', // 境内地址 (Domestic)
  intl: 'intl', // 国际地址 (International)
}

// --- TYPE 中文标签映射 ---

export const VCardTypeTelKeys: Record<string, string> = {
  HOME: 'vcard.type.HOME',
  WORK: 'vcard.type.WORK',
  VOICE: 'vcard.type.VOICE',
  CELL: 'vcard.type.CELL',
  FAX: 'vcard.type.FAX',
  PAGER: 'vcard.type.PAGER',
  home: 'vcard.type.HOME',
  work: 'vcard.type.WORK',
  voice: 'vcard.type.VOICE',
  cell: 'vcard.type.CELL',
  fax: 'vcard.type.FAX',
  text: 'vcard.type.TEXT',
  video: 'vcard.type.VIDEO',
  pager: 'vcard.type.PAGER',
  textphone: 'vcard.type.TEXTPHONE',
}

export const VCardTypeEmailKeys: Record<string, string> = {
  INTERNET: 'vcard.type.INTERNET',
  A400: 'vcard.type.A400',
}

export const VCardTypeAdrKeys: Record<string, string> = {
  HOME: 'vcard.type.HOME',
  WORK: 'vcard.type.WORK',
  POSTAL: 'vcard.type.POSTAL',
  PARCEL: 'vcard.type.PARCEL',
  home: 'vcard.type.HOME',
  work: 'vcard.type.WORK',
  dom: 'vcard.type.DOM',
  intl: 'vcard.type.INTL',
}

export const VCardTypeCommonKeys: Record<string, string> = {
  PREF: 'vcard.type.PREF',
}

// --- 字段数组定义 ---

export const FIELDS: VCardField[] = [
  VERSION,
  FN,
  N,
  TEL,
  EMAIL,
  ORG,
  TITLE,
  ADR,
  LABEL,
  URL,
  NOTE,
  BDAY,
  NICKNAME,
  PHOTO,
  UID,
  REV,
  CATEGORIES,
  GENDER,
  ANNIVERSARY,
  LANG,
  ROLE,
  TZ,
  X_PREFIX,
  IMPP,
  SOUND,
]

export const FIELDS_V3: VCardField[] = FIELDS.filter((f) => f.v3)
export const FIELDS_V4: VCardField[] = FIELDS.filter((f) => f.v4)
export const FIELD_KEYS_V3: string[] = FIELDS_V3.map((f) => f.key)
export const FIELD_KEYS_V4: string[] = FIELDS_V4.map((f) => f.key)

// --- Hooks ---

export const useVCardFields = (version: '3.0' | '4.0' = '3.0') => {
    const { t } = useTranslation('common');
    const fields = version === '4.0' ? FIELDS_V4 : FIELDS_V3;
    
    return fields.map(f => ({
        ...f,
        label: t(f.labelKey),
        desc: t(f.descKey)
    }));
}

export const useVCardTypes = () => {
    const { t } = useTranslation('common');
    
    return {
        getTypeLabel: (type: string, category: 'tel' | 'email' | 'adr' | 'common' = 'common') => {
             let key = '';
             if (category === 'tel') key = VCardTypeTelKeys[type];
             else if (category === 'email') key = VCardTypeEmailKeys[type];
             else if (category === 'adr') key = VCardTypeAdrKeys[type];
             else if (category === 'common') key = VCardTypeCommonKeys[type];
             
             // Fallback to trying all if specific category not matched or generic
             if (!key) {
                 key = VCardTypeTelKeys[type] || VCardTypeEmailKeys[type] || VCardTypeAdrKeys[type] || VCardTypeCommonKeys[type];
             }
             
             return key ? t(key) : type;
        }
    }
}
