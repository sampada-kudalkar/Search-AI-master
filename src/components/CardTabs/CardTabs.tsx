import { Tabs } from '../Tabs/Tabs'
import type { TabsProps } from '../Tabs/Tabs.types'

export function CardTabs(props: TabsProps) {
  return (
    <div className="border-b border-border">
      <Tabs {...props} />
    </div>
  )
}
