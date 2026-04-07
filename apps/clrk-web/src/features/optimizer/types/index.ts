export type OptimizationLevel = 'easy' | 'hard'

export interface CutSuggestion {
  id: string
  category: string
  merchant: string
  currentSpend: number
  suggestedSpend: number
  saving: number
  reason: string
}

export interface OptimizationResult {
  level: OptimizationLevel
  totalCurrentSpend: number
  totalSavings: number
  suggestions: CutSuggestion[]
}

export type OptimizerPhase = 'idle' | 'loading' | 'done' | 'error'
