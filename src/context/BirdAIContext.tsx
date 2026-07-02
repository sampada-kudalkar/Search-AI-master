import { createContext, useContext } from 'react'

interface BirdAIContextValue {
  openBirdAI: () => void
}

export const BirdAIContext = createContext<BirdAIContextValue>({
  openBirdAI: () => {},
})

export function useBirdAI() {
  return useContext(BirdAIContext)
}
