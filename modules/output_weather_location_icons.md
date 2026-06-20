---
module: true
id: output_weather_location_icons
type: output_list
title: 定位+图标+原生配置
bullet: 天气APP
tags: [location, icons, capacitor, geolocation]
created: 2026-06-20T08:35:00+08:00
updated: 2026-06-20T08:45:00+08:00
---

## 定位服务

- `src/lib/location.ts`
- 三层降级: Capacitor Geolocation (GPS) → 高德IP定位 → 吉林市默认坐标 (43.84, 126.55)
- 高德逆地理编码 → 街道级地址 (district·street number号)
- GeoLocation 写入 Zustand Store

## 天气图标统一映射

- `src/lib/icons.ts` — classifyCondition(): 中文条件 → 12种 WeatherClass
- `src/components/WeatherIcon.tsx` — Lucide 图标渲染
- 映射规则: 正则匹配 (晴/多云/阴/雨/雷/雪/雾/霾/风/雨夹雪)

## Capacitor 原生配置

- `capacitor.config.ts`
- appId: com.midou.weather
- 插件: Geolocation (always)、SplashScreen
- 主题色 #0f172a (slate-900 深色)
- 开发模式 server.url 预留

## 构建

- tsc 0 err, vite build 229KB JS
- Git: `06599e7`
