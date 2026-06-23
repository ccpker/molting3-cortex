import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { loadAll } from "@/lib/loader";
import { onFileChange } from "@/lib/tauri-api";
import type { FileChangeEvent } from "@/lib/tauri-api";
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

  // 文件变更记录 — 最近 20 条
  const [changes, setChanges] = useState<FileChangeEvent[]>([]);
  const [watcherActive, setWatcherActive] = useState(false);
  const addChange = (ev: FileChangeEvent) => {
    setChanges((prev) => [ev, ...prev].slice(0, 20));
  };

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

  // 文件监听
  useEffect(() => {
    let unlisten: (() => void) | null = null;
    const hasTauri = typeof window !== "undefined"
      && "__TAURI_INTERNALS__" in window;

    if (hasTauri) {
      onFileChange((ev) => {
        console.log(`[watcher] ${ev.kind}: ${ev.path}`);
        addChange(ev);
      }).then((fn) => {
        unlisten = fn;
        setWatcherActive(true);
        console.log("[watcher] listener registered");
      }).catch((err) => {
        console.warn("[watcher] failed to register:", err);
      });
    }

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)]">
      <TopBar watcherActive={watcherActive} changeCount={changes.length} />
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
