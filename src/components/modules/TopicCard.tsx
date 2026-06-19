import type { Module } from "@/types/module";
import { MessageSquare, Tag } from "lucide-react";

interface Props {
  module: Module;
  onClick?: () => void;
}

export default function TopicCard({ module: m, onClick }: Props) {
  const meta = m.meta;

  return (
    <div
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4
                 hover:border-[var(--color-accent)] cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-4 h-4 text-[var(--color-accent)]" />
        <h3 className="text-sm font-semibold text-[var(--color-text)]">{meta.title}</h3>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] line-clamp-3 mb-2">
        {m.body}
      </p>

      {meta.tags && meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {meta.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-1.5 py-0.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded"
            >
              <Tag className="w-2.5 h-2.5 inline mr-1" />
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
