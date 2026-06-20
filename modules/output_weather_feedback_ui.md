---
module: true
id: output_weather_feedback_ui
type: output_list
title: 雨量校准反馈UI — 水位闭环
bullet: 天气APP
tags: [feedback, waterline, ui, home-page]
created: 2026-06-20T11:05:00+08:00
updated: 2026-06-20T11:20:00+08:00
---

## FeedbackSection — HomePage 雨量校准

### 交互设计

过去6小时内最多4个时间点可反馈:

| 动作 | 场景 | 水位变化 | 含义 |
|------|------|----------|------|
| ✅ 下了 | 预报有雨 + 真的下了 | +1 | 命中 |
| ✅ 下了 | 预报无雨 + 下了 | -3 | 漏报 (用户纠正) |
| ❌ 没下 | 预报有雨 + 没下 | -2 | 假警 |
| ❌ 没下 | 预报无雨 + 没下 | 0 | 正确拒绝 |

### 判定规则

- pop >= 40% → 预报有雨
- pop < 40% → 预报无雨
- 反馈对所有活跃源生效

### 防重复

- 本地 `submitted` Set 防止同次会话重复
- `fedBackTimes` 从 feedbacks 数组过滤已存记录
- 已反馈项显示结果(有颜色标记)，按钮不可交互

### 数据流

```
用户点 ✅/❌ 
  → addFeedback(记录) 
  → applyFeedback(更新水位, 6源) 
  → recomputeStats(重算准确率)
  → SourcesPage 实时可见变化
```

## 构建

- tsc 0 err, vite build 239KB JS
- Git: `1994629`
