import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PrintClient from "@/app/app/(protected)/invoices/[id]/print/PrintClient";
import { formatCurrency } from "@/lib/format";


export default async function ReceiptPrintPage({ params }: { params: { id: string } }) {
  const receipt = await prisma.receipt.findUnique({
    where: { id: params.id },
    include: { invoice: { include: { client: true } } },
  });
  if (!receipt) notFound();

  const settings = await prisma.settings.findFirst();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 print:px-0 print:py-0">
      <PrintClient />
      <div className="rounded-2xl border border-steel/20 bg-white p-6 shadow-soft print:border-0 print:shadow-none">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">קבלה</h1>
            <p className="text-sm text-steel/70">מספר: {receipt.number}</p>
            <p className="text-sm text-steel/70">תאריך: {receipt.issuedAt.toISOString().slice(0, 10)}</p>
            <p className="text-sm text-steel/70">עבור חשבונית: {receipt.invoice.number}</p>
          </div>
          <div className="text-sm text-steel/70">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="logo" className="mb-2 h-10" />
            ) : null}
            <p className="font-semibold text-ink">{settings?.firmName ?? "LawFlow"}</p>
            <p>עוסק: {settings?.vatNumber ?? ""}</p>
            {settings?.firmAddress ? <p>{settings.firmAddress}</p> : null}
            {settings?.firmPhone ? <p>{settings.firmPhone}</p> : null}
            {settings?.firmEmail ? <p>{settings.firmEmail}</p> : null}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-steel/10 p-4">
          <p className="text-sm font-semibold text-ink">פרטי לקוח</p>
          <p className="text-sm">{receipt.invoice.client.name}</p>
          <p className="text-xs text-steel/70">{receipt.invoice.client.email}</p>
          <p className="text-xs text-steel/70">{receipt.invoice.client.phone}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-sand/60 p-3">
            <p className="text-xs text-steel/70">שיטת תשלום</p>
            <p className="font-semibold">{receipt.method}</p>
          </div>
          <div className="rounded-lg bg-sand/60 p-3">
            <p className="text-xs text-steel/70">סכום הקבלה</p>
            <p className="font-semibold">₪{formatCurrency(receipt.amount)}</p>
          </div>
        </div>

        {settings?.signatureUrl ? (
          <div className="mt-8 text-xs text-steel/70">
            <img src={settings.signatureUrl} alt="signature" className="h-12" />
          </div>
        ) : null}
        <div className="mt-4 text-xs text-steel/70">
          {settings?.invoiceFooter ?? "מסמך זה הופק במערכת LawFlow."}
        </div>
      </div>
    </div>
  );
}