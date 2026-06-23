import { useAppStore } from "@/lib/store";
import { ArrowLeft, LayoutDashboard, RefreshCw, Eye, EyeOff } from "lucide-react";

interface TopBarProps {
  watcherActive?: boolean;
  changeCount?: number;
}

export default function TopBar({ watcherActive, changeCount }: TopBarProps) {
  const activeBullet = useAppStore((s) => s.activeBullet);
  const bullets = useAppStore((s) => s.bullets);
  const setActiveBullet = useAppStore((s) => s.setActiveBullet);

  return (
    <header className="flex items-center gap-3 px-4 py-2 bg-[var(--color-surface)] border-b border-[var(--color-border)] shrink-0 select-none">
      {/* 面包屑 */}
      {activeBullet ? (
        <button
          className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          onClick={() => setActiveBullet(null)}
        >
          <ArrowLeft className="w-3 h-3" />
          全景
          <span className="text-[var(--color-accent)]">/ {activeBullet}</span>
        </button>
      ) : (
        <span className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-[var(--color-accent)]" />
          molting3 中枢
        </span>
      )}

      <div className="flex-1" />

      {/* 文件监听指示器 */}
      {watcherActive !== undefined && (
        <span
          className={`flex items-center gap-1 text-xs ${
            watcherActive ? "text-green-500" : "text-red-400"
          }`}
          title={watcherActive ? "文件监听中" : "监听未连接"}
        >
          {watcherActive ? (
            <Eye className="w-3 h-3" />
          ) : (
            <EyeOff className="w-3 h-3" />
          )}
          {typeof changeCount === "number" && changeCount > 0 && (
            <span className="text-[var(--color-text-muted)]">{changeCount}</span>
          )}
        </span>
      )}

      <span className="text-xs text-[var(--color-text-muted)]">{bullets.length} 颗子弹</span>
      <button
        className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        onClick={() => window.location.reload()}
        title="刷新"
      >
        <RefreshCw className="w-3 h-3" />
      </button>
    </header>
  );
}
