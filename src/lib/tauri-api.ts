// Tauri API 桥接层 — 封装所有 invoke 调用
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { Module, ModuleMeta, LiveScan } from "@/types/module";

/** 扫描目录下所有 module:true 的 .md 文件 */
export async function scanModules(dirPath: string): Promise<Module[]> {
  return invoke<Module[]>("scan_modules", { dirPath });
}

/** 写入模块文件 */
export async function writeModule(
  path: string,
  meta: ModuleMeta,
  body: string
): Promise<void> {
  return invoke<void>("write_module", { path, meta, body });
}

/** 扫描 molting3 子弹目录获取实时状态 */
export async function scanLive(molting3Root: string): Promise<LiveScan[]> {
  return invoke<LiveScan[]>("scan_live", { molting3Root });
}

// ─── 文件监听 ───

export interface FileChangeEvent {
  path: string;
  kind: "modified" | "created" | "removed";
}

/** 监听 modules/ 目录的文件变更，返回取消订阅函数 */
export function onFileChange(callback: (ev: FileChangeEvent) => void): Promise<() => void> {
  return listen<FileChangeEvent>("file-change", (event) => {
    callback(event.payload);
  });
}
