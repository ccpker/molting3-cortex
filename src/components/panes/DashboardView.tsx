import { useAppStore } from "@/lib/store";
import StatusCard from "@/components/modules/StatusCard";
import type { Module } from "@/types/module";

export default function DashboardView() {
  const modules = useAppStore((s) => s.modules);
  const bullets = useAppStore((s) => s.bullets);
  const setActiveBullet = useAppStore((s) => s.setActiveBullet);

  // 按类型分组
  const statusCards = filterByType(modules, "status_card");
  const outputLists = filterByType(modules, "output_list");
  const topicCards = filterByType(modules, "conversation_topic");

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* 头部 */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">🧠 molting3 中枢</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          {bullets.length} 颗子弹 · {statusCards.length} 活跃
        </p>
      </header>

      {/* 活跃子弹网格 */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
          活跃子弹
        </h2>
        {statusCards.length === 0 ? (
          <EmptyState text="暂无加载的模块。请先挂载源数据或创建模块。" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {statusCards.map((m) => (
              <StatusCard
                key={m.meta.id}
                module={m}
                onClick={() => setActiveBullet(m.meta.bullet || null)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 产出区 */}
      {outputLists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            产出文件
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {outputLists.map((m) => (
              <StatusCard key={m.meta.id} module={m} />
            ))}
          </div>
        </section>
      )}

      {/* 对话主题 */}
      {topicCards.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            对话主题
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {topicCards.map((m) => (
              <StatusCard key={m.meta.id} module={m} />
            ))}
          </div>
        </section>
      )}

      {/* 子弹列表 */}
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
    </div>
  );
}

function filterByType(modules: Map<string, Module>, type: string) {
  return Array.from(modules.values()).filter((m) => m.meta.type === type);
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-lg p-8 text-center">
      <p className="text-sm text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}
