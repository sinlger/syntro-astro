import React from 'react'

type ModalProps = {
  open: boolean
  title?: React.ReactNode
  onClose: () => void
  children?: React.ReactNode
  headerExtra?: React.ReactNode
  footer?: React.ReactNode
}

export default function Modal({ open, title, onClose, children, headerExtra, footer }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="flex items-center justify-center min-h-svh relative z-50">
        <div className="w-full max-w-5xl mx-8 rounded-sm bg-white ring-1 ring-base-200 shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
            <div className="text-base font-semibold text-black">{title}</div>
            <div className="flex items-center gap-2">
              {headerExtra}
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="inline-flex items-center justify-center size-8 rounded-md text-base-600 hover:text-black hover:bg-base-100"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-5">
                  <path d="M6 6l12 12M18 6L6 18" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="px-6 py-4 text-base text-base-700">{children}</div>
          {footer !== undefined ? (
            <div className="px-6 py-4 border-t border-base-200">{footer}</div>
          ) : (
            <div className="px-6 py-4 border-t border-base-200 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center transition-all duration-200 ring-1 focus:ring-2 ring-accent-700 focus:outline-none text-base-50 bg-accent-600 hover:bg-accent-700 focus:ring-base-500/50 h-9 px-4 text-sm font-medium rounded-md"
              >
                关闭
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
