import { createFileRoute } from '@tanstack/react-router'
import ReceiptUploadZone from '#/features/receipt/presentations/components/ReceiptUploadZone'
import ReceiptForm from '#/features/receipt/presentations/components/ReceiptForm'
import ReceiptList from '#/features/receipt/presentations/components/ReceiptList'

export const Route = createFileRoute('/_app/receipt')({
  component: ReceiptPage,
})

function ReceiptPage() {
  return (
    <div className="nd-dot-grid min-h-full">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-8">
          <p
            className="nd-mono mb-1 text-[10px] uppercase tracking-widest text-[#999999]"
          >
            Receipts
          </p>
          <h1
            className="text-2xl font-bold text-[#000]"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Scan & Manage
          </h1>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Upload + List */}
          <div className="flex flex-col gap-6">
            <section className="nd-card p-5">
              <p className="nd-mono mb-4 text-[10px] uppercase tracking-widest text-[#999999]">
                Upload Receipt
              </p>
              <ReceiptUploadZone />
            </section>

            <section>
              <p className="nd-mono mb-4 text-[10px] uppercase tracking-widest text-[#999999]">
                Recent Receipts
              </p>
              <ReceiptList />
            </section>
          </div>

          {/* Right: Form */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <section className="nd-card p-5">
              <p className="nd-mono mb-4 text-[10px] uppercase tracking-widest text-[#999999]">
                Receipt Details
              </p>
              <ReceiptForm />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
