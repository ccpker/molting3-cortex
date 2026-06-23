---
module: true
id: status_cma
type: status_card
title: "🏛️ CMA 气象局适配器"
bullet: "编程主管"
tags: ["活跃源", "城市限制"]
created: "2026-06-23T08:00:00+08:00"
updated: "2026-06-23T08:00:00+08:00"
links: ["status_five_source_fusion"]
---

接入方式：apihz 原生 CORS
ID: 10016685 | KEY: e54c2408...cf9
限制：仅支持地级市(city级)，不支持区级/经纬度
降级策略：city → district → province 三级回退，失败不缓存
