import React, { useCallback, useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import * as VCF from 'vcf'
import Modal from './Modal'
import FieldMapping from './FieldMapping'
import { FN, TEL, FIELDS_V3, FIELDS_V4 } from './vCard'
import i18next from 'i18next'
import { I18nextProvider, useTranslation } from 'react-i18next'
const VCardCtor: any = (VCF as any).default || (VCF as any).vCard || (VCF as any)

function normalizePhone(p: string) {
  return p.replace(/\s+/g, '')
}

const i18nClient = i18next.createInstance()
const setupI18n = (initialLocale: string, translations: any) => {
  const resources = translations ? { [initialLocale]: { common: translations } } : { [initialLocale]: { common: {} } }
  if (!i18nClient.isInitialized) {
    i18nClient.init({
      lng: initialLocale,
      resources,
      fallbackLng: 'zh',
      ns: ['common'],
      defaultNS: 'common',
      interpolation: { escapeValue: false },
    })
  } else if (i18nClient.language !== initialLocale) {
    i18nClient.changeLanguage(initialLocale)
  }
}

export default function CsvToVCardUpload({ accept = '.csv,.xlsx,.xls', locale = 'zh', translations }: { accept?: string, locale?: string, translations?: any }) {
  setupI18n(locale, translations)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [open, setOpen] = useState(false)
  const [version, setVersion] = useState<'3.0' | '4.0'>('3.0')
  const [columns, setColumns] = useState<string[]>(() => ['姓名', '电话号码', '公司', '备注'])
  const [sampleRows, setSampleRows] = useState<Record<string, any>[]>([])
  const [rows, setRows] = useState<Record<string, any>[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const isAccepted = (file: File) => {
    const tokens = accept.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    const name = (file.name || '').toLowerCase()
    const type = (file.type || '').toLowerCase()
    return tokens.some((t) => (t.startsWith('.') ? name.endsWith(t) : type === t))
  }

  const handleFiles = async (fileList: FileList | null, t: (k: string, o?: any) => string) => {
    const file = fileList && fileList[0]
    if (!file || !VCardCtor) return
    if (!isAccepted(file)) {
      setNotice({ type: 'error', text: t('pages.csv.ui.notice.unsupportedType', { name: file.name, accept }) })
      return
    }

    try {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array', dense: true })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rowsAoA = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false }) as any[]
      const headerRow = (rowsAoA[0] || []).map((c: any) => String(c ?? '').trim()).filter((c: string) => c)
      if (headerRow.length) {
        setColumns(headerRow)
        const dataAoA = rowsAoA.slice(1)
        const records = dataAoA
          .map((row: any[]) => {
            const obj: Record<string, any> = {}
            headerRow.forEach((h, i) => {
              obj[h] = row?.[i] ?? ''
            })
            return obj
          })
          .filter((obj) => Object.values(obj).some((v) => String(v ?? '').trim() !== ''))
        setRows(records)
        setSampleRows(records)
      } else {
        const parsed = XLSX.utils.sheet_to_json(ws) as Record<string, any>[]
        setRows(parsed)
        const heads = Object.keys(parsed[0] || {})
        if (heads.length) setColumns(heads)
        setSampleRows(parsed)
      }
      setOpen(true)
      setNotice(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setOpen(true)
    }
  }

  const onClickTrigger = (e: React.MouseEvent) => {
    e.preventDefault()
    if (inputRef.current) inputRef.current.value = ''
    inputRef.current?.click()
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, t: (k: string, o?: any) => string) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files, t)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const onMappingChange = useCallback((m: Record<string, string>) => {
    setMapping(m)
  }, [])

  const supportedFields = useMemo(() => (version === '4.0' ? FIELDS_V4 : FIELDS_V3), [version])

  const generateVCard = () => {
    const source = rows.length ? rows : sampleRows
    console.log(source)
    const fields = (mapping as any).fields as Array<{ fieldKey: string; column: string; type?: string; pref?: boolean }>
    const entries = source
      .map((r) => {
        const name = mapping.fullName ? String(r[mapping.fullName] ?? '').trim() : ''
        const phoneRaw = mapping.phone ? String(r[mapping.phone] ?? '').trim() : ''
        const phone = phoneRaw ? normalizePhone(phoneRaw) : ''
        if (!name || !phone) return ''
        const lines: string[] = []
        lines.push('BEGIN:VCARD')
        lines.push(`VERSION:${version}`)
        lines.push('PRODID:-//Syntro//CSV-to-vCard//ZH')
        const hasNInFields = Array.isArray(fields) && fields.some((f) => f.fieldKey === 'N')
        const makeStructuredName = (s: string) => {
          const n = s.trim()
          const isAscii = /[A-Za-z]/.test(n)
          if (isAscii) {
            const parts = n.split(/\s+/).filter(Boolean)
            const last = parts.length ? parts[parts.length - 1] : n
            const first = parts.length > 1 ? parts[0] : ''
            const middle = parts.length > 2 ? parts.slice(1, -1).join(' ') : ''
            return `${last};${first};${middle};;`
          }
          const last = n.slice(0, 1)
          const first = n.slice(1)
          return `${last};${first};;;`
        }
        const uuidv4 = () => {
          if ((globalThis as any).crypto && typeof (globalThis as any).crypto.randomUUID === 'function') {
            return (globalThis as any).crypto.randomUUID()
          }
          let d = Date.now()
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (d + Math.random() * 16) % 16 | 0
            d = Math.floor(d / 16)
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
          })
        }
        const rev = new Date()
        const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
        const revStr = `${rev.getUTCFullYear()}${pad(rev.getUTCMonth() + 1)}${pad(rev.getUTCDate())}T${pad(rev.getUTCHours())}${pad(rev.getUTCMinutes())}${pad(rev.getUTCSeconds())}Z`
        if (!hasNInFields) {
          const nVal = makeStructuredName(name)
          if (version === '3.0') {
            lines.push(`N;CHARSET=UTF-8:${nVal}`)
          } else {
            lines.push(`N:${nVal}`)
          }
        }
        let telPrefUsed = false
        let emailPrefUsed = false
        const v3CharsetKeys = new Set(['FN', 'N', 'ORG', 'TITLE', 'ROLE', 'NOTE', 'CATEGORIES', 'ADR', 'LABEL', 'NICKNAME'])
        const addText = (key: string, value: string) => {
          if (!value) return
          if (version === '3.0') {
            if (v3CharsetKeys.has(key)) {
              lines.push(`${key};CHARSET=UTF-8:${value}`)
            } else {
              lines.push(`${key}:${value}`)
            }
          } else {
            lines.push(`${key}:${value}`)
          }
        }
        const addTel = (value: string, type?: string, pref?: boolean) => {
          if (!value) return
          const v = normalizePhone(value)
          const t = type || (version === '4.0' ? 'cell' : 'CELL')
          if (version === '3.0') {
            const tt = pref && !telPrefUsed ? `${t.toUpperCase()},PREF` : t.toUpperCase()
            lines.push(`TEL;TYPE=${tt}:${v}`)
            if (pref && !telPrefUsed) telPrefUsed = true
          } else {
            const pf = pref && !telPrefUsed ? ';PREF=1' : ''
            lines.push(`TEL;TYPE=${t.toLowerCase()}${pf}:tel:${v}`)
            if (pref && !telPrefUsed) telPrefUsed = true
          }
        }
        const addEmail = (value: string, type?: string, pref?: boolean) => {
          if (!value) return
          if (version === '3.0') {
            const t = type || 'INTERNET'
            const tt = pref && !emailPrefUsed ? `${t},PREF` : t
            lines.push(`EMAIL;TYPE=${tt}:${value}`)
            if (pref && !emailPrefUsed) emailPrefUsed = true
          } else {
            const p = type ? `;TYPE=${String(type).toLowerCase()}` : ''
            const pf = pref && !emailPrefUsed ? ';PREF=1' : ''
            const addr = value.startsWith('mailto:') ? value : `mailto:${value}`
            lines.push(`EMAIL${p}${pf}:${addr}`)
            if (pref && !emailPrefUsed) emailPrefUsed = true
          }
        }
        const formatAdrV3 = (s: string) => {
          let str = s
          const mZip = str.match(/\b\d{6}\b/)
          const postal = mZip ? mZip[0] : ''
          if (postal) str = str.replace(postal, '')
          let country = ''
          if (str.includes('中国')) {
            country = '中国'
            str = str.replace('中国', '')
          }
          const mCity = str.match(/([^\s;]+市)/)
          const city = mCity ? mCity[1] : ''
          if (city) str = str.replace(city, '')
          const mRegion = str.match(/([^\s;]+区|[^\s;]+县|[^\s;]+自治区|[^\s;]+特别行政区)/)
          const region = mRegion ? mRegion[1] : ''
          if (region) str = str.replace(region, '')
          const street = str.trim()
          return `;;${street};${city};${region};${postal};${country}`
        }
        const formatAdrV4 = (s: string) => {
          let str = s
          const mZip = str.match(/\b\d{6}\b/)
          const postal = mZip ? mZip[0] : ''
          if (postal) str = str.replace(postal, '')
          let country = ''
          if (str.includes('中国')) {
            country = '中国'
            str = str.replace('中国', '')
          }
          const mCity = str.match(/([^\s;]+市)/)
          const city = mCity ? mCity[1] : ''
          if (city) str = str.replace(city, '')
          const mRegion = str.match(/([^\s;]+区|[^\s;]+县|[^\s;]+自治区|[^\s;]+特别行政区)/)
          const region = mRegion ? mRegion[1] : ''
          if (region) str = str.replace(region, '')
          const street = str.trim()
          return `;;${street};${city};${region};${postal};${country}`
        }
        const addAdr = (value: string, type?: string) => {
          if (!value) return
          if (version === '3.0') {
            const t = type ? `;TYPE=${type}` : ''
            const isStructured = value.includes(';')
            const payload = isStructured ? value : formatAdrV3(value)
            lines.push(`ADR${t};CHARSET=UTF-8:${payload}`)
          } else {
            const t = type ? `;TYPE=${String(type).toLowerCase()}` : ''
            const isStructured = value.includes(';')
            const payload = isStructured ? value : formatAdrV4(value)
            lines.push(`ADR${t}:${payload}`)
          }
        }
        const addPhoto = (value: string) => {
          const m = value.match(/^data:image\/(jpeg|jpg|png);base64,(.+)$/i)
          if (m) {
            const typ = m[1].toUpperCase() === 'JPG' ? 'JPEG' : m[1].toUpperCase()
            const b64 = m[2]
            lines.push(`PHOTO;TYPE=${typ};ENCODING=B:${b64}`)
            return
          }
          addText('PHOTO', value)
        }
        fields?.forEach((f) => {
          const val = String(r[f.column] ?? '').trim()
          if (!val) return
          if (f.fieldKey === 'FN') addText('FN', val)
          else if (f.fieldKey === 'TEL') addTel(val, f.type, !!f.pref)
          else if (f.fieldKey === 'EMAIL') addEmail(val, f.type, !!f.pref)
          else if (f.fieldKey === 'ADR') addAdr(val, f.type)
          else if (f.fieldKey === 'N') {
            const nVal = val
            if (version === '3.0') lines.push(`N;CHARSET=UTF-8:${nVal}`)
            else lines.push(`N:${nVal}`)
          }
          else if (f.fieldKey === 'NICKNAME') addText('NICKNAME', val)
          else if (f.fieldKey === 'LABEL') {
            if (version === '3.0') {
              const t = f.type ? `;TYPE=${f.type}` : ''
              lines.push(`LABEL${t};CHARSET=UTF-8:${val}`)
            }
          }
          else if (f.fieldKey === 'GENDER') {
            if (version === '4.0') {
              const m = val.trim().toLowerCase()
              const code = m === 'm' || m === 'male' || m === '男' ? 'M'
                : m === 'f' || m === 'female' || m === '女' ? 'F'
                  : m === 'o' || m === 'other' || m === '其他' ? 'O'
                    : m === 'n' || m === 'none' || m === '无' ? 'N'
                      : m === 'u' || m === 'unknown' || m === '未知' ? 'U'
                        : (m[0] ? m[0].toUpperCase() : 'U')
              lines.push(`GENDER:${code}`)
            }
          }
          else if (f.fieldKey === 'PHOTO') addPhoto(val)
          else addText(f.fieldKey, val)
        })
        const uid = uuidv4()
        if (version === '4.0') lines.push(`UID:urn:uuid:${uid}`)
        else lines.push(`UID:urn:uuid:${uid}`)
        lines.push(`REV:${revStr}`)
        lines.push('END:VCARD')
        return lines.join('\r\n')
      })
      .filter(Boolean)
    const content = entries.join('\r\n')
    if (!content) return
    const blob = new Blob([content], { type: 'text/vcard;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contacts-${version}.vcf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const onCloseModal = () => {
    setOpen(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const Content = () => {
    const { t } = useTranslation('common')
    return (
    <div className="rounded-2xl p-4 sm:p-6 bg-accent-50 shadow-sm ring-1 ring-base-200 mt-6 sm:mt-10">
      <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-black">
        <svg className="size-5 sm:size-6 text-base-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 20h16" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 4v12" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 8l4-4 4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{accept.includes('csv') ? t('pages.csv.ui.selectFileLabelCsv') : t('pages.excel.ui.selectFileLabelExcel')}</span>
      </div>

      <div className="mt-6">
        <div className="rounded-xl p-3 sm:p-4">
          <div
            className="rounded-xl border-2 border-dashed border-base-200 py-12 sm:py-16 px-4 flex items-center justify-center text-center"
            onDrop={(e) => onDrop(e, t)}
            onDragOver={onDragOver}
          >
            <div className="space-y-3">
              <svg className="mx-auto size-7 sm:size-8 text-accent-600" viewBox="0 0 24 24" fill="currentColor">
                <g transform="translate(0,1)"><path d="M12 3l4 4h-3v5h-2V7H8l4-4Z" /></g>
                <path d="M4 16h2v3h12v-3h2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3Z" />
              </svg>
              <div className="text-sm sm:text-base font-medium text-base-800">{t('pages.csv.ui.dropHere')}</div>
              <div className="text-xs text-base-500">{t('pages.csv.ui.onlyAcceptWithHeader', { accept })}</div>
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs text-base-600">{t('pages.csv.ui.vcardVersion')}</label>
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value as '3.0' | '4.0')}
                    className="h-10 px-3 w-full sm:w-40 rounded-md ring-1 ring-base-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="3.0">{t('pages.csv.ui.v3Recommended')}</option>
                    <option value="4.0">{t('pages.csv.ui.v4')}</option>
                  </select>
                </div>
                <div className="flex items-center w-full sm:w-auto">
                  <a
                    href="#"
                    onClick={onClickTrigger}
                    className="inline-flex items-center justify-center transition-all duration-200 ring-1 focus:ring-2 ring-accent-700 focus:outline-none text-base-50 bg-accent-600 hover:bg-accent-700 focus:ring-base-500/50 h-10 px-5 text-sm font-medium rounded-md w-full sm:w-auto"
                  >
                    {t('pages.csv.ui.chooseFile')}
                  </a>
                  <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files, t)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {notice && (
        <div role="alert" aria-live="polite" className="mt-4 p-4 bg-accent-50 rounded-xl ring-1 ring-base-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${notice.type === 'error' ? 'text-red-600' : 'text-accent-600'} flex-shrink-0`} viewBox="0 0 20 20" fill="currentColor">
                {notice.type === 'error' ? <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2H9v-2zm0-8h2v6H9V5z" /> : <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z" clipRule="evenodd" />}
              </svg>
              <p className="text-sm font-medium {notice.type === 'error' ? 'text-red-700' : 'text-accent-700'}">{notice.text}</p>
            </div>
            <button onClick={() => setNotice(null)} aria-label={t('pages.csv.ui.notice.closeLabel')} className="inline-flex items-center justify-center h-8 w-8 rounded-md text-base-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-accent-500">×</button>
          </div>
        </div>
      )}
      <Modal
        open={open}
        title={t('pages.csv.ui.mapping.title')}
        onClose={onCloseModal}
        footer={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 justify-between">
            <div className="text-xs text-base-600">{t('pages.csv.ui.supportedFieldCount', { count: supportedFields.length })}</div>
            <button
              type="button"
              onClick={generateVCard}
              disabled={!mapping.fullName || !mapping.phone}
              className="inline-flex items-center justify-center transition-all duration-200 ring-1 focus:ring-2 ring-accent-700 focus:outline-none text-base-50 bg-accent-600 hover:bg-accent-700 focus:ring-base-500/50 h-9 px-4 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {t('pages.csv.ui.exportVCard')}
            </button>
          </div>
        }
      >
        <div className="max-w-5xl px-2 sm:px-0">
          <div className="text-xs text-base-600">{t('pages.csv.ui.ensureMapping', { fn: FN.zh, tel: TEL.zh, count: supportedFields.length })}</div>
          <FieldMapping version={version} columns={columns} sampleRows={sampleRows} onChange={onMappingChange} />
        </div>
      </Modal>
    </div>
    )
  }
  return (
    <I18nextProvider i18n={i18nClient}>
      <Content />
    </I18nextProvider>
  )
}
