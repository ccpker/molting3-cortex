---
module: true
id: output_weather_settings_v2
type: output_list
title: 设置页 V2 — 源管理 + 权重调节
bullet: 天气APP
tags: [settings, sources, weight, toggle]
created: 2026-06-20T11:09:00+08:00
updated: 2026-06-20T11:30:00+08:00
---

## Store 新增动作

- `toggleSource(id)` — 源启用/禁用切换
- `setSourceWeight(id, weight)` — 权重 0-10, 步进 0.5

## SettingsPage V2 布局

### 1. 数据源管理 (折叠卡片)
6源行，每行含:
- 名称 + 描述 (小字)
- 开关 (ToggleRight/ToggleLeft)
- 状态条: 水位(带趋势图标) + 延迟 + 准确率
- 权重滑块 (range 0-10)

### 2. 通用设置 (折叠卡片)
- 城市管理 (x个城市)
- 下雨提醒 (开启)
- 远程配置 (版本号/未连接)

### 3. 关于
- 版本: 米豆天气 v4.0.0
- 引擎: 6源加权融合 + 水位学习
- 免责: 仅作参考

## 三页壳完成

| 页面 | 状态 | 内容 |
|------|------|------|
| HomePage | ✅ | 定位+NowCard+时间轴+反馈+7日 |
| SourcesPage | ✅ | 对标+详情卡片+一致性 |
| SettingsPage | ✅ | 源开关+权重+通用+关于 |

## 构建

- tsc 0 err, vite build 245KB JS
- Git: `9588f4d`
