import React, { useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import * as VCF from 'vcf'
import Modal from './Modal'
import FieldMapping from './FieldMapping'
import { FN, TEL, FIELDS_V3, FIELDS_V4 } from './vCard'
const VCardCtor: any = (VCF as any).default || (VCF as any).vCard || (VCF as any)

function normalizePhone(p: string) {
  return p.replace(/\s+/g, '')
}

export default function CsvToVCardUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [open, setOpen] = useState(false)
  const [version, setVersion] = useState<'3.0' | '4.0'>('4.0')
  const [columns, setColumns] = useState<string[]>(['姓名', '电话号码', '公司', '备注'])
  const [sampleRows, setSampleRows] = useState<Record<string, any>[]>([
    { 姓名: '张三', 电话号码: '13888880001', 公司: '创新科技', 备注: 'VIP 客户' },
    { 姓名: '李四', 电话号码: '18666600002', 公司: '无', 备注: '待跟进' },
    { 姓名: '王五', 电话号码: '13577770003', 公司: '云创软件', 备注: '重要合作伙伴' },
  ])
  const [rows, setRows] = useState<Record<string, any>[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})

  const handleFiles = async (fileList: FileList | null) => {
    const file = fileList && fileList[0]
    if (!file || !VCardCtor) return

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
        setSampleRows(records.slice(0, 5))
      } else {
        const parsed = XLSX.utils.sheet_to_json(ws) as Record<string, any>[]
        setRows(parsed)
        const heads = Object.keys(parsed[0] || {})
        if (heads.length) setColumns(heads)
        setSampleRows(parsed.slice(0, 5))
      }
      setOpen(true)
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

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const onMappingChange = (m: Record<string, string>) => {
    setMapping(m)
  }

  const supportedFields = useMemo(() => (version === '4.0' ? FIELDS_V4 : FIELDS_V3), [version])

  const generateVCard = () => {
    const source = rows.length ? rows : sampleRows
    const entries = source
      .map((r) => {
        const name = mapping.fullName ? String(r[mapping.fullName] ?? '').trim() : ''
        const phoneRaw = mapping.phone ? String(r[mapping.phone] ?? '').trim() : ''
        const phone = phoneRaw ? normalizePhone(phoneRaw) : ''
        const org = mapping.company ? String(r[mapping.company] ?? '').trim() : ''
        const note = mapping.notes ? String(r[mapping.notes] ?? '').trim() : ''
        if (!name || !phone) return ''
        const lines: string[] = []
        lines.push('BEGIN:VCARD')
        lines.push(`VERSION:${version}`)
        lines.push(`FN:${name}`)
        if (version === '4.0') {
          lines.push(`TEL;TYPE=cell;VALUE=uri:tel:${phone}`)
        } else {
          lines.push(`TEL;TYPE=CELL:${phone}`)
        }
        if (org) lines.push(`ORG:${org}`)
        if (note) lines.push(`NOTE:${note}`)
        lines.push('END:VCARD')
        return lines.join('\n')
      })
      .filter(Boolean)
    const content = entries.join('\n')
    if (!content) return
    const blob = new Blob([content], { type: 'text/vcard' })
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

  return (
    <div className="rounded-2xl p-6 bg-accent-50 shadow-sm ring-1 ring-base-200 mt-10">
      <div className="flex items-center gap-2 text-base font-semibold text-black">
        <svg className="size-5 text-base-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 20h16" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 4v12" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 8l4-4 4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>选择 CSV 文件</span>
      </div>

      <div className="mt-6">
        <div className="rounded-xl p-4">
          <div
            className="rounded-xl border-2 border-dashed border-base-200 py-16 flex items-center justify-center text-center"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <div className="space-y-3">
              <svg className="mx-auto size-8 text-accent-600" viewBox="0 0 24 24" fill="currentColor">
                <g transform="translate(0,1)"><path d="M12 3l4 4h-3v5h-2V7H8l4-4Z" /></g>
                <path d="M4 16h2v3h12v-3h2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3Z" />
              </svg>
              <div className="text-base font-medium text-base-800">拖拽 CSV 到这里</div>
              <div className="text-xs text-base-500">仅支持 .csv，首行作为字段名</div>
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-base-600">vCard 版本</label>
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value as '3.0' | '4.0')}
                    className="h-9 px-3 w-50 rounded-md ring-1 ring-base-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="4.0">4.0</option>
                    <option value="3.0">3.0（推荐）</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <a
                    href="#"
                    onClick={onClickTrigger}
                    className="inline-flex items-center justify-center transition-all duration-200 ring-1 focus:ring-2 ring-accent-700 focus:outline-none text-base-50 bg-accent-600 hover:bg-accent-700 focus:ring-base-500/50 h-10 px-5 text-sm font-medium rounded-md"
                  >
                    选择文件
                  </a>
                  <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        title="字段映射：智能识别与精准校验"
        onClose={onCloseModal}
        footer={
          <div className="flex items-center justify-between">
            <div className="text-xs text-base-600">当前版本支持字段数 {supportedFields.length}</div>
            <button
              type="button"
              onClick={generateVCard}
              disabled={!mapping.fullName || !mapping.phone}
              className="inline-flex items-center justify-center transition-all duration-200 ring-1 focus:ring-2 ring-accent-700 focus:outline-none text-base-50 bg-accent-600 hover:bg-accent-700 focus:ring-base-500/50 h-9 px-4 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              导出 vCard
            </button>
          </div>
        }
      >
        <div className="max-w-5xl ">
          <div className="text-xs text-base-600">请确保 {FN.zh} 与 {TEL.zh} 被正确映射。当前版本支持字段数 {supportedFields.length}。</div>
          <FieldMapping version={version} columns={columns} sampleRows={sampleRows} onChange={onMappingChange} />
        </div>
      </Modal>
    </div>
  )
}
