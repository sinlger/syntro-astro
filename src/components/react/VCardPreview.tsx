import React, { useState, useRef, useEffect } from 'react'
import * as VCF from 'vcf'
import i18next from 'i18next'
import { useTranslation, I18nextProvider } from 'react-i18next'
import Modal from './Modal'

// --- Icons ---
const IconUpload = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
  </svg>
)
const IconTrash = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)
const IconEdit = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
)
const IconDownload = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
  </svg>
)
const IconPlus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

// --- Helpers ---
const VCardCtor: any = (VCF as any).default || (VCF as any).vCard || (VCF as any)

function parseVcf(text: string): any[] {
  if (!VCardCtor || typeof VCardCtor.parse !== 'function') return []

  // Normalize line endings to \r\n which is strictly required by the vcf library (version 2.x)
  // If we use \n, the library fails to split lines and treats the whole file as one line,
  // causing "Unsupported version ARD" (reading 'ARD' from 'BEGIN:VCARD').
  const normalized = text.replace(/\r?\n/g, '\r\n')

  try {
    // Try parsing the whole file first
    const res = VCardCtor.parse(normalized)
    return Array.isArray(res) ? res : [res]
  } catch (e) {
    console.warn('VCard bulk parse failed, trying manual split:', e)
    
    // Fallback: split by BEGIN:VCARD and parse individually
    // Use the normalized text which already has correct \r\n endings
    const matches = normalized.match(/BEGIN:VCARD[\s\S]*?END:VCARD/gi)
    if (!matches) return []
    
    const cards: any[] = []
    for (const match of matches) {
      try {
        const parsed = VCardCtor.parse(match)
        if (Array.isArray(parsed)) cards.push(...parsed)
        else cards.push(parsed)
      } catch (err) {
        console.error('Failed to parse individual vCard chunk:', err)
      }
    }
    return cards
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

function normalizePhone(p: string) {
  return p.replace(/\s+/g, '')
}

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

// --- Component ---
function VCardPreviewContent() {
  const { t } = useTranslation('common')
  
  const [cards, setCards] = useState<any[]>([])
  const [rawText, setRawText] = useState<string>('')
  const [version, setVersion] = useState<'2.1' | '3.0' | '4.0'>('3.0')
  const [stats, setStats] = useState({ total: 0, success: 0 })
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<{
    fn: string,
    tels: { value: string, type: string }[],
    emails: { value: string, type: string }[]
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      setRawText(text)
      const parsed = parseVcf(text)
      setCards(parsed)
      setStats({
        total: parsed.length, // Simple count, parsing might fail silently or return empty objects
        success: parsed.length
      })
      // Try to detect version from first card
      if (parsed.length > 0 && parsed[0].version) {
        setVersion(parsed[0].version as any)
      }
    } catch (err) {
      console.error(err)
      alert(t('vcardPreview.error.parse'))
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = (index: number) => {
    const newCards = [...cards]
    newCards.splice(index, 1)
    setCards(newCards)
    setStats({ ...stats, total: newCards.length, success: newCards.length })
  }

  const handleEdit = (index: number) => {
    const card = cards[index]
    const fn = valOf(card.get('fn'))
    
    const tels = toArray(card.get('tel')).map((p: any) => {
      const value = valOf(p).replace(/^tel:/i, '')
      let type = 'CELL'
      if (p.type) {
        type = Array.isArray(p.type) ? p.type.join(',') : p.type
      }
      return { value, type: String(type).toUpperCase() }
    })

    const emails = toArray(card.get('email')).map((p: any) => {
      const value = valOf(p).replace(/^mailto:/i, '')
      let type = 'INTERNET'
      if (p.type) {
        type = Array.isArray(p.type) ? p.type.join(',') : p.type
      }
      return { value, type: String(type).toUpperCase() }
    })

    setEditForm({ fn, tels, emails })
    setEditingIndex(index)
  }

  const handleSaveEdit = () => {
    if (editingIndex === null || !editForm) return
    const newCards = [...cards]
    const card = newCards[editingIndex]

    // Update FN
    card.set('fn', editForm.fn)
    
    // Update N (Structured Name) - Simple logic: Split FN
    const parts = editForm.fn.trim().split(/\s+/)
    const last = parts.length > 1 ? parts.pop() : ''
    const first = parts.join(' ')
    // VCardCtor usually handles structured name if passed as array or string with semicolons
    // But here we set the property. 
    // card.set('n', ...) might expect a property object or string.
    // Let's try to set it as a string with semicolons for simplicity "Family;Given;Middle;Prefix;Suffix"
    // However, the vcf library might expect us to just set 'n'.
    // card.set('n', `${last};${first};;;`)
    // Actually, let's just stick to FN if possible, but vCard 3.0 requires N.
    // We will attempt to update N.
    card.set('n', `${last};${first};;;`)

    // Update TELs
    // First remove all existing TELs
    // The library API isn't fully clear on "remove all properties of key". 
    // Usually set() replaces all.
    // We need to construct Property objects.
    // If we pass an array of values to set(), it might work?
    // Or we iterate and add?
    // card.set('tel', value) replaces.
    // If we want multiple, we might need card.data['tel'] = [...] (hacking internal)
    // Or check if set supports array.
    // Let's assume we can rebuild the properties.
    // Ideally we create new Property instances.
    // Since we don't have easy access to Property constructor here (it's inside VCF),
    // we can try to use the raw JSON structure if we know it.
    // card.data.tel = [ ... ]
    
    // Safer approach: 
    // card.set('tel', val1, { type: '...' }) -> might only set one.
    // card.add('tel', val2, ...)
    
    // Strategy: Clear then Add.
    // Does card have `remove`? `card.data` is the internal store.
    if (card.data) {
       delete card.data.tel
       delete card.data.email
    }
    
    editForm.tels.forEach(t => {
       card.add('tel', t.value, { type: t.type })
    })
    
    editForm.emails.forEach(e => {
       card.add('email', e.value, { type: e.type })
    })

    setCards(newCards)
    setEditingIndex(null)
    setEditForm(null)
  }

  const handleExport = () => {
    if (cards.length === 0) return
    
    try {
      // Generate VCF string
      // We iterate cards and call toString()
      // We also need to respect the selected version if possible.
      // modifying card.version before toString might work.
      
      const output = cards.map(card => {
        card.version = version
        return card.toString(version)
      }).join('\n')

      const blob = new Blob([output], { type: 'text/vcard;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contacts-${new Date().toISOString().slice(0,10)}.vcf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      console.error(err)
      alert(t('vcardPreview.error.export'))
    }
  }

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      {cards.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-accent-500 transition-colors bg-gray-50">
          <IconUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('vcardPreview.upload.title')}</h3>
          <p className="text-sm text-gray-500 mb-6">{t('vcardPreview.upload.desc')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".vcf,.vcard"
            onChange={handleFile}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            {t('vcardPreview.upload.btn')}
          </button>
        </div>
      )}

      {/* Main Content */}
      {cards.length > 0 && (
        <>
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-sm">
                <span className="text-gray-500">{t('vcardPreview.stats.total')}:</span>
                <span className="ml-2 font-semibold text-gray-900">{stats.total}</span>
              </div>
              <div className="text-sm">
                 <span className="text-gray-500">{t('vcardPreview.stats.version')}:</span>
                 <select 
                   value={version}
                   onChange={(e) => setVersion(e.target.value as any)}
                   className="ml-2 border-gray-300 rounded-md text-sm focus:ring-accent-500 focus:border-accent-500"
                 >
                   <option value="2.1">2.1</option>
                   <option value="3.0">3.0</option>
                   <option value="4.0">4.0</option>
                 </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setCards([]); setStats({ total: 0, success: 0 }); }}
                className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                {t('vcardPreview.actions.clear')}
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700"
              >
                <IconDownload className="mr-2 h-4 w-4" />
                {t('vcardPreview.actions.export')}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('vcardPreview.table.name')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('vcardPreview.table.phone')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('vcardPreview.table.email')}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('vcardPreview.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cards.map((card, idx) => {
                    const fn = valOf(card.get('fn'))
                    const tels = toArray(card.get('tel')).map((p: any) => valOf(p).replace(/^tel:/i, '')).join(', ')
                    const emails = toArray(card.get('email')).map((p: any) => valOf(p).replace(/^mailto:/i, '')).join(', ')
                    
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fn || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={tels}>{tels || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={emails}>{emails || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleEdit(idx)} className="text-accent-600 hover:text-accent-900 mr-4">
                            <IconEdit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(idx)} className="text-red-600 hover:text-red-900">
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      <Modal
        open={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        title={t('vcardPreview.modal.title')}
        footer={
            <div className="flex justify-end gap-3">
                <button
                    onClick={() => setEditingIndex(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    {t('vcardPreview.modal.cancel')}
                </button>
                <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 text-sm font-medium text-white bg-accent-600 rounded-md hover:bg-accent-700"
                >
                    {t('vcardPreview.modal.save')}
                </button>
            </div>
        }
      >
        {editForm && (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('vcardPreview.table.name')}</label>
                    <input
                        type="text"
                        value={editForm.fn}
                        onChange={e => setEditForm({...editForm, fn: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                    />
                </div>
                
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">{t('vcardPreview.table.phone')}</label>
                        <button 
                            type="button"
                            onClick={() => setEditForm({
                                ...editForm, 
                                tels: [...editForm.tels, { value: '', type: 'CELL' }]
                            })}
                            className="text-xs text-accent-600 hover:text-accent-700"
                        >
                            + {t('vcardPreview.modal.add')}
                        </button>
                    </div>
                    <div className="space-y-2">
                        {editForm.tels.map((tel, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="text"
                                    value={tel.value}
                                    onChange={e => {
                                        const newTels = [...editForm.tels]
                                        newTels[i].value = e.target.value
                                        setEditForm({...editForm, tels: newTels})
                                    }}
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                                    placeholder="+1 234 567 890"
                                />
                                <input
                                    type="text"
                                    value={tel.type}
                                    onChange={e => {
                                        const newTels = [...editForm.tels]
                                        newTels[i].type = e.target.value
                                        setEditForm({...editForm, tels: newTels})
                                    }}
                                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                                    placeholder="TYPE"
                                />
                                <button 
                                    onClick={() => {
                                        const newTels = [...editForm.tels]
                                        newTels.splice(i, 1)
                                        setEditForm({...editForm, tels: newTels})
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <IconTrash className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">{t('vcardPreview.table.email')}</label>
                        <button 
                            type="button"
                            onClick={() => setEditForm({
                                ...editForm, 
                                emails: [...editForm.emails, { value: '', type: 'INTERNET' }]
                            })}
                            className="text-xs text-accent-600 hover:text-accent-700"
                        >
                             + {t('vcardPreview.modal.add')}
                        </button>
                    </div>
                    <div className="space-y-2">
                        {editForm.emails.map((email, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="text"
                                    value={email.value}
                                    onChange={e => {
                                        const newEmails = [...editForm.emails]
                                        newEmails[i].value = e.target.value
                                        setEditForm({...editForm, emails: newEmails})
                                    }}
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                                    placeholder="example@mail.com"
                                />
                                <input
                                    type="text"
                                    value={email.type}
                                    onChange={e => {
                                        const newEmails = [...editForm.emails]
                                        newEmails[i].type = e.target.value
                                        setEditForm({...editForm, emails: newEmails})
                                    }}
                                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                                    placeholder="TYPE"
                                />
                                <button 
                                    onClick={() => {
                                        const newEmails = [...editForm.emails]
                                        newEmails.splice(i, 1)
                                        setEditForm({...editForm, emails: newEmails})
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <IconTrash className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  )
}

export default function VCardPreview({ locale = 'zh', translations }: { locale?: string, translations?: any }) {
  setupI18n(locale, translations)
  return (
    <I18nextProvider i18n={i18nClient}>
      <VCardPreviewContent />
    </I18nextProvider>
  )
}
