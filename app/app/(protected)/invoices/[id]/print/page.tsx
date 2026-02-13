import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PrintClient from "./PrintClient";
import { formatCurrency } from "@/lib/format";


export default async function InvoicePrintPage({ params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { client: true, case: true, lines: true, receipts: true },
  });
  if (!invoice) notFound();

  const settings = await prisma.settings.findFirst();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 print:px-0 print:py-0">
      <PrintClient />
      <div className="rounded-2xl border border-steel/20 bg-white p-6 shadow-soft print:border-0 print:shadow-none">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">חשבונית מס</h1>
            <p className="text-sm text-steel/70">מספר: {invoice.number}</p>
            <p className="text-sm text-steel/70">תאריך: {invoice.issueDate.toISOString().slice(0, 10)}</p>
            {invoice.case ? (
              <p className="text-sm text-steel/70">תיק: {invoice.case.caseNumber}</p>
            ) : null}
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
          <p className="text-sm">{invoice.client.name}</p>
          <p className="text-xs text-steel/70">{invoice.client.email}</p>
          <p className="text-xs text-steel/70">{invoice.client.phone}</p>
        </div>

        <div className="mt-6">
          <table className="w-full text-sm">
            <thead className="text-xs text-steel/70">
              <tr>
                <th className="py-2 text-right">תיאור</th>
                <th className="py-2 text-right">כמות</th>
                <th className="py-2 text-right">מחיר</th>
                <th className="py-2 text-right">סה"כ</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((line: any) => (
                <tr key={line.id} className="border-t border-steel/10">
                  <td className="py-2">{line.description}</td>
                  <td className="py-2">{line.quantity}</td>
                  <td className="py-2">₪{formatCurrency(line.unitPrice)}</td>
                  <td className="py-2">₪{formatCurrency(line.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-sand/60 p-3">
              <p className="text-xs text-steel/70">סה"כ ללא מע"מ</p>
              <p className="font-semibold">₪{formatCurrency(invoice.subtotal)}</p>
            </div>
            <div className="rounded-lg bg-sand/60 p-3">
              <p className="text-xs text-steel/70">מע"מ ({(invoice.vatRate * 100).toFixed(0)}%)</p>
              <p className="font-semibold">₪{formatCurrency(invoice.vatAmount)}</p>
            </div>
            <div className="rounded-lg bg-sand/60 p-3">
              <p className="text-xs text-steel/70">סה"כ לתשלום</p>
              <p className="font-semibold">₪{formatCurrency(invoice.total)}</p>
            </div>
          </div>
        </div>

        {invoice.allocationNumber ? (
          <div className="mt-6 text-sm">
            <p className="text-xs text-steel/70">מספר הקצאה</p>
            <p className="font-semibold">{invoice.allocationNumber}</p>
          </div>
        ) : null}

        <div className="mt-6 text-sm">
          <p className="text-xs text-steel/70">תקבולים</p>
          <p>{invoice.receipts.length} קבלות הונפקו</p>
        </div>

        {invoice.notes ? (
          <div className="mt-6 text-sm">
            <p className="text-xs text-steel/70">הערות</p>
            <p>{invoice.notes}</p>
          </div>
        ) : null}

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