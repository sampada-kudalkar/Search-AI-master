import { useRef, useState } from 'react'
import { AiIcon, CardHeader, Icon, Toast } from '../components'
import { AI_SITE_COLORS } from '../components/ThemesPromptsTable/ThemesPromptsTable'
import { DEFAULT_SITE_ORDER, type SiteOrderItem } from '../data/siteOrderData'

function isSameOrder(a: SiteOrderItem[], b: SiteOrderItem[]) {
  return a.length === b.length && a.every((item, i) => item.id === b[i].id)
}

export function SiteOrderSettingsScreen() {
  const [savedOrder, setSavedOrder] = useState<SiteOrderItem[]>(DEFAULT_SITE_ORDER)
  const [order, setOrder] = useState<SiteOrderItem[]>(DEFAULT_SITE_ORDER)
  const [toastVisible, setToastVisible] = useState(false)
  const dragIndex = useRef<number | null>(null)

  const dirty = !isSameOrder(order, savedOrder)
  const savedIsDefault = isSameOrder(savedOrder, DEFAULT_SITE_ORDER)

  function handleCancel() {
    setOrder(savedOrder)
  }

  function handleSave() {
    setSavedOrder(order)
    setToastVisible(true)
  }

  function handleRestoreDefault() {
    setOrder(DEFAULT_SITE_ORDER)
  }

  function onDragOverRow(targetIndex: number) {
    const from = dragIndex.current
    if (from === null || from === targetIndex) return
    setOrder((items) => {
      const next = [...items]
      const [moved] = next.splice(from, 1)
      next.splice(targetIndex, 0, moved)
      return next
    })
    dragIndex.current = targetIndex
  }

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
      <Toast
        message="Site order saved."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
      <div className="flex shrink-0 items-center justify-between bg-surface px-2xl py-xl">
        <div className="flex min-w-0 items-center gap-sm">
          <h1 className="truncate text-h3 text-text-primary">Site order</h1>
        </div>
        <div className="flex items-center gap-sm">
          {dirty ? (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              disabled={savedIsDefault}
              onClick={savedIsDefault ? undefined : handleRestoreDefault}
              className={`rounded-sm px-md py-xs text-body transition-colors ${
                savedIsDefault ? 'cursor-not-allowed text-text-tertiary' : 'text-text-action hover:bg-surface-hover'
              }`}
            >
              Restore to default
            </button>
          )}
          <button
            type="button"
            disabled={!dirty}
            onClick={handleSave}
            className={`flex h-9 items-center rounded-sm px-lg text-body transition-colors ${
              dirty
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'cursor-not-allowed bg-surface-selected text-text-tertiary'
            }`}
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2xl py-2xl">
        <div className="rounded-md border border-border bg-surface p-2xl">
          <CardHeader
            title="AI site priority"
            subtitle="Drag sites to set the order they appear in Search AI."
          />
          <div className="mt-lg flex flex-col gap-sm">
            {order.map((site, index) => (
              <div
                key={site.id}
                draggable
                onDragStart={() => {
                  dragIndex.current = index
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  onDragOverRow(index)
                }}
                onDragEnd={() => {
                  dragIndex.current = null
                }}
                className="group flex h-[46px] items-center gap-md rounded-sm border border-border-selected bg-surface px-md transition-colors hover:bg-surface-hover"
              >
                <span className="w-lg shrink-0 text-center text-small text-text-tertiary">{index + 1}</span>
                {site.iconSrc ? (
                  <img src={site.iconSrc} alt="" className="size-[18px] shrink-0" />
                ) : AI_SITE_COLORS[site.label] ? (
                  <span
                    className="flex size-[18px] shrink-0 items-center justify-center rounded-full text-[10px] text-white"
                    style={{ backgroundColor: AI_SITE_COLORS[site.label] }}
                  >
                    {site.label.charAt(0)}
                  </span>
                ) : (
                  <AiIcon size={18} className="shrink-0" />
                )}
                <span className="min-w-0 flex-1 truncate text-body text-text-primary">{site.label}</span>
                <Icon
                  name="drag_indicator"
                  size={16}
                  className="shrink-0 cursor-grab text-text-icon opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
