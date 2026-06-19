---
module: true
id: topic_weather_waterline
type: conversation_topic
title: 天气源水位反馈系统
bullet: 天气APP
tags: [design, 水位线, 反馈学习, 权重]
created: 2026-06-19T23:39:00+08:00
updated: 2026-06-19T23:40:00+08:00
---

## 问题

6 个天气数据源，哪个更准？静态权重无法反映真实准确度。

## 方案: Waterline 水位线

每个数据源维护一个水位值，根据用户反馈动态调整：

- 预报有雨 + 反馈"下了" → 水位 +1 (命中)
- 预报有雨 + 反馈"没下" → 水位 -2 (假警比漏报烦)
- 预报无雨 + 反馈"下了" → 水位 -3 (漏报最坑)
- 未反馈 → 水位缓慢归零

最终权重 = softmax(水位 × 基础权重)

降雨时间轴每个时段旁放 `下了✅` / `没下❌` 按钮，用户随手反馈即训练。

## 实现

- 类型: `RainFeedback` (forecastTime, predicted, actual)
- Store: `applyFeedback(feedback, sourceIds)` 批量更新水位
- 数据页显示水位排行 + 最近校准记录

## 期望效果

用一个月后 APP 自动知道"彩云在吉林昌邑区最准，和风容易放鸽子"。
