import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { loadAll } from "@/lib/loader";
import { onFileChange, onGraphChanged, rebuildGraph } from "@/lib/tauri-api";
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
  const [graphDiff, setGraphDiff] = useState<{ added: number; removed: number; changed: number } | null>(null);
  const rebuildTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addChange = (ev: FileChangeEvent) => {
    setChanges((prev) => [ev, ...prev].slice(0, 20));
  };

  /** 防抖重建依赖图 — 500ms 内的连续变更合并为一次重建 */
  const scheduleRebuild = () => {
    if (rebuildTimer.current) clearTimeout(rebuildTimer.current);
    rebuildTimer.current = setTimeout(async () => {
      try {
        const res = await rebuildGraph();
        console.log(
          `[graph] rebuilt: ${res.moduleCount} modules, +${res.added} -${res.removed} ~${res.changed}`
        );
      } catch (err) {
        console.warn("[graph] rebuild failed:", err);
      }
    }, 500);
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
    let unlistenFile: (() => void) | null = null;
    let unlistenGraph: (() => void) | null = null;
    const hasTauri = typeof window !== "undefined"
      && "__TAURI_INTERNALS__" in window;

    if (hasTauri) {
      onFileChange((ev) => {
        console.log(`[watcher] ${ev.kind}: ${ev.path}`);
        addChange(ev);
        scheduleRebuild();
      }).then((fn) => {
        unlistenFile = fn;
        setWatcherActive(true);
        console.log("[watcher] listener registered");
      }).catch((err) => {
        console.warn("[watcher] failed to register:", err);
      });

      onGraphChanged((diff) => {
        setGraphDiff({
          added: diff.added.length,
          removed: diff.removed.length,
          changed: diff.changed.length,
        });
        // 5s 后自动清除 diff 高亮
        setTimeout(() => setGraphDiff(null), 5000);
      }).then((fn) => {
        unlistenGraph = fn;
      }).catch((err) => {
        console.warn("[graph] event listener failed:", err);
      });
    }

    return () => {
      if (unlistenFile) unlistenFile();
      if (unlistenGraph) unlistenGraph();
      if (rebuildTimer.current) clearTimeout(rebuildTimer.current);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)]">
      <TopBar watcherActive={watcherActive} changeCount={changes.length} graphDiff={graphDiff} />
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
