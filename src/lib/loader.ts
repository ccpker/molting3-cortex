// 初始化载入 — 应用启动时加载模块和实时数据
import type { View } from "@/types/module";
import type { Module, LiveScan } from "@/types/module";
import { DEV_MODULES } from "@/lib/dev-modules";
import { scanModules } from "@/lib/tauri-api";

export interface InitResult {
  modules: Module[];
  views: View[];
  bulletNames: string[];
  liveScans: LiveScan[];
}

// 编程主管 11 个项目总览（开发模式）
const DEV_VIEW_PROJECTS: View = {
  id: "projects_master",
  title: "编程主管 · 项目总览",
  layout: "grid",
  zones: [
    {
      title: "🧠 中枢",
      modules: ["status_cortex_hub"],
    },
    {
      title: "🚀 活跃项目",
      modules: [
        "status_bookmarks",
        "status_weather",
        "status_code_channel",
      ],
    },
    {
      title: "🔄 运行中 & 维护",
      modules: [
        "status_mdreader",
        "status_scripts",
        "status_clouddrive",
      ],
    },
    {
      title: "📋 需求阶段",
      modules: [
        "status_contacts",
        "status_mobile",
        "status_qclaw_alt",
        "status_image_enhance",
      ],
    },
  ],
};

// 天气APP架构视图（开发模式）
const DEV_VIEW_WEATHER: View = {
  id: "weather_arch",
  title: "米豆天气 · 架构建模",
  layout: "grid",
  zones: [
    {
      title: "🌤️ 项目总览",
      modules: ["status_midou_weather"],
    },
    {
      title: "⚡ 数据源层",
      modules: [
        "status_five_source_fusion",
        "status_qweather",
        "status_caiyun",
        "status_openmeteo",
        "status_amap",
        "status_cma",
      ],
    },
    {
      title: "🏗️ 页面与组件",
      modules: [
        "status_5tab_arch",
        "status_custompage",
        "status_caiyunpage",
        "status_qweatherpage",
        "status_attack_timeline",
        "status_rhythm_bar",
      ],
    },
    {
      title: "🔧 基础设施 & 决策",
      modules: [
        "status_http_client",
        "output_key_files",
        "topic_weight_algo",
        "topic_cors_solution",
      ],
    },
  ],
};

/**
 * 加载所有数据源
 * 优先级: 模块文件 > 视图定义 > 实时扫描
 *
 * 开发模式（无Tauri）：使用预编译的 DEV_MODULES
 * 生产模式（Tauri）：扫描物理目录
 */
export async function loadAll(): Promise<InitResult> {
  // Tauri 2.0 检测：__TAURI_INTERNALS__ 全局变量
  // (Tauri 1.0 用 __TAURI__，本项目是 Tauri 2.0)
  const hasTauri = typeof window !== "undefined"
    && ("__TAURI_INTERNALS__" in window || "__TAURI__" in window);

  if (!hasTauri) {
    console.log("[loader] browser mode — no Tauri runtime, using DEV_MODULES (" + DEV_MODULES.length + " modules)");
    return {
      modules: DEV_MODULES,
      views: [DEV_VIEW_PROJECTS, DEV_VIEW_WEATHER],
      bulletNames: ["编程主管", "米豆天气"],
      liveScans: [],
    };
  }

  // ─── Tauri 生产模式：Rust 真扫描 ───
  console.log("[loader] Tauri v2 detected, starting scan pipeline");

  // 1. 扫描模块 — 使用绝对路径，防止 CWD 不在项目根
  //    加 5s 超时：Rust 崩了不会永久挂起前端
  const moduleRoot = "D:\\workspaces\\dev\\projects\\molting3-cortex\\modules";
  console.log(`[loader] scanModules dir: ${moduleRoot}`);
  let modules: Module[] = [];
  try {
    const t0 = performance.now();
    modules = await Promise.race([
      scanModules(moduleRoot),
      new Promise<Module[]>((_, rej) =>
        setTimeout(() => rej(new Error("scanModules 5s timeout")), 5000)
      ),
    ]);
    const t1 = performance.now();
    console.log(`[loader] scanModules OK — ${modules.length} modules in ${(t1 - t0).toFixed(0)}ms`);
  } catch (e: any) {
    console.error(`[loader] scanModules FAILED:`, e?.message ?? e);
    console.log("[loader] falling back to DEV_MODULES");
    modules = DEV_MODULES;
  }

  // 2. 视图定义（TODO: 从 views/ 目录扫描）
  const views: View[] = [DEV_VIEW_PROJECTS, DEV_VIEW_WEATHER];

  // 3. Live scan (TODO: 启用 scan_live)
  const liveScans: LiveScan[] = [];

  return { modules, views, bulletNames: ["编程主管", "米豆天气"], liveScans };
}
