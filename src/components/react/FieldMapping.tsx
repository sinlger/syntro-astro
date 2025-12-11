import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FN, TEL, ORG, NOTE, EMAIL, ADR, LABEL, FIELDS_V3, FIELDS_V4, VCardTypeTel, VCardTypeEmail, VCardTypeAdr, VCardTypeV4Common, VCardTypeTelZh, VCardTypeEmailZh, VCardTypeAdrZh } from './vCard'

type Props = {
  version: '3.0' | '4.0'
  columns: string[]
  sampleRows: Array<Record<string, any>>
  onChange?: (mapping: Record<string, string>) => void
}


function suggestTargetForColumn(col: string) {
  const l = col.toLowerCase()
  if (/name|姓名|full|显示/.test(l)) return FN.key
  if (/phone|mobile|tel|电话|手机号/.test(l)) return TEL.key
  if (/company|org|组织|单位/.test(l)) return ORG.key
  if (/notes|note|备注/.test(l)) return NOTE.key
  return ''
}

export default function FieldMapping({ version, columns, sampleRows, onChange }: Props) {
  console.log(version, columns, sampleRows, onChange)
  const { t } = useTranslation('common')
  const [selectionByColumn, setSelectionByColumn] = useState<Record<string, string>>({})
  const [typeByColumn, setTypeByColumn] = useState<Record<string, string>>({})
  const [prefByColumn, setPrefByColumn] = useState<Record<string, boolean>>({})

  const supportedFields = useMemo(() => (version === '4.0' ? FIELDS_V4 : FIELDS_V3), [version])

  useEffect(() => {
    const nextInit: Record<string, string> = {}
    const nextType: Record<string, string> = {}
    const nextPref: Record<string, boolean> = {}

    for (const c of columns) {
      nextInit[c] = suggestTargetForColumn(c)
    }

    for (const c of columns) {
      const k = nextInit[c]
      if (k === TEL.key) {
        nextType[c] = version === '4.0' ? VCardTypeV4Common.CELL : VCardTypeTel.CELL_V3
        nextPref[c] = false
      } else if (k === EMAIL.key) {
        nextType[c] = VCardTypeEmail.INTERNET
        nextPref[c] = false
      } else if (k === ADR.key) {
        nextType[c] = version === '4.0' ? VCardTypeV4Common.HOME : VCardTypeAdr.HOME_V3
        nextPref[c] = false
      } else if (k === ORG.key) {
        nextType[c] = ''
        nextPref[c] = false
      } else if (k === NOTE.key) {
        nextType[c] = ''
        nextPref[c] = false
      } else {
        nextType[c] = ''
        nextPref[c] = false
      }
    }
    setSelectionByColumn(nextInit)
    setTypeByColumn(nextType)
    setPrefByColumn(nextPref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.join(','), version])

  const mapping = useMemo(() => {
    const invert = Object.entries(selectionByColumn)
    const pick = (key: string) => {
      const hit = invert.find(([, v]) => v === key)
      return hit ? hit[0] : ''
    }
    const phoneCol = pick(TEL.key)
    const emailCol = pick(EMAIL.key)
    const adrCol = pick(ADR.key)
    const fields = Object.entries(selectionByColumn)
      .filter(([, sel]) => !!sel)
      .map(([col, sel]) => ({ fieldKey: sel, column: col, type: typeByColumn[col] || '', pref: !!prefByColumn[col] }))
    return {
      fullName: pick(FN.key),
      phone: pick(TEL.key),
      company: pick(ORG.key),
      notes: pick(NOTE.key),
      phoneType: phoneCol ? (typeByColumn[phoneCol] ?? '') : '',
      emailType: emailCol ? (typeByColumn[emailCol] ?? '') : '',
      adrType: adrCol ? (typeByColumn[adrCol] ?? '') : '',
      phonePref: phoneCol ? !!prefByColumn[phoneCol] : false,
      emailPref: emailCol ? !!prefByColumn[emailCol] : false,
      phoneTypeZh: phoneCol ? (VCardTypeTelZh[typeByColumn[phoneCol] ?? ''] ?? '') : '',
      emailTypeZh: emailCol ? (VCardTypeEmailZh[typeByColumn[emailCol] ?? ''] ?? '') : '',
      adrTypeZh: adrCol ? (VCardTypeAdrZh[typeByColumn[adrCol] ?? ''] ?? '') : '',
      fields,
    }
  }, [selectionByColumn, typeByColumn, prefByColumn])

  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const prevMappingRef = useRef<string>('')
  useEffect(() => {
    const s = JSON.stringify(mapping)
    if (s !== prevMappingRef.current) {
      prevMappingRef.current = s
      onChangeRef.current?.(mapping)
    }
  }, [mapping])

  const preview = useMemo(() => {
    const mapped = Object.entries(selectionByColumn)
      .filter(([, sel]) => !!sel)
      .map(([col, sel]) => ({ col, field: supportedFields.find((f) => f.key === sel) }))
      .filter((e) => !!e.field) as Array<{ col: string; field: typeof supportedFields[number] }>

    const head = mapped.map(({ col, field }) => ({ key: `${field.key}:${col}`, label: `${field.zh}（${field.key}）` }))

    const rows = (sampleRows || []).map((r) => {
      const obj: Record<string, any> = {}
      mapped.forEach(({ col, field }) => {
        obj[`${field.key}:${col}`] = String((r as any)[col] ?? '')
      })
      return obj
    })

    return { head, rows }
  }, [sampleRows, selectionByColumn, supportedFields])

  return (
    <div className="mt-6">
      <div className="text-xs text-base-600">{t('pages.csv.mapping.instructions')}</div>
      <div className="mt-4 h-64 overflow-auto rounded-xl ring-1 ring-base-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-base-50 text-base-600 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left w-1/2">{t('pages.csv.mapping.th.source')}</th>
              <th className="px-3 py-2 text-left">{t('pages.csv.mapping.th.target')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {columns.map((col) => (
              <tr key={col} className="align-middle">
                <td className="px-3 py-2 text-base font-medium text-black">{col}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2 items-center">
                    <select
                      value={selectionByColumn[col] ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        setSelectionByColumn((m) => ({ ...m, [col]: value }))
                        let def = ''
                        if (value === TEL.key) {
                          def = version === '4.0' ? VCardTypeV4Common.CELL : VCardTypeTel.CELL_V3
                        }
                        setTypeByColumn((m) => ({ ...m, [col]: def }))
                      }}
                      className="w-full h-9 px-2 rounded-md ring-1 ring-base-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                    >
                      <option value="">{t('pages.csv.mapping.ignoreColumn')}</option>
                      {supportedFields.map((f) => (
                        <option key={f.key} value={f.key}>{f.zh}（{f.key}）</option>
                      ))}
                    </select>
                    {(selectionByColumn[col] === TEL.key || selectionByColumn[col] === EMAIL.key || selectionByColumn[col] === ADR.key) && (
                      <select
                        value={typeByColumn[col] ?? ''}
                        onChange={(e) => {
                          const value = e.target.value
                          setTypeByColumn((m) => ({ ...m, [col]: value }))
                        }}
                        className="h-9 w-40 px-2 rounded-md ring-1 ring-base-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                      >
                        <option value="">{t('pages.csv.mapping.typeLabel')}</option>
                        {(
                          selectionByColumn[col] === TEL.key
                            ? (version === '4.0'
                                ? [VCardTypeV4Common.CELL, VCardTypeV4Common.VOICE, VCardTypeV4Common.WORK, VCardTypeV4Common.HOME, VCardTypeV4Common.FAX, VCardTypeV4Common.TEXT, VCardTypeV4Common.VIDEO, VCardTypeV4Common.PAGER, VCardTypeV4Common.TEXTPHONE]
                                : [VCardTypeTel.CELL_V3, VCardTypeTel.VOICE_V3, VCardTypeTel.WORK_V3, VCardTypeTel.HOME_V3, VCardTypeTel.FAX_V3, VCardTypeTel.PAGER_V3]
                              )
                            : selectionByColumn[col] === EMAIL.key
                              ? [VCardTypeEmail.INTERNET, VCardTypeEmail.A400]
                              : selectionByColumn[col] === ADR.key
                                ? (version === '4.0'
                                    ? [VCardTypeV4Common.HOME, VCardTypeV4Common.WORK, 'dom', 'intl']
                                    : [VCardTypeAdr.HOME_V3, VCardTypeAdr.WORK_V3, VCardTypeAdr.POSTAL_V3, VCardTypeAdr.PARCEL_V3]
                                  )
                                : []
                        ).map((tKey) => (
                          <option key={tKey} value={tKey}>{(selectionByColumn[col] === TEL.key ? VCardTypeTelZh[tKey] : selectionByColumn[col] === EMAIL.key ? VCardTypeEmailZh[tKey] : VCardTypeAdrZh[tKey]) || tKey}</option>
                        ))}
                      </select>
                    )}
                    {(selectionByColumn[col] === TEL.key || selectionByColumn[col] === EMAIL.key) && (
                      <label className="flex items-center gap-1 text-xs text-base-600">
                        <input
                          type="checkbox"
                          checked={!!prefByColumn[col]}
                          onChange={(e) => setPrefByColumn((m) => ({ ...m, [col]: e.target.checked }))}
                        />
                        {t('pages.csv.mapping.prefLabel')}
                      </label>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!mapping.fullName || !mapping.phone) && (
        <div className="mt-3 p-3 rounded-md bg-red-50 ring-1 ring-red-200 text-red-700 text-xs">
          {t('pages.csv.mapping.missingRequiredPrefix')}
          {!mapping.fullName ? ` ${t('pages.csv.mapping.targets.fullName')}` : ''}{!mapping.phone ? ` ${t('pages.csv.mapping.targets.phone')}` : ''}
        </div>
      )}

      <div className="mt-6">
        <div className="text-sm font-semibold text-black">{t('pages.csv.mapping.previewTitle')}</div>
        <div className="mt-2 overflow-x-auto rounded-xl ring-1 ring-base-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-base-50 text-base-600">
              <tr>
                {preview.head.map((h) => (
                  <th key={h.key} className="px-4 py-2 text-left">{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {preview.rows.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="border-t border-base-200">
                  {preview.head.map((h) => (
                    <td key={h.key} className="px-4 py-2">{(row as any)[h.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
