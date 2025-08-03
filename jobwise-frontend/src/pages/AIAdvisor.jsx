import AppShell from "@/components/layout/AppShell";
import AIAdvisorComponent from "@/components/ui/AIAdvisor"; // Uses AIAdvisor.css internally

export default function AIAdvisor() {
  return (
    <AppShell>
      <h1 className="text-3xl font-bold mb-6">Jobwiser AI Advisor</h1>
      <AIAdvisorComponent />
    </AppShell>
  );
}
