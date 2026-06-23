---
module: true
id: status_attack_timeline
type: status_card
title: "WeatherAttackTimeline V7"
bullet: "米豆天气"
tags: ["攻击轴", "三级判定", "V7"]
created: "2026-06-18T10:00:00+08:00"
updated: "2026-06-23T06:00:00+08:00"
pinned: false
live: true
links: ["status_rhythm_bar"]
---

## 状态: ✅ V7 完成

三分级攻击判定系统：HEAVY（雨雪雷无条件）→ LIGHT（雾霾风需pop≥50%）→ CLEAR（晴云阴需pop≥50%）。双通道裁决：有分钟降水→精确到分钟；无分钟数据→elapsed>0.7且无雨→不算攻击。显著天气优先判据顺序。

## 下一步

- APK 实测
- 验证边界条件
