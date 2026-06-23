---
module: true
id: topic_weight_algo
type: conversation_topic
title: "天气加权融合算法"
bullet: "米豆天气"
tags: ["算法", "决策"]
created: "2026-06-18T10:00:00+08:00"
updated: "2026-06-22T18:00:00+08:00"
---

# 五源融合加权算法

## 现状
当前采用优先级排序：和风 > 彩云 > Open-Meteo > 高德 > CMA

## 待讨论
- 是否引入动态权重的 Q 因子？
- 局部数据源（如 user_report）如何纳入？
- 可信度衰减曲线设计

## 决策
当前阶段保持优先级排序，V5.0 后考虑引入 Q 因子动态权重。
