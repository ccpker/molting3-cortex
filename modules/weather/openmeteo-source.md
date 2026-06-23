---
module: true
id: status_openmeteo
type: status_card
title: "🌍 Open-Meteo 补充源"
bullet: "编程主管"
tags: ["补充源", "原生CORS"]
created: "2026-06-23T08:00:00+08:00"
updated: "2026-06-23T08:00:00+08:00"
links: ["status_five_source_fusion"]
---

角色：第三方补充（不做主力源）
提供字段：体感温度/日出日落/降水概率/风速风向
超时机制：3s 超时，失败不阻塞主数据流
特殊问题：日本节点延迟 ~1s
