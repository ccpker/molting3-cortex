---
module: true
id: output_weather_data_depth
type: output_list
title: 数据深度增强 + SourcesPage V2
bullet: 天气APP
tags: [data-depth, statistics, snapshots, sources-page, accuracy]
created: 2026-06-20T08:41:00+08:00
updated: 2026-06-20T09:05:00+08:00
---

## 数据层增强

### 新类型
- `SourceSnapshot` — 单次读数快照 (时间/温度/条件/延迟/错误)
- `SourceStats` — 源统计 (总请求/错误数/平均延迟/命中/误报/漏报/准确率)
- `SourceState` 新增 `lastUpdated` 字段

### Store 增强
- `pushSnapshot(id, snap)` — 保留最近20条
- `recomputeStats()` — 从快照+反馈重算统计
- `applyFeedback` 联动统计重算

### WeatherService
- 每次请求后自动推快照 + 重算统计

## SourcesPage V2 三层

| 层 | 内容 |
|----|------|
| 1. 多源对标 | 各源温度条形图 + 条件文字对照 |
| 2. 详情卡片 | 6项指标: 温度/延迟/水位/准确率/命中/误报 |
| 3. 一致性 | 共识等级 + 温度分歧 + 天气一致率 + 可用源数 |

每个源卡片展示: 最后读数温度、响应延迟(avg)、水位趋势、准确率、命中/误报/漏报

## 构建

- tsc 0 err, vite build 236KB JS
- Git: `ae80961`
