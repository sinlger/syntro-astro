import React, { useEffect, useMemo, useState } from 'react'
import { FN, TEL, ORG, NOTE, FIELDS_V3, FIELDS_V4 } from './vCard'

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

  const supportedFields = useMemo(() => (version === '4.0' ? FIELDS_V4 : FIELDS_V3), [version])

  useEffect(() => {
    const init: Record<string, string> = {}
    for (const c of columns) init[c] = suggestTargetForColumn(c)
    setSelectionByColumn(init)
  }, [columns])

  const mapping = useMemo(() => {
    const invert = Object.entries(selectionByColumn)
    const pick = (key: string) => {
      const hit = invert.find(([, v]) => v === key)
      return hit ? hit[0] : ''
    }
    return {
      fullName: pick(FN.key),
      phone: pick(TEL.key),
      company: pick(ORG.key),
      notes: pick(NOTE.key),
    }
  }, [selectionByColumn])

  useEffect(() => {
    onChange?.(mapping)
  }, [mapping, onChange])

  const preview = useMemo(() => {
    const mapped = Object.entries(selectionByColumn)
      .filter(([, sel]) => !!sel)
      .map(([col, sel]) => ({ col, field: supportedFields.find((f) => f.key === sel) }))
      .filter((e) => !!e.field) as Array<{ col: string; field: typeof supportedFields[number] }>

    const head = mapped.map(({ col, field }) => ({ key: `${field.key}:${col}`, label: `${field.zh}（${field.key}）` }))

    const rows = (sampleRows || []).slice(0, 5).map((r) => {
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
                  <select
                    value={selectionByColumn[col] ?? ''}
                    onChange={(e) => setSelectionByColumn((m) => ({ ...m, [col]: e.target.value }))}
                    className="w-full h-9 px-2 rounded-md ring-1 ring-base-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="">忽略此列</option>
                    {supportedFields.map((f) => (
                      <option key={f.key} value={f.key}>{f.zh}（{f.key}）</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              {preview.rows.map((row, idx) => (
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

