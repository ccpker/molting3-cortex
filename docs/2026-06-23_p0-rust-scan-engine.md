# molting3-cortex · P0 Rust真扫描引擎接通

**日期:** 2026-06-23 08:00–08:36  
**目标:** 用 Rust 后端 `scan_modules` 真扫描替换前端 `dev-modules.ts` 假数据

---

## 已完成

### 1. Rust 扫描引擎 (`src-tauri/src/lib.rs`)

**`scan_modules` 命令：**
- 入参 `dir_path: String`，递归扫描指定目录
- 跳过 `_` 开头的目录（`_registry/` 不扫描）
- 仅读取 `.md` 文件，用 `parse_module_file` 解析 frontmatter
- 返回 `Vec<Module>` JSON

**`parse_module_file` 函数：**
- 解析 YAML frontmatter（`--- ... ---` 分隔符）
- 提取字段：`id`, `title`, `type`, `bullet`, `tags`, `links`, `children`, `pinned`, `live`, `created`, `updated`, `description`
- `id` 为空时，使用文件名（去掉 `.md` 扩展名）
- `tags` 支持引号包裹的字符串和 YAML 数组
- `links` 支持 dict 和数组格式
- `sourcePath` 字段标记文件来源

**`scan_live` 命令：**
- 扫描线上项目目录，返回模块列表
- 可扩展为天气APP源码目录

### 2. Module 结构体 (`Module`)

```rust
pub struct Module {
    pub id: String,
    pub source_path: String,
    pub title: String,
    pub module_type: String,
    pub description: String,
    pub bullet: String,
    pub tags: Vec<String>,
    pub links: Vec<LinkItem>,
    pub children: Vec<String>,
    pub pinned: bool,
    pub live: bool,
    pub created: String,
    pub updated: String,
}
```

序列化：`serde::Serialize` + `camelCase` 字段命名。

### 3. 前端 loader.ts 路径修正

- Tauri 模式下调用 `scanModules("modules")` 
- 失败时降级到 DEV_MODULES
- 增加详细日志输出

### 4. 模块文件补全

**已创建文件（17个）：**

| 文件 | id | 用途 |
|------|----|------|
| `modules/molting3-cortex.md` | `status_cortex_hub` | 中枢总览 |
| `modules/weather/midou-weather-root.md` | `status_midou_weather` | 天气架构根 |
| `modules/weather/5tab-architecture.md` | `status_5tab_arch` | 5Tab架构 |
| `modules/weather/amap-adapter.md` | `status_amap` | 高德适配器 |
| `modules/weather/caiyun-adapter.md` | `status_caiyun` | 彩云适配器 |
| `modules/weather/cma-adapter.md` | `status_cma` | CMA适配器 |
| `modules/weather/qweather-adapter.md` | `status_qweather` | 和风适配器 |
| `modules/weather/openmeteo-source.md` | `status_openmeteo` | Open-Meteo |
| `modules/weather/caiyun-page.md` | `status_caiyunpage` | 彩云页面 |
| `modules/weather/qweather-page.md` | `status_qweatherpage` | 和风页面 |
| `modules/weather/custom-page.md` | `status_custompage` | 自定义页面 |
| `modules/weather/http-client.md` | `status_http_client` | HTTP客户端 |
| `modules/weather/key-files.md` | `output_key_files` | 关键文件 |
| `modules/weather/cors-solution.md` | `topic_cors_solution` | CORS方案 |
| `modules/weather/weight-algo.md` | `topic_weight_algo` | 权重算法 |
| `modules/weather/attack-timeline.md` | `status_attack_timeline` | 攻击时间轴 |
| `modules/weather/rhythm-bar.md` | `status_rhythm_bar` | 节奏条 |

**已删除重复文件：** `weight-algo-decision.md`, `cors-solution-decision.md`

### 5. 关键修复

- `molting3-cortex.md` id: `status_molting3_cortex` → `status_cortex_hub`（匹配视图）
- tags 解析支持引号包裹的字符串
- links 字段解析补充
- loader.ts 降级逻辑：Tauri 扫描失败时 fallback 到 DEV_MODULES

## 当前状态

- ✅ Rust 扫描引擎完整实现（3个 Tauri command）
- ✅ 17个模块文件已就绪，ID 匹配双视图需求
- ✅ 前端 loader 路径修正
- ✅ Tauri 桌面版编译成功（0.38s 增量）
- ✅ 浏览器 UI 验证通过（28模块正常渲染）
- ✅ GitHub 推送成功（2b28942）

## 待验证

- [ ] Tauri 桌面窗口内的 Rust 真扫描结果（需要看 webview console 确认模块数）
- [ ] 若 CWD 不是项目根，`modules/` 路径可能找不到（备选：环境变量 `__MODULES_DIR__`）

## 下一步

- 验证 Tauri 真扫描（打开桌面窗口检查模块是否来自文件系统）
- `_registry/` 目录设计：模块渲染规则、类型到组件的映射
- 天气APP源码目录整合为 live scan 数据源

---

*编程主管 | 2026-06-23 08:36*
