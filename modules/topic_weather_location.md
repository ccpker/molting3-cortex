---
module: true
id: topic_weather_location
type: conversation_topic
title: 精确定位到街道
bullet: 天气APP
tags: [design, 定位, GPS, 逆地理编码]
created: 2026-06-19T23:40:00+08:00
updated: 2026-06-19T23:40:00+08:00
---

## 问题

"吉林市"范围太大（27120 km²），同城不同区域天气差异可达 3°C + 降雨有无。

## 方案

Capacitor Geolocation → GPS 坐标 (4位小数，~11米精度) → 所有天气API按坐标查询 → 高德逆地理编码显示"昌邑区·延安路附近"

## 技术栈

- `@capacitor/geolocation@7` 获取 GPS
- 高德地图 JS API 逆地理编码 (Key 已有)
- 彩云/和风/心知/高德全支持坐标查询

## 显示策略

- 顶部显示: "昌邑区·延安路附近"
- 无需用户手动选城市 (除非添加常用城市)
- 当前城市自动设为定位城市
