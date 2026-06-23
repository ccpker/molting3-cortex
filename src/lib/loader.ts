// 初始化载入 — 应用启动时加载模块和实时数据
import type { View } from "@/types/module";
import type { Module, LiveScan } from "@/types/module";
import { scanIndexFiles } from "@/lib/tauri-api";

export interface InitResult {
  modules: Module[];
  views: View[];
  bulletNames: string[];
  liveScans: LiveScan[];
}

// ─── 视图定义 — 基于 _index 扫描结果动态生成 ───

/** 从 _index 模块列表构建视图 zones */
function buildView(
  id: string,
  title: string,
  modules: Module[],
  zoneRules: { zone: string; match: (m: Module) => boolean }[],
): View {
  const zones = zoneRules.map(rule => ({
    title: rule.zone,
    modules: modules.filter(rule.match).map(m => m.meta.id),
  })).filter(z => z.modules.length > 0);

  // 未匹配的放「其他」
  const matched = new Set(zones.flatMap(z => z.modules));
  const rest = modules.filter(m => !matched.has(m.meta.id)).map(m => m.meta.id);
  if (rest.length > 0) {
    zones.push({ title: "📦 其他", modules: rest });
  }

  return { id, title, layout: "grid" as const, zones };
}

/**
 * 加载所有数据源
 * 优先级: _index 文件扫描 > 视图构建 > 实时扫描
 *
 * Tauri 模式：Rust scan_index_files 扫 workspace 下所有 _index
 * 浏览器模式（无Tauri）：回退
 */
export async function loadAll(): Promise<InitResult> {
  const hasTauri = typeof window !== "undefined"
    && ("__TAURI_INTERNALS__" in window || "__TAURI__" in window);

  if (!hasTauri) {
    console.log("[loader] browser mode — no _index scan available, returning empty");
    return { modules: [], views: [], bulletNames: ["编程主管"], liveScans: [] };
  }

  // ─── Tauri 生产模式：Rust 扫 _index ───
  console.log("[loader] Tauri v2 detected, scanning _index files");

  const workspaceRoot = "D:\\workspaces\\dev";
  let modules: Module[] = [];
  try {
    const t0 = performance.now();
    modules = await Promise.race([
      scanIndexFiles(workspaceRoot),
      new Promise<Module[]>((_, rej) =>
        setTimeout(() => rej(new Error("scanIndexFiles 5s timeout")), 5000)
      ),
    ]);
    const t1 = performance.now();
    console.log(
      `[loader] scanIndexFiles OK — ${modules.length} modules in ${(t1 - t0).toFixed(0)}ms`
    );
  } catch (e: any) {
    console.error("[loader] scanIndexFiles FAILED:", e?.message ?? e);
    return { modules: [], views: [], bulletNames: ["编程主管"], liveScans: [] };
  }

  // 构建视图 — 按类型分 Zone
  const views: View[] = [
    buildView("workspace_map", "编程主管 · 工作区地图", modules, [
      { zone: "🧠 定义层", match: m => m.meta.tags?.includes("定义") ?? false },
      { zone: "📋 日志层", match: m => m.meta.tags?.some(t => t.startsWith("日志")) ?? false },
      { zone: "🚀 项目空间", match: m => m.meta.tags?.some(t => t.startsWith("项目")) ?? false },
      { zone: "🗄️ 档案层", match: m => m.meta.tags?.some(t => t.startsWith("档案")) ?? false },
    ]),
  ];

  const bulletNames = ["编程主管"];
  const liveScans: LiveScan[] = [];
  return { modules, views, bulletNames, liveScans };
}
