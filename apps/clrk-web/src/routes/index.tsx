import { createFileRoute } from '@tanstack/react-router'
import LandingPage from '#/features/landing-page/presentations/components/LandingPage'

export const Route = createFileRoute('/')({
  component: LandingPage,
})
