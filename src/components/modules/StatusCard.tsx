import type { Module } from "@/types/module";
import { Activity, Clock, FileText } from "lucide-react";

interface Props {
  module: Module;
  onClick?: () => void;
}

export default function StatusCard({ module: m, onClick }: Props) {
  const meta = m.meta;
  const isActive = meta.tags?.includes("active");

  return (
    <div
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4
                 hover:border-[var(--color-accent)] cursor-pointer transition-colors"
      onClick={onClick}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">{meta.title}</h3>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full ${
            isActive
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-zinc-500/20 text-zinc-400"
          }`}
        >
          {isActive ? "活跃" : "休眠"}
        </span>
      </div>

      {/* 内容 */}
      <div className="space-y-2 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3" />
          <span>{m.body}</span>
        </div>
        {meta.updated && (
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>{formatTime(meta.updated)}</span>
          </div>
        )}
        {meta.children && meta.children.length > 0 && (
          <div className="flex items-center gap-2">
            <FileText className="w-3 h-3" />
            <span>{meta.children.length} 个子模块</span>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "刚刚";
    if (hours < 24) return `${hours}h前`;
    return d.toLocaleDateString("zh-CN");
  } catch {
    return iso;
  }
}
