---
module: true
id: status_http_client
type: status_card
title: "🔌 HTTP Client 双模式"
bullet: "编程主管"
tags: ["infra", "关键修复"]
created: "2026-06-23T08:00:00+08:00"
updated: "2026-06-23T08:00:00+08:00"
links: ["status_caiyun", "status_qweather"]
---

生产(APK): CapacitorHttp (scheme=https 避免CORS)
开发(Vite): proxy 五源路由(/api/qweather 等)
通用: XHR fallback (XMLHttpRequest 无CORS限制)
关键修复：buildUrl 重写(修复 URL path 丢弃 bug)
