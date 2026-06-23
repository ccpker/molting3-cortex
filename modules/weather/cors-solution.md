---
module: true
id: topic_cors_solution
type: conversation_topic
title: "天气API CORS解决方案"
bullet: "米豆天气"
tags: ["CORS", "网络", "决策"]
created: "2026-06-18T10:00:00+08:00"
updated: "2026-06-22T18:00:00+08:00"
---

# CORS / 网络请求方案

## 现状
天气APP需要请求多个第三方API（和风、彩云、高德等），面临CORS限制。

## 方案对比
| 方案 | 优点 | 缺点 |
|------|------|------|
| Tauri HTTP Plugin | 绕过CORS | 需Tauri壳 |
| Vite Proxy | 开发友好 | 生产不可用 |
| 自建中转 | 完全控制 | 运维成本 |

## 决策
当前采用 Tauri HTTP Plugin 方案。XHR fallback 用于 bypass 网络——android:usesCleartextTraffic=true，okhttp 处理明文。
