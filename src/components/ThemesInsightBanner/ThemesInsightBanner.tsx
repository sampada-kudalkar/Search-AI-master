import { Icon } from '../Icon/Icon'
import { ThemesInsightBannerProps } from './ThemesInsightBanner.types'

export function ThemesInsightBanner({ text, linkLabel, onLinkClick }: ThemesInsightBannerProps) {
  return (
    <div className="flex items-center justify-between rounded-sm bg-[#e8f1fc] px-lg py-md">
      <div className="flex items-center gap-sm">
        <Icon name="lightbulb" size={20} className="text-primary" />
        <span className="text-body text-text-primary">{text}</span>
      </div>
      <button type="button" onClick={onLinkClick} className="text-body text-text-action hover:underline">
        {linkLabel}
      </button>
    </div>
  )
}
