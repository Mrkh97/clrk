import GlassCard from '#/components/GlassCard'
import ReceiptForm from './ReceiptForm'
import ReceiptList from './ReceiptList'
import ReceiptUploadZone from './ReceiptUploadZone'

export default function ReceiptPage() {
  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="mb-8">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Receipts
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Scan & Manage
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start">
          <section className="order-1">
            <GlassCard className="p-4 sm:p-5">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Upload Receipt
              </p>
              <ReceiptUploadZone />
            </GlassCard>
          </section>

          <section className="order-2 lg:row-span-2 lg:col-start-2 xl:sticky xl:top-6 xl:self-start">
            <GlassCard className="p-5">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Receipt Details
              </p>
              <ReceiptForm />
            </GlassCard>
          </section>

          <section className="order-3">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Recent Receipts
            </p>
            <ReceiptList />
          </section>
        </div>
      </div>
    </div>
  )
}
