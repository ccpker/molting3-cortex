import { useAppStore } from "@/lib/store";
import DashboardView from "@/components/panes/DashboardView";
import BulletView from "@/components/panes/BulletView";

function App() {
  const viewMode = useAppStore((s) => s.viewMode);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)]">
      {/* TODO: TopBar — 面包屑/快速切换 */}
      <main className="flex-1 overflow-hidden">
        {viewMode === "dashboard" && <DashboardView />}
        {viewMode === "bullet" && <BulletView />}
      </main>
    </div>
  );
}

export default App;
