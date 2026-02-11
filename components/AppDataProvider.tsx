"use client";

import * as React from "react";
import {
  clients as seedClients,
  cases as seedCases,
  tasks as seedTasks,
  events as seedEvents,
  invoices as seedInvoices,
  documents as seedDocuments,
  communications as seedCommunications,
  notes as seedNotes,
  payments as seedPayments,
} from "@/lib/data";
import type { DocumentItem, CommunicationItem, NoteItem, PaymentItem } from "@/lib/data";

export type AppState = {
  clients: typeof seedClients;
  cases: typeof seedCases;
  tasks: typeof seedTasks;
  events: typeof seedEvents;
  invoices: typeof seedInvoices;
  documents: DocumentItem[];
  communications: CommunicationItem[];
  notes: NoteItem[];
  payments: PaymentItem[];
};

type AppActions = {
  addClient: (data: Omit<(typeof seedClients)[number], "id">) => void;
  addCase: (data: Omit<(typeof seedCases)[number], "id">) => void;
  addTask: (data: Omit<(typeof seedTasks)[number], "id">) => void;
  addEvent: (data: Omit<(typeof seedEvents)[number], "id">) => void;
  addInvoice: (data: Omit<(typeof seedInvoices)[number], "id">) => void;
  addDocument: (data: Omit<DocumentItem, "id">) => void;
  addCommunication: (data: Omit<CommunicationItem, "id">) => void;
  addNote: (data: Omit<NoteItem, "id">) => void;
  addPayment: (data: Omit<PaymentItem, "id">) => void;
  resetData: () => void;
};

type AppContextValue = AppState & AppActions;

const AppDataContext = React.createContext<AppContextValue | null>(null);

const STORAGE_KEY = "lawflow-data";

const initialState: AppState = {
  clients: seedClients,
  cases: seedCases,
  tasks: seedTasks,
  events: seedEvents,
  invoices: seedInvoices,
  documents: seedDocuments,
  communications: seedCommunications,
  notes: seedNotes,
  payments: seedPayments as PaymentItem[],
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>(initialState);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save data", error);
    }
  }, [loaded, state]);

  const actions: AppActions = {
    addClient: (data) =>
      setState((prev) => ({
        ...prev,
        clients: [{ id: createId("client"), ...data }, ...prev.clients],
      })),
    addCase: (data) =>
      setState((prev) => ({
        ...prev,
        cases: [{ id: createId("case"), ...data }, ...prev.cases],
      })),
    addTask: (data) =>
      setState((prev) => ({
        ...prev,
        tasks: [{ id: createId("task"), ...data }, ...prev.tasks],
      })),
    addEvent: (data) =>
      setState((prev) => ({
        ...prev,
        events: [{ id: createId("event"), ...data }, ...prev.events],
      })),
    addInvoice: (data) =>
      setState((prev) => ({
        ...prev,
        invoices: [{ id: createId("invoice"), ...data }, ...prev.invoices],
      })),
    addDocument: (data) =>
      setState((prev) => ({
        ...prev,
        documents: [{ id: createId("document"), ...data }, ...prev.documents],
      })),
    addCommunication: (data) =>
      setState((prev) => ({
        ...prev,
        communications: [{ id: createId("com"), ...data }, ...prev.communications],
      })),
    addNote: (data) =>
      setState((prev) => ({
        ...prev,
        notes: [{ id: createId("note"), ...data }, ...prev.notes],
      })),
    addPayment: (data) =>
      setState((prev) => ({
        ...prev,
        payments: [{ id: createId("payment"), ...data }, ...prev.payments],
      })),
    resetData: () => setState(initialState),
  };

  const value: AppContextValue = {
    ...state,
    ...actions,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = React.useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
}
