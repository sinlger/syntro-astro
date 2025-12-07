export type VCardField = {
  key: string
  zh: string
  v3: boolean
  v4: boolean
  desc: string
}

// --- vCard 字段定义（保持不变）---

export const VERSION: VCardField = { key: 'VERSION', zh: '版本号', v3: true, v4: true, desc: 'vCard 版本（3.0 或 4.0）。' }
export const FN: VCardField = { key: 'FN', zh: '全名', v3: true, v4: true, desc: '显示的联系人名称，通常必填。' }
export const N: VCardField = { key: 'N', zh: '姓名结构', v3: true, v4: true, desc: '格式：姓;名;中间名;称呼;后缀。' }
export const TEL: VCardField = { key: 'TEL', zh: '电话号码', v3: true, v4: true, desc: '支持 TYPE 参数（如 CELL, WORK, HOME）。' }
export const EMAIL: VCardField = { key: 'EMAIL', zh: '电子邮箱', v3: true, v4: true, desc: '支持 TYPE 参数（如 INTERNET）。' }
export const ORG: VCardField = { key: 'ORG', zh: '组织/公司', v3: true, v4: true, desc: '公司名和部门名。' }
export const TITLE: VCardField = { key: 'TITLE', zh: '职位/头衔', v3: true, v4: true, desc: '职业或职务。' }
export const ADR: VCardField = { key: 'ADR', zh: '地址', v3: true, v4: true, desc: '支持 TYPE 参数（如 HOME, WORK）。' }
export const URL: VCardField = { key: 'URL', zh: '网站', v3: true, v4: true, desc: '个人或公司网站。' }
export const NOTE: VCardField = { key: 'NOTE', zh: '备注', v3: true, v4: true, desc: '额外说明信息。' }
export const BDAY: VCardField = { key: 'BDAY', zh: '生日', v3: true, v4: true, desc: '格式：YYYY-MM-DD。' }
export const NICKNAME: VCardField = { key: 'NICKNAME', zh: '昵称', v3: true, v4: true, desc: '联系人昵称。' }
export const LABEL: VCardField = { key: 'LABEL', zh: '地址标签', v3: true, v4: false, desc: '用于打印的地址标签（与 ADR 关联）。' }
export const PHOTO: VCardField = { key: 'PHOTO', zh: '头像', v3: true, v4: true, desc: '支持 Base64 编码嵌入图片。' }
export const UID: VCardField = { key: 'UID', zh: '唯一标识符', v3: true, v4: true, desc: '联系人的唯一 ID。' }
export const REV: VCardField = { key: 'REV', zh: '最后修改时间', v3: true, v4: true, desc: 'ISO 8601 时间戳。' }
export const CATEGORIES: VCardField = { key: 'CATEGORIES', zh: '分类', v3: true, v4: true, desc: '用于标记联系人类型。' }
export const GENDER: VCardField = { key: 'GENDER', zh: '性别', v3: false, v4: true, desc: '格式：M、F、O、U。' }
export const ANNIVERSARY: VCardField = { key: 'ANNIVERSARY', zh: '纪念日', v3: false, v4: true, desc: '如结婚纪念日。' }
export const LANG: VCardField = { key: 'LANG', zh: '语言', v3: false, v4: true, desc: '联系人使用的语言（如 zh-CN）。' }
export const ROLE: VCardField = { key: 'ROLE', zh: '角色', v3: true, v4: true, desc: '在组织中的角色。' }
export const TZ: VCardField = { key: 'TZ', zh: '时区', v3: true, v4: true, desc: '联系人所在时区（如 +08:00）。' }
export const X_PREFIX: VCardField = { key: 'X-*', zh: '自定义字段', v3: true, v4: true, desc: '如 X-INSTANT-MESSENGER、X-SKYPE。' }
export const IMPP: VCardField = { key: 'IMPP', zh: '即时通讯', v3: false, v4: true, desc: '如 IMPP:skype:username。' }
export const SOUND: VCardField = { key: 'SOUND', zh: '音频信息', v3: true, v4: true, desc: '通常用于存储联系人发音。' }

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

export const VCardTypeTelZh: Record<string, string> = {
  HOME: '家庭',
  WORK: '工作',
  VOICE: '语音',
  CELL: '手机',
  FAX: '传真',
  PAGER: '寻呼机',
  home: '家庭',
  work: '工作',
  voice: '语音',
  cell: '手机',
  fax: '传真',
  text: '短信',
  video: '视频',
  pager: '寻呼机',
  textphone: '助听设备',
}

export const VCardTypeEmailZh: Record<string, string> = {
  INTERNET: '互联网邮件',
  A400: 'X.400 邮件',
}

export const VCardTypeAdrZh: Record<string, string> = {
  HOME: '家庭',
  WORK: '工作',
  POSTAL: '邮政地址',
  PARCEL: '包裹地址',
  home: '家庭',
  work: '工作',
  dom: '境内地址',
  intl: '国际地址',
}

export const VCardTypeCommonZh: Record<string, string> = {
  PREF: '首选',
}

// --- 字段数组定义（保持不变）---

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
