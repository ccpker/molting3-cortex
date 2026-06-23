---
module: true
id: status_amap
type: status_card
title: "🗺️ 高德地图适配器"
bullet: "编程主管"
tags: ["空间基础设施", "geo"]
created: "2026-06-23T08:00:00+08:00"
updated: "2026-06-23T08:00:00+08:00"
links: ["status_five_source_fusion"]
---

角色：已从兜底天气源降级为**纯空间数据基础设施**
提供：逆地理编码(含缓存，街道级地址) + IP定位降级
配额：天气 5k 次/月
定位降级链：GPS → 高德逆地理 → 高德IP → 硬编码长春
