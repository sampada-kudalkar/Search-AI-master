import { TabsProps } from './Tabs.types'

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex items-end gap-xs">
      {tabs.map((tab) => {
        const active = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-stretch gap-xs"
          >
            <span
              className={`flex h-8 items-center justify-center gap-xs rounded-sm px-sm text-body transition-colors ${
                active ? 'text-text-primary' : 'text-text-secondary hover:bg-surface-selected'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-small text-text-secondary">{tab.count}</span>
              )}
            </span>
            <span className={`h-px w-full ${active ? 'bg-primary' : 'bg-transparent'}`} />
          </button>
        )
      })}
    </div>
  )
}
