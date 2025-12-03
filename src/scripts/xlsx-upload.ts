import * as XLSX from 'xlsx'

function setup() {
  const trigger = document.getElementById('upload-trigger') as HTMLAnchorElement | null
  const input = document.getElementById('upload-input') as HTMLInputElement | null
  const output = document.getElementById('upload-output') as HTMLDivElement | null
  if (!trigger || !input) return

  trigger.addEventListener('click', (e) => {
    e.preventDefault()
    input.click()
  })

  input.addEventListener('change', async () => {
    const files = Array.from(input.files || []).slice(0, 3)
    const results: any[] = []
    for (const file of files) {
      const name = file.name.toLowerCase()
      try {
        if (name.endsWith('.csv')) {
          const text = await file.text()
          const wb = XLSX.read(text, { type: 'string' })
          const ws = wb.Sheets[wb.SheetNames[0]]
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[]
          results.push({ file: file.name, sheets: wb.SheetNames, preview: rows.slice(0, 10) })
        } else if (name.endsWith('.xls') || name.endsWith('.xlsx')) {
          const buf = await file.arrayBuffer()
          const wb = XLSX.read(buf)
          const ws = wb.Sheets[wb.SheetNames[0]]
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[]
          results.push({ file: file.name, sheets: wb.SheetNames, preview: rows.slice(0, 10) })
        }
      } catch (err) {
        results.push({ file: file.name, error: String(err) })
      }
    }
    if (output) output.textContent = JSON.stringify(results, null, 2)
    input.value = ''
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup)
} else {
  setup()
}

