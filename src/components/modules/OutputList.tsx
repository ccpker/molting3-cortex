import type { Module } from "@/types/module";
import { File, FolderOpen } from "lucide-react";

interface Props {
  module: Module;
  onClick?: () => void;
}

export default function OutputList({ module: m, onClick }: Props) {
  const meta = m.meta;

  return (
    <div
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4
                 hover:border-[var(--color-accent)] cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-3">
        <FolderOpen className="w-4 h-4 text-[var(--color-accent)]" />
        <h3 className="text-sm font-semibold text-[var(--color-text)]">{meta.title}</h3>
      </div>

      <div className="text-xs text-[var(--color-text-muted)] space-y-1">
        {m.body ? (
          m.body.split("\n").map((line, i) => {
            const match = line.match(/^-\s+(.+)/);
            if (match) {
              return (
                <div key={i} className="flex items-center gap-2 pl-1">
                  <File className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{match[1]}</span>
                </div>
              );
            }
            return null;
          })
        ) : (
          <span>暂无产出</span>
        )}
      </div>
    </div>
  );
}
