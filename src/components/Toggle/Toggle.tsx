import { ToggleProps } from './Toggle.types'

export function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-[16px] w-[32px] shrink-0 rounded-full transition-colors focus:outline-none ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${checked ? 'bg-primary' : 'bg-surface-selected'}`}
    >
      <span
        className={`absolute top-[2px] size-3 rounded-full bg-white shadow-sm transition-[left] ${
          checked ? 'left-[18px]' : 'left-[2px]'
        }`}
      />
    </button>
  )
}
