import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { loadAll } from "@/lib/loader";
import DashboardView from "@/components/panes/DashboardView";
import BulletView from "@/components/panes/BulletView";
import TopBar from "@/components/TopBar";

function App() {
  const viewMode = useAppStore((s) => s.viewMode);
  const loadModules = useAppStore((s) => s.loadModules);
  const loadViews = useAppStore((s) => s.loadViews);
  const setBullets = useAppStore((s) => s.setBullets);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAll()
      .then(({ modules, views, bulletNames }) => {
        if (modules.length > 0) loadModules(modules);
        if (views.length > 0) loadViews(views);
        setBullets(bulletNames);
        setLoading(false);
      })
      .catch((err) => {
        console.error("loadAll failed:", err);
        setError(String(err));
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)]">
      <TopBar />
      <main className="flex-1 overflow-hidden">
        {loading && <Splash text="🧠 loading..." />}
        {error && <Splash text={`⚠️ ${error}`} />}
        {!loading && !error && viewMode === "dashboard" && <DashboardView />}
        {!loading && !error && viewMode === "bullet" && <BulletView />}
      </main>
    </div>
  );
}

function Splash({ text }: { text: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-sm text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}

export default App;
