import GlassCard from '#/components/GlassCard'
import ReceiptForm from './ReceiptForm'
import ReceiptList from './ReceiptList'
import ReceiptUploadZone from './ReceiptUploadZone'

export default function ReceiptPage() {
  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-8">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Receipts
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Scan & Manage
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
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
