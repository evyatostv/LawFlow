import { PrismaClient, CaseStatus, Priority, PaymentStatus, CommunicationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const client = await prisma.client.create({
    data: {
      name: "משרד כהן",
      israeliId: "012345678",
      phone: "+972-50-123-4567",
      email: "office@cohenlaw.co.il",
      address: "דיזנגוף 120, תל אביב",
      tags: ["נדלן", "ליטיגציה"],
      balance: 12400,
    },
  });

  const caseRecord = await prisma.case.create({
    data: {
      clientId: client.id,
      caseNumber: "ת" + "א 45892-02-25",
      court: "בית משפט השלום תל אביב",
      opposingParty: "יוסי לוי",
      status: CaseStatus.OPEN,
      description: "סכסוך שכירות מסחרי",
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "הכנת תצהיר",
        dueDate: new Date(),
        priority: Priority.HIGH,
        clientId: client.id,
        caseId: caseRecord.id,
      },
      {
        title: "בדיקת הודעת דואר רשום",
        dueDate: new Date(Date.now() + 86400000),
        priority: Priority.MEDIUM,
        clientId: client.id,
      },
    ],
  });

  await prisma.event.create({
    data: {
      title: "דיון קדם משפט",
      startAt: new Date(Date.now() + 3 * 3600000),
      endAt: new Date(Date.now() + 4 * 3600000),
      type: "HEARING",
      location: "בית משפט השלום",
      reminder: "שעה לפני",
      clientId: client.id,
      caseId: caseRecord.id,
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      number: "INV-2026-001",
      clientId: client.id,
      caseId: caseRecord.id,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 86400000),
      subtotal: 10000,
      vatRate: 0.17,
      vatAmount: 1700,
      total: 11700,
      status: PaymentStatus.PARTIAL,
      allocationNumber: "A-99321",
      notes: "הנחה עבור פגישה ראשונה",
    },
  });

  await prisma.payment.create({
    data: {
      amount: 5000,
      method: "העברה בנקאית",
      status: PaymentStatus.PARTIAL,
      paidAt: new Date(),
      clientId: client.id,
      caseId: caseRecord.id,
      invoiceId: invoice.id,
    },
  });

  await prisma.note.create({
    data: {
      body: "הלקוח אישר את המשך ההליך",
      clientId: client.id,
      caseId: caseRecord.id,
    },
  });

  await prisma.communicationLog.create({
    data: {
      type: CommunicationType.WHATSAPP,
      summary: "נשלחה טיוטת הסכם",
      timestamp: new Date(),
      attachments: ["draft-agreement.pdf"],
      clientId: client.id,
      caseId: caseRecord.id,
    },
  });

  await prisma.template.create({
    data: {
      name: "הסכם שכר טרחה",
      body: "הסכם שכר טרחה עם {{clientName}}",
    },
  });

  await prisma.settings.create({
    data: {
      firmName: "כהן ושות'",
      vatNumber: "515123456",
      firmAddress: "דיזנגוף 120, תל אביב",
      firmPhone: "+972-3-555-1234",
      firmEmail: "office@cohenlaw.co.il",
      invoicePrefix: "INV-",
      invoiceNumberResetYearly: true,
      enableAllocationNumber: true,
      allocationThreshold: 5000,
      notificationRules: "תזכורת 24 שעות לפני",
      backupSchedule: "יומי 02:00",
      sessionTimeoutMinutes: 30,
      invoiceFooter: "תודה שבחרתם בנו",
      language: "he",
      adminEmail: "admin@lawflow.co.il",
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "Seed data created",
      actor: "system",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
