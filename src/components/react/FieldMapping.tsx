import React, { useEffect, useMemo, useState } from 'react'
import { FN, TEL, ORG, NOTE, EMAIL, ADR, LABEL, FIELDS_V3, FIELDS_V4, VCardTypeTel, VCardTypeEmail, VCardTypeAdr, VCardTypeV4Common, VCardTypeTelZh, VCardTypeEmailZh, VCardTypeAdrZh } from './vCard'

type Props = {
  version: '3.0' | '4.0'
  columns: string[]
  sampleRows: Array<Record<string, any>>
  onChange?: (mapping: Record<string, string>) => void
}

const TARGETS = [
  { key: 'fullName', label: '全名/显示名称', required: true },
  { key: 'phone', label: '手机号', required: true },
  { key: 'company', label: '公司/组织', required: false },
  { key: 'notes', label: '备注', required: false },
]

function suggestTargetForColumn(col: string) {
  const l = col.toLowerCase()
  if (/name|姓名|full|显示/.test(l)) return FN.key
  if (/phone|mobile|tel|电话|手机号/.test(l)) return TEL.key
  if (/company|org|组织|单位/.test(l)) return ORG.key
  if (/notes|note|备注/.test(l)) return NOTE.key
  return ''
}

export default function FieldMapping({ version, columns, sampleRows, onChange }: Props) {
  const [selectionByColumn, setSelectionByColumn] = useState<Record<string, string>>({})
  const [typeByColumn, setTypeByColumn] = useState<Record<string, string>>({})
  const [prefByColumn, setPrefByColumn] = useState<Record<string, boolean>>({})

  const supportedFields = useMemo(() => (version === '4.0' ? FIELDS_V4 : FIELDS_V3), [version])

  useEffect(() => {
    const init: Record<string, string> = {}
    const initType: Record<string, string> = {}
    for (const c of columns) init[c] = suggestTargetForColumn(c)
    for (const c of columns) {
      const k = init[c]
      if (k === TEL.key) {
        initType[c] = version === '4.0' ? VCardTypeV4Common.CELL : VCardTypeTel.CELL_V3
        prefByColumn[c] = false
      } else if (k === EMAIL.key) {
        initType[c] = VCardTypeEmail.INTERNET
        prefByColumn[c] = false
      } else if (k === ADR.key) {
        initType[c] = version === '4.0' ? VCardTypeV4Common.HOME : VCardTypeAdr.HOME_V3
        prefByColumn[c] = false
      } else if (k === ORG.key) {
        initType[c] = ''
        prefByColumn[c] = false
      } else if (k === NOTE.key) {
        initType[c] = ''
        prefByColumn[c] = false
      } else {
        initType[c] = ''
        prefByColumn[c] = false
      }
    }
    setSelectionByColumn(init)
    setTypeByColumn(initType)
    setPrefByColumn({ ...prefByColumn })
  }, [columns])

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

  useEffect(() => {
    onChange?.(mapping)
  }, [mapping, onChange])

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
      <div className="text-xs text-base-600">以下为您上传的字段，请为每个字段选择匹配的 vCard 标准字段。请确保“全名”和“手机号”至少各选择一次。</div>
      <div className="mt-4 h-64 overflow-auto rounded-xl ring-1 ring-base-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-base-50 text-base-600 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left w-1/2">上传字段</th>
              <th className="px-3 py-2 text-left">映射到 vCard 字段</th>
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
                      <option value="">忽略此列</option>
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
                        <option value="">类型</option>
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
                        ).map((t) => (
                          <option key={t} value={t}>{(selectionByColumn[col] === TEL.key ? VCardTypeTelZh[t] : selectionByColumn[col] === EMAIL.key ? VCardTypeEmailZh[t] : VCardTypeAdrZh[t]) || t}</option>
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
                        首选(PREF)
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
          请至少选择一次“全名”和“手机号”。当前缺少：
          {!mapping.fullName ? ' 全名' : ''}{!mapping.phone ? ' 手机号' : ''}
        </div>
      )}

      <div className="mt-6">
        <div className="text-sm font-semibold text-black">数据样本预览（前 5 行）</div>
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

