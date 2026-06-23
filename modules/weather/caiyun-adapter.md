---
module: true
id: status_caiyun
type: status_card
title: "🌈 彩云天气适配器"
bullet: "编程主管"
tags: ["活跃源", "CF反代"]
created: "2026-06-23T08:00:00+08:00"
updated: "2026-06-23T08:00:00+08:00"
links: ["status_five_source_fusion", "status_http_client", "topic_cors_solution"]
---

接入方式：Cloudflare Pages Functions 反代 (midou-weather-caiyun.pages.dev)
关键架构：fetchAll() 单次全量 + _parseAll() 内部分发，消除9端点时序竞争
Token: 1byFbhxs1oMOWCYy (v2.6)
提供：实况/分钟降水2h/逐时48h/逐日15d(取7)/生活指数5项/预警
