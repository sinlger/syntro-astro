import * as VCF from 'vcf'

const VCardCtor: any = (VCF as any).default || (VCF as any).vCard || (VCF as any)

function setup() {
  const form = document.getElementById('vcard-form') as HTMLFormElement | null
  const output = document.getElementById('vcard-output') as HTMLTextAreaElement | null
  if (!form || !VCardCtor) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    try {
      const data = new FormData(form)
      const firstName = (data.get('firstName') || '').toString().trim()
      const lastName = (data.get('lastName') || '').toString().trim()
      const fullName = `${firstName} ${lastName}`.trim()
      const organization = (data.get('organization') || '').toString().trim()
      const email = (data.get('email') || '').toString().trim()
      const phone = (data.get('phone') || '').toString().trim()

      const card = new VCardCtor()
      if (lastName || firstName) card.set('n', `${lastName};${firstName};;;`)
      if (fullName) card.set('fn', fullName)
      if (organization) card.set('org', organization)
      if (email) card.add('email', email)
      if (phone) card.add('tel', `tel:${phone}`, { type: ['work', 'voice'], value: 'uri' })

      const vcf = card.toString('4.0')
      if (output) output.value = vcf

      const blob = new Blob([vcf], { type: 'text/vcard; charset=utf-8' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `${fullName || 'contact'}.vcf`
      a.rel = 'noopener'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 50)
    } catch (err) {
      console.error('vCard generation error:', err)
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup)
} else {
  setup()
}

