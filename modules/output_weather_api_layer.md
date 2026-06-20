---
module: true
id: output_weather_api_layer
type: output_list
title: 天气API数据融合层
bullet: 天气APP
tags: [api, 融合, 6源, technical]
created: 2026-06-20T08:31:00+08:00
updated: 2026-06-20T08:45:00+08:00
---

## 架构

```
src/lib/
  config.ts          API配置 (6源端点+Key)
  api/
    types.ts         归一化接口 + SourceFetchResult
    client.ts        HTTP基础客户端 (fetch, AbortController超时)
    qweather.ts      和风天气 — 独立Host + JWT, now/24h/7d
    seniverse.ts     心知天气 — now/daily
    amap.ts          高德地图 — now/daily + 风力等级→m/s转换
    caiyun.ts        彩云天气 — now/hourly/daily/分钟级降雨
    cma.ts           中国气象局 — JSONP解析 (生产需原生插件)
    api_box.ts       接口盒子 — 钻石会员 now/daily
    fusion.ts        融合引擎 — 加权平均/众数/拐点检测/置信度
  weather-service.ts WeatherService — Promise.all并发调度 + Store同步
  useWeather.ts      React Hook — 组件消费入口
```

## 融合策略

- 温度: 加权平均 (有水位值的源权重大)
- 天气现象: 众数投票
- 降水概率: 中位值
- 变化节点: 温度趋势反转或降雨突变(>5mm/h)标记
- 置信度: 温差≤2°C + 现象一致 → high / ≤5°C → medium / 其他 → low

## 构建验证

- tsc --noEmit → 0 错误
- vite build → 222.73 KB JS + 21.69 KB CSS
