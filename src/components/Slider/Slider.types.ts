export interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  defaultValue?: number
  color?: string
  className?: string
}
