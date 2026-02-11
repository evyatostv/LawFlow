export type Client = {
  id: string;
  name: string;
  israeliId: string;
  phone: string;
  email: string;
  address: string;
  tags: string[];
  balance: number;
};

export type Case = {
  id: string;
  clientId: string;
  caseNumber: string;
  court: string;
  opposingParty: string;
  status: "OPEN" | "PENDING" | "CLOSED";
  deadlines: string[];
  hearings: string[];
};

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  clientId?: string;
  caseId?: string;
  repeat?: string;
  completed?: boolean;
};

export type Event = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  type: string;
  clientId?: string;
  caseId?: string;
  location?: string;
};

export type Invoice = {
  id: string;
  number: string;
  clientId: string;
  total: number;
  status: "PAID" | "UNPAID" | "PARTIAL";
  allocationNumber?: string;
  dueDate: string;
};

export const clients: Client[] = [
  {
    id: "c1",
    name: "עדי ישראלי",
    israeliId: "123456789",
    phone: "+972-52-555-0189",
    email: "adi@company.co.il",
    address: "רוטשילד 19, תל אביב",
    tags: ["נדל" + "ן", "שכירות"],
    balance: 8400,
  },
  {
    id: "c2",
    name: "סטודיו אלון",
    israeliId: "513459876",
    phone: "+972-54-334-7788",
    email: "office@alon.studio",
    address: "הפלמ" + "ח 12, חיפה",
    tags: ["חוזים"],
    balance: 0,
  },
];

export const cases: Case[] = [
  {
    id: "case1",
    clientId: "c1",
    caseNumber: "ת" + "א 12832-04-25",
    court: "בית משפט השלום תל אביב",
    opposingParty: "חברת מנורה",
    status: "OPEN",
    deadlines: ["2026-02-11", "2026-02-17"],
    hearings: ["2026-02-20 09:30"],
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    title: "שליחת מכתב התראה",
    dueDate: "2026-02-11",
    priority: "HIGH",
    clientId: "c1",
    caseId: "case1",
    repeat: "א" + "חת לחודש",
  },
  {
    id: "t2",
    title: "בדיקת הסכם שכירות",
    dueDate: "2026-02-12",
    priority: "MEDIUM",
    clientId: "c2",
  },
];

export const events: Event[] = [
  {
    id: "e1",
    title: "דיון קדם משפט",
    startAt: "2026-02-11 10:00",
    endAt: "2026-02-11 11:00",
    type: "HEARING",
    clientId: "c1",
    caseId: "case1",
    location: "אול" + "ם 4",
  },
  {
    id: "e2",
    title: "פגישת אסטרטגיה",
    startAt: "2026-02-11 14:00",
    endAt: "2026-02-11 15:00",
    type: "MEETING",
    clientId: "c2",
  },
];

export const invoices: Invoice[] = [
  {
    id: "inv1",
    number: "INV-2026-021",
    clientId: "c1",
    total: 11700,
    status: "PARTIAL",
    allocationNumber: "A-98231",
    dueDate: "2026-02-18",
  },
  {
    id: "inv2",
    number: "INV-2026-022",
    clientId: "c2",
    total: 5200,
    status: "UNPAID",
    dueDate: "2026-02-16",
  },
];

export const communications = [
  {
    id: "com1",
    type: "WHATSAPP",
    summary: "נשלחה טיוטת הסכם",
    timestamp: "2026-02-11 08:40",
    clientId: "c1",
    attachments: ["draft-agreement.pdf"],
  },
  {
    id: "com2",
    type: "EMAIL",
    summary: "בקשה להארכת מועד",
    timestamp: "2026-02-10 17:10",
    clientId: "c2",
    attachments: [],
  },
];

export const documents = [
  {
    id: "doc1",
    name: "הסכם שכירות חתום",
    type: "PDF",
    clientId: "c1",
    caseId: "case1",
    updatedAt: "2026-02-09",
  },
];

export const notes = [
  {
    id: "n1",
    body: "הוחלט להגיש בקשת ארכה",
    timestamp: "2026-02-10 12:00",
  },
];

export const payments = [
  {
    id: "p1",
    amount: 5000,
    method: "העברה בנקאית",
    status: "PARTIAL",
    date: "2026-02-10",
  },
];
