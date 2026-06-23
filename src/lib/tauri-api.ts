// Tauri API 桥接层 — 封装所有 invoke 调用
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { Module, ModuleMeta, LiveScan } from "@/types/module";

/** 扫描目录下所有 module:true 的 .md 文件 */
export async function scanModules(dirPath: string): Promise<Module[]> {
  return invoke<Module[]>("scan_modules", { dirPath });
}

/** 扫描 workspace 中所有 _index 文件，将文件夹作为模块（新架构） */
export async function scanIndexFiles(rootPath: string): Promise<Module[]> {
  return invoke<Module[]>("scan_index_files", { rootPath });
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

// ─── 依赖图查询 ───

export interface DepNode {
  id: string;
  title: string;
}

export interface DepQuery {
  moduleId: string;
  title: string;
  dependsOn: DepNode[];
  dependedBy: DepNode[];
  children: DepNode[];
  linkedTo: DepNode[];
}

export interface AffectedResult {
  source: string;
  affected: DepNode[];
}

/** 查询模块依赖关系 */
export async function queryDeps(moduleId: string): Promise<DepQuery> {
  return invoke<DepQuery>("query_deps", { moduleId });
}

/** 查询"改了此模块会影响到谁" */
export async function queryAffected(moduleId: string): Promise<AffectedResult> {
  return invoke<AffectedResult>("query_affected", { moduleId });
}

// ─── 依赖图变更 ───

export interface GraphDiff {
  added: DepNode[];
  removed: DepNode[];
  changed: DepNode[];
}

export interface RebuildResult {
  moduleCount: number;
  added: number;
  removed: number;
  changed: number;
}

/** 监听依赖图变更事件 */
export function onGraphChanged(callback: (diff: GraphDiff) => void): Promise<() => void> {
  return listen<GraphDiff>("graph-changed", (event) => {
    callback(event.payload);
  });
}

/** 重建依赖图（文件变化后调用） */
export async function rebuildGraph(): Promise<RebuildResult> {
  return invoke<RebuildResult>("rebuild_graph");
}

/** 查询依赖图统计 */
export async function depStats(): Promise<{ moduleCount: number }> {
  return invoke<{ moduleCount: number }>("dep_stats");
}
