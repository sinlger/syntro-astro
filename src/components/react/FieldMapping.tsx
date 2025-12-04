import React, { useEffect, useMemo, useState } from 'react'

type Props = {
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

function suggest(cols: string[], key: string) {
  const lower = cols.map((c) => ({ c, l: c.toLowerCase() }))
  if (key === 'fullName') {
    const hit = lower.find(({ l }) => /name|姓名|full|显示/.test(l))
    return hit?.c || ''
  }
  if (key === 'phone') {
    const hit = lower.find(({ l }) => /phone|mobile|tel|电话|手机号/.test(l))
    return hit?.c || ''
  }
  if (key === 'company') {
    const hit = lower.find(({ l }) => /company|org|组织|单位/.test(l))
    return hit?.c || ''
  }
  if (key === 'notes') {
    const hit = lower.find(({ l }) => /notes|note|备注/.test(l))
    return hit?.c || ''
  }
  return ''
}

export default function FieldMapping({ columns, sampleRows, onChange }: Props) {
  const [mapping, setMapping] = useState<Record<string, string>>({})

  useEffect(() => {
    const init: Record<string, string> = {}
    for (const t of TARGETS) init[t.key] = suggest(columns, t.key) || ''
    setMapping(init)
  }, [columns])

  useEffect(() => {
    onChange?.(mapping)
  }, [mapping, onChange])

  const preview = useMemo(() => {
    const head = [
      { key: 'fullName', label: '姓名' },
      { key: 'phone', label: '电话号码' },
      { key: 'company', label: '公司' },
      { key: 'notes', label: '备注' },
    ]
    const rows = (sampleRows || []).slice(0, 5).map((r) => ({
      fullName: mapping.fullName ? String(r[mapping.fullName] ?? '') : '',
      phone: mapping.phone ? String(r[mapping.phone] ?? '') : '',
      company: mapping.company ? String(r[mapping.company] ?? '') : '',
      notes: mapping.notes ? String(r[mapping.notes] ?? '') : '',
    }))
    return { head, rows }
  }, [sampleRows, mapping])

  return (
    <div className="mt-6">
      <div className="text-sm text-base-600">系统已根据您的列名进行了智能匹配。请确保“全名”和“手机号”被正确映射。</div>
      <div className="mt-6 space-y-4">
        {TARGETS.map((t) => (
          <div key={t.key} className="rounded-xl bg-white ring-1 ring-base-200">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-4 md:border-r md:border-base-200">
                <div className="text-sm text-base-600">您的列</div>
                <div className="mt-2">
                  <select
                    value={mapping[t.key] ?? ''}
                    onChange={(e) => setMapping((m) => ({ ...m, [t.key]: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md ring-1 ring-base-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="">忽略此列</option>
                    {columns.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm text-base-600">映射到</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-base font-medium text-black">{t.label}</div>
                  {t.required && (
                    <span className="text-xs text-red-600">必选</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="text-sm font-semibold text-black">数据样本预览（前 5 行）</div>
        <div className="mt-3 overflow-x-auto rounded-xl ring-1 ring-base-200">
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

