---
module: true
id: _registry_status_card
type: markdown
title: "StatusCard 类型定义"
tags: [_registry]
created: "2026-06-23T07:58:00+08:00"
updated: "2026-06-23T07:58:00+08:00"
---

# StatusCard

**用途**: 描述一个实体（项目/人物/系统）的当前状态快照。

## Schema

| 字段 | 必填 | 说明 |
|------|------|------|
| id | ✅ | 唯一ID |
| type | ✅ | 固定 `status_card` |
| title | ✅ | 实体名称 |
| bullet | 否 | 所属子弹 |
| tags | 否 | 标签列表（技术栈等） |
| created | ✅ | 创建时间 |
| updated | ✅ | 最后更新时间 |
| children | 否 | 子模块ID列表 |
| links | 否 | 关联模块ID列表 |
| pinned | 否 | 是否置顶 |
| live | 否 | 是否实时刷新 |

## Body 格式

```md
## 状态: {状态标记}

{描述段落}

## 下一步

- {待办1}
- {待办2}
```

## 渲染映射

→ `EnhancedStatusCard` 组件（DashboardView.tsx）
