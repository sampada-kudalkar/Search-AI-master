import aiIconSrc from '../../assets/ai-icon.svg'

interface AiIconProps {
  size?: number
  className?: string
}

export function AiIcon({ size = 16, className }: AiIconProps) {
  return (
    <img
      src={aiIconSrc}
      alt="AI"
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block' }}
    />
  )
}
