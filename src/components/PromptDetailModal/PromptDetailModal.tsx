import { useEffect } from 'react'
import type { PromptDetailModalProps } from './PromptDetailModal.types'

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mr-[2px]">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mr-[2px]">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    if (line === '') {
      nodes.push(<div key={key++} className="h-3" />)
      continue
    }
    // Bold heading: **text**
    if (/^\*\*(.+)\*\*$/.test(line)) {
      const content = line.replace(/^\*\*|\*\*$/g, '')
      const isSectionHeading = /^\d+\./.test(content) || content === 'Top Dentists Near You'
      nodes.push(
        <p
          key={key++}
          className={`text-[16px] text-[#212121] leading-[27px] mb-2 ${isSectionHeading ? 'text-[20px]' : ''}`}
          style={{ fontFamily: 'Inter, Roboto, sans-serif', fontWeight: 600 }}
        >
          {content}
        </p>
      )
      continue
    }
    // Normal paragraph — inline bold (**...**)
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    nodes.push(
      <p key={key++} className="text-[16px] text-[#212121] leading-[27px] font-normal mb-2" style={{ fontFamily: 'Inter, Roboto, sans-serif' }}>
        {parts.map((part, i) => {
          if (/^\*\*[^*]+\*\*$/.test(part)) {
            return <span key={i} style={{ fontWeight: 600 }}>{part.replace(/\*\*/g, '')}</span>
          }
          return part
        })}
      </p>
    )
  }

  return nodes
}

export function PromptDetailModal({ open, prompt, platform, onClose }: PromptDetailModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !prompt) return null

  const aiText = prompt.aiResponse?.[platform as keyof typeof prompt.aiResponse]

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[120] bg-black/20"
        onClick={onClose}
      />

      {/* Scrollable container */}
      <div className="fixed inset-0 z-[121] overflow-y-auto">
        <div
          className="relative bg-white mx-auto flex flex-col"
          style={{
            borderRadius: 8,
            marginTop: 65,
            marginBottom: 40,
            width: '92%',
            maxWidth: 1200,
            boxShadow: 'rgba(33, 33, 33, 0.18) 0px 4px 8px 0px',
            overflow: 'clip',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky header */}
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4">
            <div className="flex flex-col gap-[4px]">
              <p className="text-[16px] text-[#1f2328] leading-[24px] font-normal m-0">
                {prompt.prompt as string}
              </p>
              <div className="flex items-center gap-[4px]">
                {prompt.date && (
                  <span className="flex items-center text-[12px] text-[#555] leading-[18px] tracking-[-0.24px]">
                    <CalendarIcon />
                    {prompt.date as string}
                  </span>
                )}
                {prompt.location && (
                  <span className="flex items-center text-[12px] text-[#555] leading-[18px] tracking-[-0.24px]">
                    <PinIcon />
                    {prompt.location as string}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#f5f5f5] transition-colors"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div
            className="mx-5 mb-5 mt-0 border border-[#eaeaea] rounded-[8px] overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            <div className="pt-[38px] pl-[50px] pr-[37px] pb-[24px] flex flex-col gap-[36px] relative">
              {/* Platform label */}
              <p
                className="absolute top-[38px] left-[50px] text-[16px] text-[#212121] leading-[27px]"
                style={{ fontFamily: 'Inter, Roboto, sans-serif', fontWeight: 600 }}
              >
                {platform}
              </p>

              <div className="w-[70%] mx-auto flex flex-col gap-[66px]">
                {/* User bubble */}
                <div className="flex justify-end">
                  <div
                    className="text-[16px] text-[#212121] leading-[27px] font-normal px-4 py-3"
                    style={{
                      fontFamily: 'Inter, Roboto, sans-serif',
                      background: 'rgb(244, 244, 244)',
                      borderRadius: 24,
                      maxWidth: 558,
                    }}
                  >
                    {prompt.prompt as string}
                  </div>
                </div>

                {/* AI response */}
                <div className="flex flex-col gap-[34px]">
                  {aiText ? (
                    <div>{renderMarkdown(aiText)}</div>
                  ) : (
                    <p className="text-[16px] text-[#555] leading-[27px] font-normal" style={{ fontFamily: 'Inter, Roboto, sans-serif' }}>
                      No response available for {platform} on this prompt.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
