import { createFileRoute } from '@tanstack/react-router'
import OptimizerPage from '#/features/optimizer/presentations/components/OptimizerPage'

export const Route = createFileRoute('/_app/optimizer')({
  component: OptimizerPage,
})
