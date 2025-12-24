import React, { useState } from 'react'
import * as VCF from 'vcf'
import * as XLSX from 'xlsx'
import { useVCardTypes } from './vCard'
import i18next from 'i18next'
import { I18nextProvider, useTranslation } from 'react-i18next'
type Row = Record<string, string>
// 1. 定义 i18next 实例（在模块级别创建，避免重复初始化）
const i18nClient = i18next.createInstance();

const setupI18n = (initialLocale: string, translations: any) => {
  const resources = translations
    ? { [initialLocale]: { common: translations } }
    : { [initialLocale]: { common: {} } }
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
function toArray<T>(p: T | T[] | null | undefined): T[] {
  if (!p) return []
  return Array.isArray(p) ? p : [p]
}

function valOf(p: any): string {
  if (!p) return ''
  if (typeof p.valueOf === 'function') return String(p.valueOf())
  return String(p)
}

function parseVcf(text: string): any[] {
  const VCard: any = (VCF as any).default || (VCF as any)
  if (VCard && typeof VCard.parse === 'function') return VCard.parse(text)
  return []
}

function zhTypeLabel(t: any, getTypeLabel: (k: string, cat?: any) => string): string {
  if (!t) return ''
  const arr = Array.isArray(t) ? t : [t]
  const mapped = arr.map((x) => getTypeLabel(x === 'pref' ? 'PREF' : x))
  return mapped.join(',')
}

function cardToRow(card: any, getTypeLabel: (k: string, cat?: any) => string): Row {
  const nParts = valOf(card.get('n')).split(';')

  const tels = toArray(card.get('tel')).map((p: any) => {
    const v = valOf(p).replace(/^tel:/, '')
    const types = [] as string[]
    if (Array.isArray(p.type)) types.push(...p.type)
    else if (p.type) types.push(p.type)
    if (p.pref) types.push('pref')
    const tLabel = zhTypeLabel(types, getTypeLabel)
    return `${v}${tLabel ? ` (${tLabel})` : ''}`
  }).join(' | ')

  const emails = toArray(card.get('email')).map((p: any) => {
    const v = valOf(p).replace(/^mailto:/, '')
    const tLabel = zhTypeLabel(p.type, getTypeLabel)
    return `${v}${tLabel ? ` (${tLabel})` : ''}`
  }).join(' | ')

  const adrsArr = toArray(card.get('adr'))
  const adrs = adrsArr.map((p: any) => {
    const parts = valOf(p).split(';')
    const street = parts[2] || ''
    const city = parts[3] || ''
    const region = parts[4] || ''
    const postal = parts[5] || ''
    const country = parts[6] || ''
    const tLabel = zhTypeLabel(p.type, getTypeLabel)
    const payload = [street, city, region, postal, country].filter(Boolean).join(' ')
    return `${payload}${tLabel ? ` (${tLabel})` : ''}`
  }).join(' | ')

  const labels = toArray(card.get('label')).map((p: any) => valOf(p)).join(' | ')
  const parts0 = (adrsArr[0] ? String(adrsArr[0].valueOf() || '') : '').split(';')
  const adrStreet = parts0[2] || ''
  const adrCity = parts0[3] || ''
  const adrRegion = parts0[4] || ''
  const adrPostal = parts0[5] || ''
  const adrCountry = parts0[6] || ''

  const row: Row = {
    VERSION: String(card.version || ''),
    FN: valOf(card.get('fn')) || '',
    N_Last: nParts[0] || '',
    N_First: nParts[1] || '',
    N_Middle: nParts[2] || '',
    N_Prefix: nParts[3] || '',
    N_Suffix: nParts[4] || '',
    ORG: valOf(card.get('org')) || '',
    TITLE: valOf(card.get('title')) || '',
    TELs: tels || '',
    EMAILs: emails || '',
    ADRs: adrs || '',
    LABELs: labels || '',
    NOTE: valOf(card.get('note')) || '',
    UID: valOf(card.get('uid')) || '',
    REV: valOf(card.get('rev')) || '',
    GENDER: valOf(card.get('gender')) || '',
    NICKNAME: valOf(card.get('nickname')) || '',
    CATEGORIES: valOf(card.get('categories')) || '',
    ADR_Street: adrStreet || '',
    ADR_City: adrCity || '',
    ADR_Region: adrRegion || '',
    ADR_Postal: adrPostal || '',
    ADR_Country: adrCountry || '',
  }

  return row
}

export default function VCardToCsv({ accept = '.vcf,text/vcard', locale = 'zh', translations }: { accept?: string, locale?: string, translations?: any }) {
  setupI18n(locale, translations)
  const [rows, setRows] = useState<Row[]>([])
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx')
  const [dragOver, setDragOver] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [fileName, setFileName] = useState('')

  const isAccepted = (file: File) => {
    const tokens = accept.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    const name = (file.name || '').toLowerCase()
    const type = (file.type || '').toLowerCase()
    return tokens.some((t) => (t.startsWith('.') ? name.endsWith(t) : type === t))
  }

  const onFile = async (file: File, t: (k: string, o?: any) => string, getTypeLabel: (k: string, cat?: any) => string) => {
    if (!isAccepted(file)) {
      setNotice({ type: 'error', text: t('pages.vcardExcel.ui.notice.unsupportedType', { name: file.name, accept }) })
      return
    }
    const text = await file.text()
    const cards = parseVcf(text)
    const data = cards.map((c) => cardToRow(c, getTypeLabel))
    setRows(data)
    setFileName(file.name || '')
    setNotice({ type: 'success', text: t('pages.vcardExcel.ui.notice.parseSuccess', { count: data.length, name: file.name || '' }) })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, t: (k: string, o?: any) => string, getTypeLabel: (k: string, cat?: any) => string) => {
    const f = e.target.files && e.target.files[0]
    if (f) onFile(f, t, getTypeLabel)
  }

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, t: (k: string, o?: any) => string, getTypeLabel: (k: string, cat?: any) => string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    const f = e.dataTransfer.files && e.dataTransfer.files[0]
    if (f) onFile(f, t, getTypeLabel)
  }

  const download = () => {
    if (!rows.length) return
    const ws = XLSX.utils.json_to_sheet(rows)
    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Contacts')
      XLSX.writeFile(wb, 'contacts.xlsx')
    } else {
      const csv = XLSX.utils.sheet_to_csv(ws, { RS: '\r\n' })
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'contacts.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }
  }

  const Content = () => {
    const { t } = useTranslation('common')
    const { getTypeLabel } = useVCardTypes()
    return (
    <div>
      <div className="rounded-2xl p-4 sm:p-6 bg-accent-50 shadow-sm ring-1 ring-base-200 mt-6 sm:mt-10">
        <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-black">
          <svg className="size-5 sm:size-6 text-base-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 20h16" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 4v12" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 8l4-4 4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{t('pages.vcardExcel.ui.selectVcfLabel')}</span>
        </div>

        <div className="mt-6">
          <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, t, getTypeLabel)}
            className={`rounded-xl p-8  ring-base-200`}
          >
            <div className={`rounded-xl border-2 ${dragOver ? 'border-accent-400 bg-accent-50' : 'border-dashed border-base-200'} py-16 flex items-center justify-center text-center`}>
              <div className="space-y-4">
                <svg className="mx-auto size-8 text-accent-600" viewBox="0 0 24 24" fill="currentColor">
                  <g transform="translate(0,4)"><path d="M12 3l4 4h-3v5h-2V7H8l4-4Z" /></g>
                  <path d="M4 16h2v3h12v-3h2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3Z" />
                </svg>
                <div className="text-base font-medium text-base-800">{t('pages.vcardExcel.ui.dropHere')}</div>
                <div className="text-xs text-base-500">{t('pages.vcardExcel.ui.onlyAccept', { accept })}</div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-sm text-base-700">{t('pages.vcardExcel.ui.downloadFormat')}</span>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as 'xlsx' | 'csv')}
                      className="h-9 w-40 px-2 rounded-md ring-1 ring-base-200  text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                    >
                      <option value="xlsx">{t('pages.vcardExcel.ui.excelOption')}</option>
                      <option value="csv">{t('pages.vcardExcel.ui.csvOption')}</option>
                    </select>
                  </div>
                  <label htmlFor="vcf-input" className="inline-flex items-center justify-center transition-all duration-200 ring-1 focus:ring-2 ring-accent-700 focus:outline-none text-base-50 bg-accent-600 hover:bg-accent-700 focus:ring-base-500/50 h-10 px-5 text-sm font-medium rounded-md cursor-pointer">{t('pages.vcardExcel.ui.chooseFile')}</label>
                <input id="vcf-input" type="file" accept={accept} onChange={(e) => onChange(e, t, getTypeLabel)} className="hidden" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {notice && (
          <div role="alert" aria-live="polite" className="mt-4 p-4 bg-accent-50 rounded-xl ring-1 ring-base-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-accent-700">{notice.text}</p>
              </div>
              <button onClick={() => setNotice(null)} aria-label={t('pages.vcardExcel.ui.notice.closeLabel')} className="inline-flex items-center justify-center h-8 w-8 rounded-md text-base-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-accent-500">×</button>
            </div>
            {fileName && rows.length > 0 && (
              <div className="mt-2 text-xs text-base-500">{t('pages.vcardExcel.ui.fileNamePrefix')}{fileName}</div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-base-600">{t('pages.vcardExcel.ui.parsedCount', { count: rows.length })}</div>
          <button onClick={download} className="inline-flex items-center justify-center transition-all duration-200 ring-1 focus:ring-2 ring-accent-700 focus:outline-none text-base-50 bg-accent-600 hover:bg-accent-700 focus:ring-base-500/50 h-10 px-5 text-sm font-medium rounded-md">{t('pages.vcardExcel.ui.downloadButton')}</button>
        </div>
      </div>
      <div className="mb-2 p-4 bg-accent-50 rounded-xl mt-6 ring-1 ring-base-200">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2h2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5Z" clipRule="evenodd"></path>
          </svg>
          <p className="text-sm font-medium text-accent-700">
            <span className="mr-1">✅</span>
            <strong>{t('pages.vcardExcel.ui.securityTitle')}</strong>
            {t('pages.vcardExcel.ui.securityDesc')}
          </p>
        </div>
      </div>
    </div>
    )
  }
  return (
    <I18nextProvider i18n={i18nClient}>
      <Content />
    </I18nextProvider>
  )
}
