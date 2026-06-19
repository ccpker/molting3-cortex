import { useAppStore } from "@/lib/store";
import { ArrowLeft } from "lucide-react";
import StatusCard from "@/components/modules/StatusCard";

export default function BulletView() {
  const activeBullet = useAppStore((s) => s.activeBullet);
  const modules = useAppStore((s) => s.modules);
  const setActiveBullet = useAppStore((s) => s.setActiveBullet);

  if (!activeBullet) return null;

  // 筛选该子弹的所有模块
  const bulletModules = Array.from(modules.values()).filter(
    (m) => m.meta.bullet === activeBullet
  );

  const statusCard = bulletModules.find((m) => m.meta.type === "status_card");
  const outputLists = bulletModules.filter((m) => m.meta.type === "output_list");
  const topicCards = bulletModules.filter((m) => m.meta.type === "conversation_topic");

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* 返回 */}
      <button
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]
                   hover:text-[var(--color-text)] transition-colors mb-6"
        onClick={() => setActiveBullet(null)}
      >
        <ArrowLeft className="w-4 h-4" />
        返回全景
      </button>

      {/* 子弹名 */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">{activeBullet}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {bulletModules.length} 个模块
        </p>
      </header>

      {/* 状态卡 */}
      {statusCard && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            状态
          </h2>
          <StatusCard module={statusCard} />
        </section>
      )}

      {/* 产出 */}
      {outputLists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            产出 ({outputLists.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            对话主题 ({topicCards.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topicCards.map((m) => (
              <StatusCard key={m.meta.id} module={m} />
            ))}
          </div>
        </section>
      )}

      {bulletModules.length === 0 && (
        <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-lg p-8 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            暂无模块。创建第一个模块开始记录。
          </p>
        </div>
      )}
    </div>
  );
}
