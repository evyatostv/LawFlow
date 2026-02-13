import TasksClient from "./TasksClient";
import { getTasks, getClients, getCases } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [tasks, clients, cases] = await Promise.all([getTasks(), getClients(), getCases()]);
  return (
    <TasksClient
      tasks={tasks}
      clients={clients.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
      cases={cases.map((c: { id: string; caseNumber: string }) => ({ id: c.id, caseNumber: c.caseNumber }))}
    />
  );
}
