// 初始化载入 — 应用启动时加载模块和实时数据
import { scanModules, scanLive } from "@/lib/tauri-api";
import type { Module, View, LiveScan } from "@/types/module";

export interface InitResult {
  modules: Module[];
  views: View[];
  bulletNames: string[];
  liveScans: LiveScan[];
}

/**
 * 加载所有数据源
 * 优先级: 模块文件 > 视图定义 > 实时扫描
 *
 * TODO: 未来从 QClaw config 中读取路径配置
 */
export async function loadAll(): Promise<InitResult> {
  // 1. 扫描物理模块目录（dev: 项目 local modules/, prod: 配置路径）
  const modulesDir = "modules"; // dev 默认值，prod 从配置读取
  let modules: Module[] = [];
  try {
    modules = await scanModules(modulesDir);
  } catch {
    console.warn(`scan_modules(${modulesDir}) failed, continuing with empty modules`);
  }

  // 2. 加载视图定义（暂硬编码空）
  const views: View[] = [];

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
