---
module: true
id: status_cortex_hub
type: status_card
title: "🧠 molting3-cortex 大脑中枢"
bullet: "编程主管"
tags: ["Tauri 2.0", "React 19", "TypeScript", "Zustand", "Rust", "神经末梢"]
created: "2026-06-18T18:00:00+08:00"
updated: "2026-06-23T14:45:00+08:00"
pinned: true
live: true
children:
  - status_bookmarks
  - status_weather
  - status_mdreader
  - status_scripts
  - status_clouddrive
  - status_contacts
  - status_mobile
  - status_qclaw_alt
  - status_image_enhance
  - status_code_channel
links: ["output_key_files"]
---

## 状态: 🎯 v0.1.0 — 核心定位重校准

### 这个软件是什么

**编程主管的神经末梢系统。** 不是展示工具，不是文档浏览器，不是外部软件——是长在本地文件系统上的感知器官。

### 三层真实作用

| 层级 | 做什么 | 为谁 |
|------|--------|------|
| 文件监听 | modules/ 下 .md 变化 → 编程主管自动感知 | 编程主管 |
| 关联网 | 模块间依赖关系存储在 Rust 内存中，不是画线给人看 | 编程主管 |
| 快速恢复 | 上下文压缩后，21ms 扫描 44 模块恢复全景认知 | 编程主管 |
| 变化摘要 | 米豆打开软件看到"最近发生了什么" | 米豆 |
| 双击打开 | 调用系统默认 MD 阅读器，不内建编辑器 | 米豆 |

### 它不是什么

- ❌ 不是给编程主管日常浏览用的（md 文件就是原生界面）
- ❌ 不是第二个 MD 阅读器（已有独立项目）
- ❌ 不是画关系连线图给人看的
- ❌ 不是"编程主管也用 GUI 操作"的工具

### 核心设计原则

1. **本能优先** — 文件监听是编程主管的眼睛，不是被动等通知
2. **关联网是真数据** — 连接存储在一级内存（Rust struct），不是前端渲染层
3. **启动即恢复** — 上下文压缩后，打开软件 = 恢复神经连接
4. **米豆看结果** — 软件对米豆而言是"确认编程主管在管、记忆没丢"的审计窗口

### 技术栈落地

Rust + Tauri 2.0 天然匹配神经末梢架构：
- `notify` crate — 内核级文件监听，毫秒响应
- serde 序列化 — 关联数据直接加载到内存，不查"数据库"
- 已实现 scan_modules — 21ms 扫描 44 模块
- 本地二进制 — 神经末梢长在本地文件系统上

### 下一步

1. P1: 文件监听（notify crate）→ 感知变化
2. P2: 关联存储（Rust 内存中的真实依赖图）
3. P3: 变化摘要 → 米豆看到"最近变了什么"
## watcher test 14:58:49
