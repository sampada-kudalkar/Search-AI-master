import { Icon, TopNav } from '../components'
import { getHealthcareIntegration } from '../data/healthcareIntegrations'

interface IntegrationDetailScreenProps {
  integrationId: string
  onBack: () => void
}

export function IntegrationDetailScreen({ integrationId, onBack }: IntegrationDetailScreenProps) {
  const integration = getHealthcareIntegration(integrationId)
  const title = integration?.name ?? integrationId

  return (
    <div className="flex h-full flex-col">
      <TopNav initials="S" />
      <div className="flex shrink-0 items-center gap-xs border-b border-border px-2xl py-md">
        <button
          type="button"
          onClick={onBack}
          className="text-body text-text-action hover:underline"
        >
          Settings
        </button>
        <Icon name="chevron_right" size={16} className="text-text-icon" />
        <button
          type="button"
          onClick={onBack}
          className="text-body text-text-action hover:underline"
        >
          Integrations
        </button>
        <Icon name="chevron_right" size={16} className="text-text-icon" />
        <span className="text-body text-text-primary">{title}</span>
      </div>
      <div className="flex flex-1 items-center justify-center px-2xl text-body text-text-secondary">
        {title} integration settings coming soon.
      </div>
    </div>
  )
}
