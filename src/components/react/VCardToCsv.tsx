import React, { useState, useRef, useEffect } from 'react'
import * as VCF from 'vcf'
import * as XLSX from 'xlsx'
import { useVCardTypes } from './vCard'
import i18next from 'i18next'
import { I18nextProvider, useTranslation } from 'react-i18next'

// --- Icons (Replicating Lucide icons with SVG) ---
const IconUpload = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
  </svg>
)
const IconFileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />
  </svg>
)
const IconTable = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="3" x2="21" y1="15" y2="15" /><line x1="12" x2="12" y1="3" y2="21" />
  </svg>
)
const IconDownload = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
  </svg>
)
const IconSettings = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
  </svg>
)
const IconCheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
  </svg>
)
const IconAlertCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
)
const IconX = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
)
const IconArrowRightLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" />
  </svg>
)

// --- Types & Helpers ---
type Row = Record<string, string>

// I18n setup
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
    ADR_Street: parts0[2] || '',
    ADR_City: parts0[3] || '',
    ADR_Region: parts0[4] || '',
    ADR_Postal: parts0[5] || '',
    ADR_Country: parts0[6] || '',
  }
  return row
}

// --- Main Component ---
const VCardToCsvContent = ({ accept, onFileRef }: { accept: string, onFileRef: any }) => {
  const { t } = useTranslation('common')
  const { getTypeLabel } = useVCardTypes()

  const [step, setStep] = useState(1) // 1: Upload, 2: Preview, 3: Success
  const [rows, setRows] = useState<Row[]>([])
  const [fileName, setFileName] = useState('')
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx')
  const [dragOver, setDragOver] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Field Mapping State
  // Initialize with keys, labels will be updated via useEffect/t
  const [columns, setColumns] = useState([
    { key: 'FN', label: 'FN', enabled: true },
    { key: 'TELs', label: 'TELs', enabled: true },
    { key: 'EMAILs', label: 'EMAILs', enabled: true },
    { key: 'ORG', label: 'ORG', enabled: true },
    { key: 'TITLE', label: 'TITLE', enabled: true },
    { key: 'ADRs', label: 'ADRs', enabled: true },
    { key: 'NOTE', label: 'NOTE', enabled: false },
    { key: 'LABELs', label: 'LABELs', enabled: false },
    { key: 'N_Last', label: 'N_Last', enabled: false },
    { key: 'N_First', label: 'N_First', enabled: false },
    { key: 'ADR_Street', label: 'ADR_Street', enabled: false },
    { key: 'ADR_City', label: 'ADR_City', enabled: false },
    { key: 'ADR_Region', label: 'ADR_Region', enabled: false },
    { key: 'ADR_Postal', label: 'ADR_Postal', enabled: false },
    { key: 'ADR_Country', label: 'ADR_Country', enabled: false },
  ])

  // Update column labels when language changes
  useEffect(() => {
    setColumns(prev => prev.map(col => ({
      ...col,
      label: t(`pages.vcardExcel.ui.preview.columns.${col.key}`, col.label)
    })))
  }, [t])

  const toggleColumn = (key: string) => {
    setColumns(prev => prev.map(c => c.key === key ? { ...c, enabled: !c.enabled } : c))
  }

  const isAccepted = (file: File) => {
    const tokens = accept.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    const name = (file.name || '').toLowerCase()
    const type = (file.type || '').toLowerCase()
    return tokens.some((t) => (t.startsWith('.') ? name.endsWith(t) : type === t))
  }

  const processFile = async (file: File) => {
    if (!isAccepted(file)) {
      setNotice({ type: 'error', text: t('pages.vcardExcel.ui.notice.unsupportedType', { name: file.name, accept }) })
      return
    }
    try {
      const text = await file.text()
      const cards = parseVcf(text)
      const data = cards.map((c) => cardToRow(c, getTypeLabel))
      setRows(data)
      setFileName(file.name || '')
      setStep(2) // Move to preview step
      setNotice(null)
    } catch (e) {
      console.error(e)
      setNotice({ type: 'error', text: t('pages.vcardExcel.ui.preview.parseError') })
    }
  }

  // File Handlers
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0]
    if (f) processFile(f)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0]
    if (f) processFile(f)
  }

  const reset = () => {
    setStep(1)
    setRows([])
    setFileName('')
    setNotice(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const download = () => {
    if (!rows.length) return

    // Filter columns based on mapping
    const enabledKeys = columns.filter(c => c.enabled).map(c => c.key)
    const exportData = rows.map(row => {
      const newRow: Record<string, string> = {}
      enabledKeys.forEach(key => {
        newRow[key] = row[key] || ''
      })
      return newRow
    })

    const ws = XLSX.utils.json_to_sheet(exportData)

    // Set column widths (simple estimation)
    const wscols = enabledKeys.map(() => ({ wch: 20 }))
    ws['!cols'] = wscols

    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Contacts')
      XLSX.writeFile(wb, `contacts-${Date.now()}.xlsx`)
    } else {
      const csv = XLSX.utils.sheet_to_csv(ws, { RS: '\r\n' })
      // Add BOM for Excel to correctly read UTF-8 CSV
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contacts-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    setStep(3) // Move to success step
  }

  return (
    <div className="font-sans mt-10">
      <div className="max-w-6xl mx-auto">

        {/* Stepper */}
        <div className="flex justify-center mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-accent-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                {step > s ? <IconCheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 md:w-24 h-1 mx-2 rounded ${step > s ? 'bg-accent-600' : 'bg-slate-200'
                  }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div
            onDragEnter={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false) }}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`bg-white border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer group shadow-sm hover:shadow-md ${dragOver ? 'border-accent-500 bg-accent-50' : 'border-slate-300 hover:border-accent-400 hover:bg-slate-50'
              }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept={accept}
              className="hidden"
            />
            <div className="bg-accent-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
              <IconUpload className="text-accent-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-slate-800">{t('pages.vcardExcel.ui.dropHere')}</h2>
            <p className="text-slate-500 mb-6">{t('pages.vcardExcel.ui.onlyAccept', { accept })}</p>
            <span className="inline-flex items-center justify-center px-6 py-3 bg-accent-600 text-white rounded-xl font-semibold shadow-lg shadow-accent-200 hover:bg-accent-700 transition-all">
              {t('pages.vcardExcel.ui.chooseFile')}
            </span>
          </div>
        )}

        {/* Step 2: Preview & Mapping */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sidebar Settings */}
            <div className="lg:col-span-1 space-y-6">
              {/* Export Config */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-5 text-slate-800 font-bold border-b pb-3">
                  <IconSettings className="w-5 h-5 text-accent-600" />
                  <h3>{t('pages.vcardExcel.ui.preview.configTitle')}</h3>
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {columns.map((col) => (
                    <label key={col.key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <span className="text-sm font-medium text-slate-700">{col.label}</span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={col.enabled}
                          onChange={() => toggleColumn(col.key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>


            </div>

            {/* Preview Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <IconTable className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-slate-700">{t('pages.vcardExcel.ui.preview.tableTitle')}</span>
                  </div>
                  <div className="text-xs text-slate-400">{t('pages.vcardExcel.ui.preview.totalCount', { count: rows.length })}</div>
                </div>
                <div className="overflow-auto flex-1 custom-scrollbar">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr>
                        {columns.filter(c => c.enabled).map((col) => (
                          <th key={col.key} className="p-4 font-semibold text-slate-600 bg-slate-50/80 backdrop-blur border-b border-slate-200 whitespace-nowrap">
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.slice(0, 100).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          {columns.filter(c => c.enabled).map((col) => (
                            <td key={col.key} className="p-4 text-slate-600 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis" title={row[col.key]}>
                              {row[col.key] || <span className="text-slate-300">-</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {rows.length === 0 && (
                    <div className="p-10 text-center text-slate-400">
                      {t('pages.vcardExcel.ui.preview.noData')}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              {/* Action Card */}
              <div className="bg-accent-600 p-6 rounded-2xl text-white shadow-xl shadow-accent-200/50">
                <h4 className="font-bold text-lg mb-2">{t('pages.vcardExcel.ui.export.title')}</h4>
                <p className="text-accent-100 text-sm mb-6">
                  <span dangerouslySetInnerHTML={{ __html: t('pages.vcardExcel.ui.export.desc', { count: rows.length }) }} />
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white/10 p-3 rounded-xl">
                    <label className="text-xs text-accent-100 block mb-1.5 font-medium">{t('pages.vcardExcel.ui.downloadFormat')}</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setFormat('xlsx')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${format === 'xlsx' ? 'bg-white text-accent-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
                      >
                        Excel
                      </button>
                      <button 
                        onClick={() => setFormat('csv')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${format === 'csv' ? 'bg-white text-accent-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
                      >
                        CSV
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={download}
                    className="w-full bg-white text-accent-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <IconDownload className="w-5 h-5" />
                    {t('pages.vcardExcel.ui.downloadButton')}
                  </button>
                  
                  <button 
                    onClick={reset}
                    className="w-full py-2 text-accent-100 text-sm hover:text-white transition-colors"
                  >
                    {t('pages.vcardExcel.ui.export.cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="max-w-md mx-auto bg-white p-12 rounded-3xl shadow-xl text-center animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <IconCheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('pages.vcardExcel.ui.success.title')}</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: t('pages.vcardExcel.ui.success.desc', { format: format.toUpperCase() }) }} />
            </p>
            <div className="space-y-3">
              <button 
                onClick={download}
                className="w-full bg-accent-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-accent-200 hover:bg-accent-700 transition-all flex items-center justify-center gap-2"
              >
                <IconDownload className="w-5 h-5" />
                {t('pages.vcardExcel.ui.success.downloadAgain')}
              </button>
              <button 
                onClick={reset}
                className="w-full bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-200"
              >
                {t('pages.vcardExcel.ui.success.convertAnother')}
              </button>
            </div>
          </div>
        )}

        {/* Info / Tips Section */}
        {step === 1 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 hover:border-blue-200 transition-colors">
              <div className="text-blue-600 shrink-0"><IconAlertCircle className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">{t('pages.vcardExcel.ui.securityTitle')}</h4>
                <p className="text-blue-800/70 text-sm leading-relaxed">{t('pages.vcardExcel.ui.securityDesc')}</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 bg-purple-50/50 rounded-2xl border border-purple-100/50 hover:border-purple-200 transition-colors">
              <div className="text-purple-600 shrink-0"><IconArrowRightLeft className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-purple-900 mb-1">{t('pages.vcardExcel.ui.features.multiFormat.title')}</h4>
                <p className="text-purple-800/70 text-sm leading-relaxed">{t('pages.vcardExcel.ui.features.multiFormat.desc')}</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 hover:border-emerald-200 transition-colors">
              <div className="text-emerald-600 shrink-0"><IconFileText className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-emerald-900 mb-1">{t('pages.vcardExcel.ui.features.smartParse.title')}</h4>
                <p className="text-emerald-800/70 text-sm leading-relaxed">{t('pages.vcardExcel.ui.features.smartParse.desc')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Notice */}
        {notice && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-xl shadow-2xl border border-slate-200 flex items-center gap-4 animate-in slide-in-from-bottom-4 z-50">
            <div className={`p-2 rounded-full ${notice.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {notice.type === 'error' ? <IconAlertCircle className="w-5 h-5" /> : <IconCheckCircle2 className="w-5 h-5" />}
            </div>
            <p className="text-slate-700 font-medium">{notice.text}</p>
            <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-slate-600 ml-2">
              <IconX className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default function VCardToCsv({ accept = '.vcf,text/vcard', locale = 'zh', translations }: { accept?: string, locale?: string, translations?: any }) {
  setupI18n(locale, translations)
  return (
    <I18nextProvider i18n={i18nClient}>
      <VCardToCsvContent accept={accept} onFileRef={null} />
    </I18nextProvider>
  )
}
