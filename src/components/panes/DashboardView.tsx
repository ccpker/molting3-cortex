import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import OutputList from "@/components/modules/OutputList";
import TopicCard from "@/components/modules/TopicCard";
import type { Module } from "@/types/module";

export default function DashboardView() {
  const modules = useAppStore((s) => s.modules);
  const views = useAppStore((s) => s.views);
  const bullets = useAppStore((s) => s.bullets);
  const activeViewId = useAppStore((s) => s.activeViewId);
  const setActiveBullet = useAppStore((s) => s.setActiveBullet);
  const setActiveViewId = useAppStore((s) => s.setActiveViewId);

  // 所有可用视图列表
  const viewList = useMemo(() => Array.from(views.values()), [views]);

  // 当前活跃视图（有选择则用选择，否则用第一个）
  const activeView = useMemo(() => {
    if (activeViewId) return views.get(activeViewId) ?? viewList[0];
    return viewList[0];
  }, [views, activeViewId, viewList]);

  // 初始化默认视图
  useMemo(() => {
    if (!activeViewId && viewList.length > 0) {
      setActiveViewId(viewList[0].id);
    }
  }, [activeViewId, viewList, setActiveViewId]);

  // 按 zone 组织模块，未在 zone 中的模块按类型分组
  const zoneModules = useMemo(() => {
    if (!activeView) return null;

    const used = new Set<string>();
    const zones: { title: string; modules: Module[] }[] = [];

    for (const zone of activeView.zones) {
      const mods = zone.modules
        .map((id) => modules.get(id))
        .filter(Boolean) as Module[];
      mods.forEach((m) => used.add(m.meta.id));
      if (mods.length > 0) {
        zones.push({ title: zone.title, modules: mods });
      }
    }

    // 未归入 zone 的模块放「其他」
    const rest = Array.from(modules.values()).filter((m) => !used.has(m.meta.id));
    if (rest.length > 0) {
      zones.push({ title: "📦 其他", modules: rest });
    }

    return zones;
  }, [activeView, modules]);

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* 头部 + 视图切换 */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
          {activeView ? activeView.title : "🧠 molting3 中枢"}
        </h1>
        {/* 视图切换 Tab */}
        {viewList.length > 1 && (
          <div className="flex gap-1 mb-2 bg-[var(--color-surface)] rounded-lg p-1 w-fit">
            {viewList.map((v) => (
              <button
                key={v.id}
                className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                  activeViewId === v.id
                    ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-medium"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
                onClick={() => setActiveViewId(v.id)}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}
        <p className="text-sm text-[var(--color-text-muted)]">
          {bullets.length} 颗子弹 · {modules.size} 个模块
        </p>
      </header>

      {/* Zone 布局 */}
      {zoneModules ? (
        zoneModules.map((zone) => (
          <section key={zone.title} className="mb-8">
            <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              {zone.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {zone.modules.map((m) => (
                <ModuleCard
                  key={m.meta.id}
                  module={m}
                  onClick={() => {
                    if (m.meta.bullet) setActiveBullet(m.meta.bullet);
                  }}
                />
              ))}
            </div>
          </section>
        ))
      ) : (
        /* 降级：按类型分组 */
        <>
          {renderTypeGroup(modules, "status_card", "活跃项目", setActiveBullet)}
          {renderTypeGroup(modules, "output_list", "产出文件", setActiveBullet)}
          {renderTypeGroup(modules, "conversation_topic", "对话主题", setActiveBullet)}
        </>
      )}

      {/* 子弹列表 */}
      {bullets.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            所有子弹
          </h2>
          <div className="flex flex-wrap gap-2">
            {bullets.map((b) => (
              <button
                key={b}
                className="text-xs px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)]
                         rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)]
                         hover:border-[var(--color-accent)] transition-colors"
                onClick={() => setActiveBullet(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </section>
      )}

      {modules.size === 0 && (
        <EmptyState text="暂无加载的模块。请先挂载源数据或创建模块文件。" />
      )}
    </div>
  );
}

// ─── 按类型渲染 ───
function renderTypeGroup(
  modules: Map<string, Module>,
  type: string,
  title: string,
  onBulletClick: (b: string | null) => void
) {
  const items = Array.from(modules.values()).filter((m) => m.meta.type === type);
  if (items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
        {title} · {items.length}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((m) => (
          <ModuleCard
            key={m.meta.id}
            module={m}
            onClick={() => onBulletClick(m.meta.bullet || null)}
          />
        ))}
      </div>
    </section>
  );
}

// ─── 模块卡路由 ───
function ModuleCard({ module: m, onClick }: { module: Module; onClick?: () => void }) {
  switch (m.meta.type) {
    case "conversation_topic":
      return <TopicCard module={m} onClick={onClick} />;
    case "output_list":
      return <OutputList module={m} onClick={onClick} />;
    case "status_card":
    default:
      return <EnhancedStatusCard module={m} onClick={onClick} />;
  }
}

// ─── 增强版 StatusCard（显示子模块数和关联） ───
function EnhancedStatusCard({ module: m, onClick }: Props) {
  const meta = m.meta;
  const isActive = meta.tags?.includes("active");
  const isPinned = meta.pinned;
  const childCount = meta.children?.length ?? 0;
  const linkCount = meta.links?.length ?? 0;

  return (
    <div
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4
                 hover:border-[var(--color-accent)] hover:shadow-sm cursor-pointer transition-all"
      onClick={onClick}
    >
      {/* 标题行 */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold text-[var(--color-text)] flex-1 line-clamp-1">
          {isPinned && "📌 "}{meta.title}
        </h3>
        {isActive ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 flex-shrink-0">
            活跃
          </span>
        ) : (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-500/15 text-zinc-400 flex-shrink-0">
            {meta.tags?.includes("核心") ? "核心" : "模块"}
          </span>
        )}
      </div>

      {/* 正文 */}
      {m.body && (
        <p className="text-xs text-[var(--color-text-muted)] line-clamp-4 mb-2 whitespace-pre-line">
          {m.body}
        </p>
      )}

      {/* 标签 */}
      {meta.tags && meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {meta.tags.filter(t => !["active", "核心"].includes(t)).slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-[9px] px-1.5 py-0.5 bg-[var(--color-accent)]/8 text-[var(--color-accent)]/80 rounded"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* 底栏：子模块 + 链接数 */}
      <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]/60 border-t border-[var(--color-border)] pt-2">
        {childCount > 0 && (
          <span>📎 {childCount} 个子模块</span>
        )}
        {linkCount > 0 && (
          <span>🔗 {linkCount} 关联</span>
        )}
        {meta.updated && (
          <span className="ml-auto">{fmtTime(meta.updated)}</span>
        )}
      </div>
    </div>
  );
}

interface Props {
  module: Module;
  onClick?: () => void;
}

const EmptyState = ({ text }: { text: string }) => (
  <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-lg p-8 text-center">
    <p className="text-sm text-[var(--color-text-muted)]">{text}</p>
  </div>
);

const fmtTime = (iso: string) => {
  try {
    const d = new Date(iso);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  } catch {
    return "";
  }
};
