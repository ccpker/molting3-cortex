import { useAppStore } from "@/lib/store";
import { ArrowLeft, LayoutDashboard, RefreshCw } from "lucide-react";

export default function TopBar() {
  const activeBullet = useAppStore((s) => s.activeBullet);
  const bullets = useAppStore((s) => s.bullets);
  const setActiveBullet = useAppStore((s) => s.setActiveBullet);

  return (
    <header className="flex items-center gap-3 px-4 py-2 bg-[var(--color-surface)] border-b border-[var(--color-border)] shrink-0">
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

      {/* 右侧 */}
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
