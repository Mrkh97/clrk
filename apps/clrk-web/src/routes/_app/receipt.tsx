import { createFileRoute } from '@tanstack/react-router'
import GlassCard from '#/components/GlassCard'
import ReceiptUploadZone from '#/features/receipt/presentations/components/ReceiptUploadZone'
import ReceiptForm from '#/features/receipt/presentations/components/ReceiptForm'
import ReceiptList from '#/features/receipt/presentations/components/ReceiptList'

export const Route = createFileRoute('/_app/receipt')({
  component: ReceiptPage,
})

function ReceiptPage() {
  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Receipts
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Scan & Manage
          </h1>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Upload + List */}
          <div className="flex flex-col gap-6">
            <GlassCard className="p-5">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Upload Receipt
              </p>
              <ReceiptUploadZone />
            </GlassCard>

            <section>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Recent Receipts
              </p>
              <ReceiptList />
            </section>
          </div>

          {/* Right: Form */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <GlassCard className="p-5">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Receipt Details
              </p>
              <ReceiptForm />
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
