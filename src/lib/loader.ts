// 初始化载入 — 应用启动时加载模块和实时数据
import { scanModules, scanLive } from "@/lib/tauri-api";
import type { Module, View, LiveScan } from "@/types/module";
import { DEV_MODULES } from "@/lib/dev-modules";

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
  // 检测是否有 Tauri API 可用
  const hasTauri = typeof window !== "undefined"
    && "__TAURI__" in window;

  if (!hasTauri) {
    console.log("[loader] dev mode — using precompiled DEV_MODULES (" + DEV_MODULES.length + " modules)");
    return {
      modules: DEV_MODULES,
      views: [DEV_VIEW_PROJECTS, DEV_VIEW_WEATHER],
      bulletNames: ["编程主管", "米豆天气"],
      liveScans: [],
    };
  }

  // ─── 生产模式（Tauri） ───
  // 1. 扫描物理模块目录（dev: 项目 local modules/, prod: 配置路径）
  const modulesDir = "modules"; // dev 默认值，prod 从配置读取
  let modules: Module[] = [];
  try {
    modules = await scanModules(modulesDir);
  } catch {
    console.warn(`scan_modules(${modulesDir}) failed, continuing with empty modules`);
  }

  // 2. 加载视图定义（从 views/ 目录 .md 文件）
  let views: View[] = [DEV_VIEW_PROJECTS, DEV_VIEW_WEATHER];
  try {
    // TODO: 从 views/ 目录读取视图定义
  } catch {
    console.warn("view loading failed, using default");
  }

  // 3. 扫描 live 状态 — 从 Z:\molting3 读取子弹实时数据
  const molting3Root = "Z:\\molting3";
  let liveScans: LiveScan[] = [];
  try {
    liveScans = await scanLive(molting3Root);
  } catch {
    // molting3 目录不存在时静默降级
    console.warn(`molting3 root not found at ${molting3Root}, live scan skipped`);
  }

  // 4. 从 live scan + modules 合并子弹名
  const bulletNames = new Set<string>();
  liveScans.forEach((s) => bulletNames.add(s.bullet));
  modules.forEach((m) => {
    if (m.meta.bullet) bulletNames.add(m.meta.bullet);
  });

  return { modules, views, bulletNames: Array.from(bulletNames), liveScans };
}
