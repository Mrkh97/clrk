import { createFileRoute } from '@tanstack/react-router'
import ReceiptPage from '#/features/receipt/presentations/components/ReceiptPage'

export const Route = createFileRoute('/_app/receipt')({
  component: ReceiptPage,
})
