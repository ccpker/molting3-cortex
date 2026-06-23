import { useEffect, useRef, useState } from "react";
import { Clock, FileText, Plus, Minus, RefreshCw, Eye } from "lucide-react";

// ─── 类型 ───

interface ChangeEntry {
  id: number;
  time: Date;
  files: { path: string; kind: "modified" | "created" | "removed" }[];
  graph: {
    moduleCount: number;
    added: number;
    removed: number;
    changed: number;
  } | null;
}

// ─── 全局变更缓冲区（跨渲染保持） ───

const changeBuffer: ChangeEntry[] = [];
let notifySetState: ((fn: (prev: ChangeEntry[]) => ChangeEntry[]) => void) | null = null;
let bufferTimer: ReturnType<typeof setTimeout> | null = null;
let nextId = 1;

function flushBuffer() {
  if (changeBuffer.length === 0) return;
  notifySetState?.((prev) => [...changeBuffer, ...prev].slice(0, 100));
  changeBuffer.length = 0;
  bufferTimer = null;
}

/**
 * 外部注入变更事件（由 App.tsx 文件监听和 graph-changed 事件调用）
 * 文件变更累积 1s 后与 graph-changed 结果一起生成一条 ChangeEntry
 */
export function pushFileChange(file: { path: string; kind: "modified" | "created" | "removed" }) {
  // 添加到当前缓冲条（如果存在）或创建新缓冲条
  if (changeBuffer.length === 0 || changeBuffer[0].graph !== null) {
    // 创建新缓冲条
    changeBuffer.unshift({
      id: nextId++,
      time: new Date(),
      files: [file],
      graph: null,
    });
  } else {
    changeBuffer[0].files.push(file);
  }

  if (bufferTimer) clearTimeout(bufferTimer);
  bufferTimer = setTimeout(flushBuffer, 1000);
}

export function pushGraphResult(
  moduleCount: number,
  added: number,
  removed: number,
  changed: number
) {
  if (changeBuffer.length > 0 && changeBuffer[0].graph === null) {
    changeBuffer[0].graph = { moduleCount, added, removed, changed };
  } else {
    changeBuffer.unshift({
      id: nextId++,
      time: new Date(),
      files: [],
      graph: { moduleCount, added, removed, changed },
    });
  }

  if (bufferTimer) {
    clearTimeout(bufferTimer);
    flushBuffer();
  } else {
    flushBuffer();
  }
}

// ─── 组件 ───

export default function ChangeTimeline() {
  const [entries, setEntries] = useState<ChangeEntry[]>([]);
  const autoScrollRef = useRef<HTMLDivElement>(null);

  // 注册全局通知
  useEffect(() => {
    notifySetState = setEntries as any;
    return () => { notifySetState = null; };
  }, []);

  const hasChanges = entries.length > 0;

  return (
    <div className="h-full overflow-y-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">
          变化摘要
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          文件改动实时感知 · 依赖影响自动分析
        </p>
      </header>

      {!hasChanges ? (
        <EmptyState />
      ) : (
        <div className="space-y-1" ref={autoScrollRef}>
          {entries.map((entry) => (
            <TimelineEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 空状态 ───

function EmptyState() {
  return (
    <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-lg p-10 text-center space-y-3">
      <Eye className="w-10 h-10 mx-auto text-[var(--color-text-muted)]/30" />
      <p className="text-sm text-[var(--color-text-muted)]">
        文件监听已就绪，改动会自动出现在这里
      </p>
      <p className="text-xs text-[var(--color-text-muted)]/50">
        修改 modules/ 下任意 .md 文件试试 →
      </p>
      <div className="flex gap-2 justify-center pt-2">
        <button
          className="text-xs px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)]
                     rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)]
                     hover:border-[var(--color-accent)] transition-colors flex items-center gap-1"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="w-3 h-3" />
          刷新
        </button>
      </div>
    </div>
  );
}

// ─── 单条时间线条目 ───

function TimelineEntry({ entry }: { entry: ChangeEntry }) {
  const [expanded, setExpanded] = useState(false);
  const time = entry.time;

  return (
    <div
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3
                 hover:border-[var(--color-accent)]/30 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* 头行 */}
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-[var(--color-text-muted)]/50 flex-shrink-0" />
        <span className="text-xs font-mono text-[var(--color-text-muted)]">
          {fmtTimeFull(time)}
        </span>

        {/* 变更摘要 */}
        {entry.files.length > 0 && (
          <span className="text-xs text-[var(--color-text)]/80 ml-1 flex items-center gap-0.5">
            <FileText className="w-3 h-3 text-[var(--color-accent)]/70" />
            {entry.files[0].path.split(/[\\/]/).pop()}
            {entry.files.length > 1 && (
              <span className="text-[var(--color-text-muted)]">+{entry.files.length - 1}</span>
            )}
          </span>
        )}

        {entry.graph && (
          <span
            className={`text-[10px] ml-auto flex items-center gap-0.5 font-mono ${
              entry.graph.added + entry.graph.removed + entry.graph.changed === 0
                ? "text-[var(--color-text-muted)]/40"
                : "text-amber-400"
            }`}
          >
            {entry.graph.added > 0 && <><Plus className="w-2.5 h-2.5" />{entry.graph.added}</>}
            {entry.graph.removed > 0 && <><Minus className="w-2.5 h-2.5 ml-1" />{entry.graph.removed}</>}
            {entry.graph.changed > 0 && <><RefreshCw className="w-2.5 h-2.5 ml-1" />{entry.graph.changed}</>}
            {entry.graph.added + entry.graph.removed + entry.graph.changed > 0 && (
              <span className="ml-1 text-[var(--color-text-muted)]/40">
                ({entry.graph.moduleCount})
              </span>
            )}
          </span>
        )}
      </div>

      {/* 展开详情 */}
      {expanded && (
        <div className="mt-2 pt-2 border-t border-[var(--color-border)] space-y-1.5">
          {/* 文件列表 */}
          {entry.files.length > 0 && (
            <div>
              <p className="text-[10px] text-[var(--color-text-muted)]/50 uppercase mb-1">变更文件</p>
              {entry.files.map((f, i) => (
                <div key={i} className="text-xs text-[var(--color-text-muted)]/70 ml-2 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    f.kind === "created" ? "bg-emerald-400" :
                    f.kind === "removed" ? "bg-red-400" :
                    "bg-amber-400"
                  }`} />
                  <span className="font-mono text-[10px]">{f.path}</span>
                  <span className="text-[10px] opacity-50">
                    {f.kind === "modified" ? "修改" : f.kind === "created" ? "新建" : "删除"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 图变更 */}
          {entry.graph && (
            <div>
              <p className="text-[10px] text-[var(--color-text-muted)]/50 uppercase mb-1">
                依赖图 · {entry.graph.moduleCount} 模块
              </p>
              <div className="flex gap-3 text-xs ml-2">
                {entry.graph.added > 0 && (
                  <span className="text-emerald-400">+{entry.graph.added} 新增</span>
                )}
                {entry.graph.removed > 0 && (
                  <span className="text-red-400">-{entry.graph.removed} 移除</span>
                )}
                {entry.graph.changed > 0 && (
                  <span className="text-amber-400">≈{entry.graph.changed} 变更</span>
                )}
                {entry.graph.added + entry.graph.removed + entry.graph.changed === 0 && (
                  <span className="text-[var(--color-text-muted)]/40">无结构性变化</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 工具 ───

function fmtTimeFull(date: Date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
