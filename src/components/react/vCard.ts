export type VCardField = {
  key: string
  zh: string
  v3: boolean
  v4: boolean
  desc: string
}

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
export const NICKNAME: VCardField = { key: 'NICKNAME', zh: '昵称', v3: true, v4: true, desc: '4.0 原生支持，3.0 可用 X-NICKNAME。' }
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

export const FIELDS: VCardField[] = [
  VERSION,
  FN,
  N,
  TEL,
  EMAIL,
  ORG,
  TITLE,
  ADR,
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
