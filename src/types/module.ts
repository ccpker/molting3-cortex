// 模块类型定义 — molting3-cortex 核心数据模型

// ─── 模块元数据（对应 .md frontmatter） ───
export interface ModuleMeta {
  id: string;                           // 全局唯一ID
  type: ModuleType;                     // 渲染类型
  title: string;                        // 显示标题
  bullet?: string;                      // 所属子弹
  tags?: string[];
  created: string;                      // ISO-8601
  updated: string;
  children?: string[];                  // 嵌套子模块ID
  links?: string[];                     // 关联模块ID
  pinned?: boolean;
  live?: boolean;                       // 是否实时刷新
}

// ─── 完整模块 = 元数据 + 内容 ───
export interface Module {
  meta: ModuleMeta;
  body: string;                         // Markdown 正文
  sourcePath: string;                   // 文件路径
}

// ─── 模块类型枚举 ───
export type ModuleType =
  | "status_card"
  | "output_list"
  | "conversation_topic"
  | "timeline"
  | "markdown";

// ─── 模块类型定义（来自 _registry） ───
export interface ModuleTypeDef {
  type: ModuleType;
  name: string;
  description: string;
  icon: string;
  schema: {
    required_fields: string[];
    optional_fields: string[];
  };
  defaultLayout: {
    width: string;
    height: string;
  };
}

// ─── 视图定义 ───
export interface ViewZone {
  title: string;
  modules: string[];                    // 模块ID列表
}

export interface View {
  id: string;
  title: string;
  layout: "grid" | "list" | "free";     // free = 未来拖拽自由布局
  zones: ViewZone[];
}

// ─── 实时扫描结果（live模块用） ───
export interface LiveScan {
  bullet: string;                       // 子弹名
  status: "active" | "dormant" | "unknown";
  lastAction: string;                   // 最后动作描述
  lastActionAt: string;
  outputCount: number;
  unreadMail: number;
  recentFiles: { path: string; updated: string }[];
}

// ─── 应用状态（zustand store） ───
export type ViewMode = "dashboard" | "bullet" | "editor" | "timeline";

export interface AppState {
  viewMode: ViewMode;
  activeBullet: string | null;          // 当前选中的子弹
  activeModule: string | null;          // 当前展开的模块
  modules: Map<string, Module>;         // 所有已加载模块
  views: Map<string, View>;             // 所有视图
  bullets: string[];                    // 子弹名列表
}
