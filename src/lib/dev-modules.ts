// 开发模式模块数据 — 编程主管 11 个项目体系 + 天气APP子模块
// 当 Tauri 不可用时（纯 Vite dev），由此文件提供模块数据

import type { Module } from "@/types/module";

const NOW = "2026-06-23T08:00:00+08:00";

export const DEV_MODULES: Module[] = [
  // ═══════════════════════════════════════════════
  // 编程主管 11 个项目体系
  // ═══════════════════════════════════════════════
  {
    meta: {
      id: "status_cortex_hub",
      type: "status_card",
      title: "🧠 molting3-cortex 大脑中枢",
      bullet: "编程主管",
      tags: ["Tauri 2.0", "React 19", "中枢项目", "pinned"],
      created: NOW,
      updated: NOW,
      children: [
        "status_bookmarks",
        "status_weather",
        "status_mdreader",
        "status_scripts",
        "status_clouddrive",
        "status_contacts",
        "status_mobile",
        "status_qclaw_alt",
        "status_image_enhance",
        "status_code_channel",
      ],
      pinned: true,
      live: true,
    },
    body: "模块化中枢系统 — 统一管理 11 个项目的状态、进度、架构决策。\n三大空间打通：定义层(modules/) → 加载层(loader.ts) → 渲染层(DashboardView)。\nTauri 2.0 构建成功(360 crates, 1m14s)，Vite dev 零 TS 错误。",
    sourcePath: "dev/modules/molting3-cortex.md",
  },

  {
    meta: {
      id: "status_bookmarks",
      type: "status_card",
      title: "🔖 书签程序",
      bullet: "编程主管",
      tags: ["Tauri 2.0", "React 19", "TS"],
      created: NOW,
      updated: NOW,
      pinned: false,
    },
    body: "## 状态: ⏳ Tauri迁移中\n\nBug#3-#6 待修复，#1/#2/#4 历史已修。源码在 `07_项目/书签程序/`，部署在 `D:\\001soft\\bookmark\\bookmarks-v2\\`。\n\n## 下一步\n- Bug#3/#5/#6 修复 → GitHub 公开",
    sourcePath: "dev/modules/bookmarks.md",
  },

  {
    meta: {
      id: "status_weather",
      type: "status_card",
      title: "🌤️ 米豆天气 V4.9",
      bullet: "编程主管",
      tags: ["React 19", "Capacitor 7", "pinned", "active"],
      created: NOW,
      updated: NOW,
      children: ["status_attack_timeline", "status_rhythm_bar", "status_five_source_fusion"],
      links: ["output_weather_apk", "topic_weight_algo", "topic_cors_solution"],
      pinned: true,
      live: true,
    },
    body: "五源融合天气APP · V4.9 攻击轴V7已完成。APK打包(4.85MB)待实测。\n五源：和风/彩云/Open-Meteo/高德/CMA。5Tab独立空间架构。\n部署: `Z:\\002soft\\002own\\001米豆天气\\`",
    sourcePath: "dev/modules/weather.md",
  },

  {
    meta: {
      id: "status_mdreader",
      type: "status_card",
      title: "📖 MD阅读器",
      bullet: "编程主管",
      tags: ["Tauri 2.0", "marked.js"],
      created: NOW,
      updated: NOW,
    },
    body: "## 状态: 🆕 v0.1.0 MVP\n\nTauri 2.0 + marked.js Markdown阅读器。原始代码 `Z:\\molting3\\md-reader\\`。",
    sourcePath: "dev/modules/md-reader.md",
  },

  {
    meta: {
      id: "status_scripts",
      type: "status_card",
      title: "📜 脚本维护",
      bullet: "编程主管",
      tags: ["Python", "PowerShell"],
      created: NOW,
      updated: NOW,
    },
    body: "## 状态: 🔄 日常维护\n\nPython + PowerShell 自动化脚本集合，按需维护。",
    sourcePath: "dev/modules/scripts.md",
  },

  {
    meta: {
      id: "status_clouddrive",
      type: "status_card",
      title: "💾 网盘挂载",
      bullet: "编程主管",
      tags: ["CloudDrive2", "ECS", "Z盘"],
      created: NOW,
      updated: NOW,
    },
    body: "## 状态: 🔄 运行中\n\nCloudDrive2 挂载 Z 盘，双空间架构基础设施。",
    sourcePath: "dev/modules/clouddrive.md",
  },

  {
    meta: {
      id: "status_contacts",
      type: "status_card",
      title: "📇 通讯录系统",
      bullet: "编程主管",
      tags: ["待选型"],
      created: NOW,
      updated: NOW,
    },
    body: "## 状态: 📋 需求阶段\n\n需求分析与技术选型。",
    sourcePath: "dev/modules/contacts.md",
  },

  {
    meta: {
      id: "status_mobile",
      type: "status_card",
      title: "📱 手机APP",
      bullet: "编程主管",
      tags: ["待选型"],
      created: NOW,
      updated: NOW,
    },
    body: "## 状态: 📋 需求阶段\n\n需求分析，平台选型(iOS/Android/跨平台)。",
    sourcePath: "dev/modules/mobile-app.md",
  },

  {
    meta: {
      id: "status_qclaw_alt",
      type: "status_card",
      title: "🔀 QClaw平替",
      bullet: "编程主管",
      tags: ["待调研"],
      created: NOW,
      updated: NOW,
    },
    body: "## 状态: 📋 需求阶段\n\nQClaw 平台替代方案调研。",
    sourcePath: "dev/modules/qclaw-alt.md",
  },

  {
    meta: {
      id: "status_image_enhance",
      type: "status_card",
      title: "🖼️ 图像强化",
      bullet: "编程主管",
      tags: ["AI", "图像处理"],
      created: NOW,
      updated: NOW,
    },
    body: "## 状态: 🆕 初始阶段\n\n确认技术方案（超分/去噪/增强），模型选型。",
    sourcePath: "dev/modules/image-enhance.md",
  },

  {
    meta: {
      id: "status_code_channel",
      type: "status_card",
      title: "🚀 代码通道",
      bullet: "编程主管",
      tags: ["GitHub加速", "CDN"],
      created: NOW,
      updated: NOW,
    },
    body: "## 状态: 🔄 运行中\n\nGitHub 加速与 CDN 维护，保障网络连通性。",
    sourcePath: "dev/modules/code-channel.md",
  },
  // ═══════ 根模块 ═══════
  {
    meta: {
      id: "status_midou_weather",
      type: "status_card",
      title: "🌤️ 米豆天气 V4.9",
      bullet: "米豆天气",
      tags: ["核心项目", "pinned"],
      created: NOW,
      updated: NOW,
      children: [
        "status_five_source_fusion",
        "status_openmeteo",
        "status_amap",
        "status_5tab_arch",
        "status_attack_timeline",
        "status_rhythm_bar",
        "status_http_client",
        "output_key_files",
        "topic_weight_algo",
        "topic_cors_solution",
      ],
      pinned: true,
      live: false,
    },
    body: "五源融合天气APP · Capacitor 7 + React 19 + TypeScript + Zustand + Tailwind CSS 4\n\n定位：全量白嫖展示各数据源完整能力，每源独立空间。\n版本迭代：V3.23(源码丢失)→V4.0重建→V4.9(当前)。",
    sourcePath: "dev/modules/status_midou_weather.md",
  },

  // ═══════ 数据源层 ═══════
  {
    meta: {
      id: "status_five_source_fusion",
      type: "status_card",
      title: "⚡ 五源融合引擎",
      bullet: "米豆天气",
      tags: ["核心", "active"],
      created: NOW,
      updated: NOW,
      children: [
        "status_qweather",
        "status_caiyun",
        "status_openmeteo",
        "status_amap",
        "status_cma",
      ],
      pinned: true,
    },
    body: "加权融合算法：\n• 温度 = 和风×0.4 + Open-Meteo×0.3 + 彩云×0.2 + 高德×0.1\n• 体感/降水概率/日出日落 = Open-Meteo 独占\n• 降水量 = 和风×0.5 + Open-Meteo×0.3 + 彩云×0.2\n• AQI/预警/生活指数 = 和风 独占\n• 异常天气攻击轴 = 彩云+和风分钟降水融合",
    sourcePath: "dev/modules/status_five_source_fusion.md",
  },

  {
    meta: {
      id: "status_qweather",
      type: "status_card",
      title: "🌪️ 和风天气适配器",
      bullet: "米豆天气",
      tags: ["活跃源", "VPS反代"],
      created: NOW,
      updated: NOW,
      links: ["status_five_source_fusion", "status_http_client"],
    },
    body: "接入方式：自定义反代 Host (k77h2tb3b6.re.qweatherapi.com)\n提供端点：实时/逐时/逐日/预警/AQI/生活指数/分钟降水\n特殊处理：风速归一化至蒲福风级(0-12)，条件码→中文映射",
    sourcePath: "dev/modules/status_qweather.md",
  },

  {
    meta: {
      id: "status_caiyun",
      type: "status_card",
      title: "🌈 彩云天气适配器",
      bullet: "米豆天气",
      tags: ["活跃源", "CF反代"],
      created: NOW,
      updated: NOW,
      links: ["status_five_source_fusion", "status_http_client", "topic_cors_solution"],
    },
    body: "接入方式：Cloudflare Pages Functions 反代 (midou-weather-caiyun.pages.dev)\n关键架构：fetchAll() 单次全量 + _parseAll() 内部分发，消除9端点时序竞争\nToken: 1byFbhxs1oMOWCYy (v2.6)\n提供：实况/分钟降水2h/逐时48h/逐日15d(取7)/生活指数5项/预警",
    sourcePath: "dev/modules/status_caiyun.md",
  },

  {
    meta: {
      id: "status_openmeteo",
      type: "status_card",
      title: "🌍 Open-Meteo 补充源",
      bullet: "米豆天气",
      tags: ["补充源", "原生CORS"],
      created: NOW,
      updated: NOW,
      links: ["status_five_source_fusion"],
    },
    body: "角色：第三方补充（不做主力源）\n提供字段：体感温度/日出日落/降水概率/风速风向\n超时机制：3s 超时，失败不阻塞主数据流\n特殊问题：日本节点延迟 ~1s",
    sourcePath: "dev/modules/status_openmeteo.md",
  },

  {
    meta: {
      id: "status_amap",
      type: "status_card",
      title: "🗺️ 高德地图适配器",
      bullet: "米豆天气",
      tags: ["空间基础设施", "geo"],
      created: NOW,
      updated: NOW,
      links: ["status_five_source_fusion"],
    },
    body: "角色：已从兜底天气源降级为**纯空间数据基础设施**\n提供：逆地理编码(含缓存，街道级地址) + IP定位降级\n配额：天气 5k 次/月\n定位降级链：GPS → 高德逆地理 → 高德IP → 硬编码长春",
    sourcePath: "dev/modules/status_amap.md",
  },

  {
    meta: {
      id: "status_cma",
      type: "status_card",
      title: "🏛️ CMA 气象局适配器",
      bullet: "米豆天气",
      tags: ["活跃源", "城市限制"],
      created: NOW,
      updated: NOW,
      links: ["status_five_source_fusion"],
    },
    body: "接入方式：apihz 原生 CORS\nID: 10016685 | KEY: e54c2408...cf9\n限制：仅支持地级市(city级)，不支持区级/经纬度\n降级策略：city → district → province 三级回退，失败不缓存",
    sourcePath: "dev/modules/status_cma.md",
  },

  // ═══════ 页面架构层 ═══════
  {
    meta: {
      id: "status_5tab_arch",
      type: "status_card",
      title: "🏗️ 5 Tab 独立空间架构",
      bullet: "米豆天气",
      tags: ["架构", "核心设计"],
      created: NOW,
      updated: NOW,
      children: ["status_custompage", "status_caiyunpage", "status_qweatherpage"],
    },
    body: "演进路径：五源融合单页 → 双Tab独立管道 → 5 Tab独立空间\n设计原则：每Tab独立数据管道+独立UI+独立缓存。切换时lastUpdated控制，不重新加载。\n5个Tab：自定义 | 彩云 | 和风 | 数据源 | 设置",
    sourcePath: "dev/modules/status_5tab_arch.md",
  },

  {
    meta: {
      id: "status_custompage",
      type: "status_card",
      title: "⭐ CustomPage 自定义页",
      bullet: "米豆天气",
      tags: ["pinned", "首屏"],
      created: NOW,
      updated: NOW,
      children: ["status_attack_timeline", "status_rhythm_bar"],
      links: ["status_caiyun", "status_qweather"],
    },
    body: "精选组合展示，调用已加载的彩云+和风数据（不重新请求）\n板块：Hero实时块(温度/状态/AQI/体感) → 攻击时间轴 → 节奏条 → 分钟降水\n特性：刷新双源按钮，通勤→睡眠排序，时间褪色效果",
    sourcePath: "dev/modules/status_custompage.md",
  },

  {
    meta: {
      id: "status_caiyunpage",
      type: "status_card",
      title: "📊 CaiyunPage 彩云全量",
      bullet: "米豆天气",
      tags: ["全量展示"],
      created: NOW,
      updated: NOW,
    },
    body: "全量7板块：实况 → 分钟级降水(2h) → 逐时(48h) → 逐日(7d/源15d) → 生活指数(5项) → 预警 → AQI详情\n关键修复：fetchAll单次全量替代9方法独立请求，消除时序竞争Bug",
    sourcePath: "dev/modules/status_caiyunpage.md",
  },

  {
    meta: {
      id: "status_qweatherpage",
      type: "status_card",
      title: "📈 QweatherPage 和风全量",
      bullet: "米豆天气",
      tags: ["全量展示"],
      created: NOW,
      updated: NOW,
    },
    body: "全量7板块对齐彩云：实况/逐时/逐日/生活指数/预警/AQI详情/分钟降水\nAPI适配已补齐(fetchLifeIndex/fetchAlerts/fetchAqiDetail)，UI渲染进行中",
    sourcePath: "dev/modules/status_qweatherpage.md",
  },

  // ═══════ 核心组件层 ═══════
  {
    meta: {
      id: "status_attack_timeline",
      type: "status_card",
      title: "⚔️ WeatherAttackTimeline V7",
      bullet: "米豆天气",
      tags: ["核心组件", "Bug密集", "V7重制"],
      created: NOW,
      updated: NOW,
      links: ["status_caiyun", "status_qweather", "topic_weight_algo"],
    },
    body: "isAttack 三分级：HEAVY(雨雪雷无条件) | LIGHT(雾霾风≥50%pop) | CLEAR(晴云阴≥50%pop)\nclassifyCondition 判据重排：显著天气优先(雷→雨→雪→霰→雾→风→阴→多云→晴)\n双通道裁决：有分钟降水精确判断 / 无分钟数据elapsed估算\n双格渲染：左强度(蓝) + 右概率(红)，百分比填高纯色模式\n73h span bug根因：分组阈值≤1→≤2导致级联合并",
    sourcePath: "dev/modules/status_attack_timeline.md",
  },

  {
    meta: {
      id: "status_rhythm_bar",
      type: "status_card",
      title: "🎵 WeatherRhythmBar",
      bullet: "米豆天气",
      tags: ["核心组件", "可视化"],
      created: NOW,
      updated: NOW,
      links: ["status_custompage"],
    },
    body: "逐时节奏可视化 · 通勤最上/睡眠最下排序\n效果：past区段褪色 + future区段亮色，时间刻度标注\n图标逻辑：概率>0显示雨/雷/雪图标，CMA阴天修正\n双数据源：mm降水量 + %概率并行底部展示",
    sourcePath: "dev/modules/status_rhythm_bar.md",
  },

  // ═══════ 基础设施层 ═══════
  {
    meta: {
      id: "status_http_client",
      type: "status_card",
      title: "🔌 HTTP Client 双模式",
      bullet: "米豆天气",
      tags: ["infra", "关键修复"],
      created: NOW,
      updated: NOW,
      links: ["status_caiyun", "status_qweather"],
    },
    body: "生产(APK): CapacitorHttp (scheme=https 避免CORS)\n开发(Vite): proxy 五源路由(/api/qweather 等)\n通用: XHR fallback (XMLHttpRequest 无CORS限制)\n关键修复：buildUrl 重写(修复 URL path 丢弃 bug)",
    sourcePath: "dev/modules/status_http_client.md",
  },

  // ═══════ 产出文件 ═══════
  {
    meta: {
      id: "output_key_files",
      type: "output_list",
      title: "📦 关键产出文件",
      bullet: "米豆天气",
      tags: ["产出"],
      created: NOW,
      updated: NOW,
    },
    body: "- midou-weather-v4.9-v7atk-debug.apk (4.85MB)\n- src/lib/icons.ts (classifyCondition判据)\n- src/components/WeatherAttackTimeline.tsx (V7重制)\n- src/pages/CustomPage.tsx (刷新双源)\n- src/lib/api/caiyun.ts (fetchAll单次全量)\n- src/lib/api/qweather.ts (和风适配器)\n- src/lib/config.ts (双模式baseUrl)\n- vite.config.ts (五源proxy)\n- capacitor.config.ts (Android https scheme)",
    sourcePath: "dev/modules/output_key_files.md",
  },

  // ═══════ 关键决策 ═══════
  {
    meta: {
      id: "topic_weight_algo",
      type: "conversation_topic",
      title: "🧮 五源加权融合算法决策",
      bullet: "米豆天气",
      tags: ["架构决策", "算法"],
      created: NOW,
      updated: NOW,
      links: ["status_five_source_fusion"],
    },
    body: "决策：温度取加权平均（和风0.4/OM0.3/彩云0.2/高德0.1），非简单平均。\n理由：和风数据最稳定(反代可控)、OM全球覆盖广、彩云分钟级精确、高德仅做空间基础设施。\n一致性检查：单源偏离>5°C时降权。\n替代方案已毙：心知(零增量)、星图云(仅7字段)、AccuWeather(付费)、百度天气(不可靠)。",
    sourcePath: "dev/modules/topic_weight_algo.md",
  },

  {
    meta: {
      id: "topic_cors_solution",
      type: "conversation_topic",
      title: "🌐 彩云CORS反代方案演进",
      bullet: "米豆天气",
      tags: ["架构决策", "网络"],
      created: NOW,
      updated: NOW,
      links: ["status_caiyun", "status_http_client"],
    },
    body: "问题：api.caiyunapp.com 无 Access-Control-Allow-Origin 头，浏览器/WebView全拦截。\n方案1(VPS反代): 被否决，无VPS控制权。\n方案2(Cloudflare Workers): 成功部署 midou-weather-caiyun.184344801.workers.dev，但公司网络封杀workers.dev。\n方案3(Cloudflare Pages Functions): 最终方案，midou-weather-caiyun.pages.dev，手机+家庭网络可用。\n核心修复：多端点和合并为fetchAll单次请求避免429。",
    sourcePath: "dev/modules/topic_cors_solution.md",
  },
];
