// 依赖图模块 — Rust 内存中的正向+反向依赖关系
use serde::Serialize;
use std::collections::{HashMap, HashSet};

/// 依赖查询结果
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DepQuery {
    pub module_id: String,
    pub title: String,
    /// 我依赖谁 (forward)
    pub depends_on: Vec<DepNode>,
    /// 谁依赖我 (reverse)
    pub depended_by: Vec<DepNode>,
    /// 子模块
    pub children: Vec<DepNode>,
    /// 关联模块 (links)
    pub linked_to: Vec<DepNode>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DepNode {
    pub id: String,
    pub title: String,
}

/// 全局依赖图
#[derive(Debug, Clone, Default)]
pub struct DepGraph {
    /// module_id → 该模块的 children (正向)
    children: HashMap<String, Vec<String>>,
    /// module_id → 该模块的 links
    links: HashMap<String, Vec<String>>,
    /// module_id → 谁把此模块列为 children 或 links (反向引用)
    parents: HashMap<String, HashSet<String>>,
    /// module_id → title (快速查找)
    titles: HashMap<String, String>,
}

impl DepGraph {
    /// 从模块列表构建依赖图
    pub fn build(modules: &[crate::Module]) -> Self {
        let mut graph = DepGraph::default();

        for m in modules {
            let id = m.meta.id.clone();
            graph.titles.insert(id.clone(), m.meta.title.clone());

            // 正向: children
            if let Some(ref children) = m.meta.children {
                let child_ids: Vec<String> = children.iter().cloned().collect();
                for child_id in &child_ids {
                    graph
                        .parents
                        .entry(child_id.clone())
                        .or_default()
                        .insert(id.clone());
                }
                graph.children.insert(id.clone(), child_ids);
            }

            // 正向: links
            if let Some(ref links) = m.meta.links {
                let link_ids: Vec<String> = links.iter().cloned().collect();
                for link_id in &link_ids {
                    graph
                        .parents
                        .entry(link_id.clone())
                        .or_default()
                        .insert(id.clone());
                }
                graph.links.insert(id.clone(), link_ids);
            }
        }

        graph
    }

    /// 查询某个模块的依赖关系
    pub fn query(&self, module_id: &str) -> Option<DepQuery> {
        let title = self
            .titles
            .get(module_id)
            .cloned()
            .unwrap_or_else(|| module_id.to_string());

        let resolve = |ids: &[String]| -> Vec<DepNode> {
            ids.iter()
                .map(|id| DepNode {
                    id: id.clone(),
                    title: self.titles.get(id).cloned().unwrap_or_else(|| id.clone()),
                })
                .collect()
        };

        let depends_on = resolve(self.children.get(module_id).unwrap_or(&vec![]));
        let children = depends_on.clone();

        let linked_to = resolve(self.links.get(module_id).unwrap_or(&vec![]));

        let depended_by: Vec<DepNode> = self
            .parents
            .get(module_id)
            .map(|set| {
                set.iter()
                    .map(|id| DepNode {
                        id: id.clone(),
                        title: self
                            .titles
                            .get(id)
                            .cloned()
                            .unwrap_or_else(|| id.clone()),
                    })
                    .collect()
            })
            .unwrap_or_default();

        Some(DepQuery {
            module_id: module_id.to_string(),
            title,
            depends_on,
            depended_by,
            children,
            linked_to,
        })
    }

    /// 查找受影响模块：改 module_id 后，谁需要重新验证
    pub fn affected(&self, module_id: &str) -> AffectedResult {
        let mut affected = Vec::new();
        let mut seen = HashSet::new();

        // BFS 沿反向引用传播：谁依赖于我 → 谁依赖于他们 → ...
        let mut queue: Vec<String> = self
            .parents
            .get(module_id)
            .map(|s| s.iter().cloned().collect())
            .unwrap_or_default();

        while let Some(id) = queue.pop() {
            if seen.contains(&id) {
                continue;
            }
            seen.insert(id.clone());

            let title = self
                .titles
                .get(&id)
                .cloned()
                .unwrap_or_else(|| id.clone());

            affected.push(DepNode {
                id: id.clone(),
                title,
            });

            // 继续传播
            if let Some(parents) = self.parents.get(&id) {
                for p in parents {
                    if !seen.contains(p) {
                        queue.push(p.clone());
                    }
                }
            }
        }

        AffectedResult {
            source: module_id.to_string(),
            affected,
        }
    }

    /// 获取所有模块 ID（用于 TopBar 计数等）
    pub fn module_count(&self) -> usize {
        self.titles.len()
    }

    /// 与旧图对比，返回变更摘要
    pub fn diff(&self, old: &DepGraph) -> GraphDiff {
        let mut added = Vec::new();
        let mut removed = Vec::new();
        let mut changed = Vec::new();

        for (id, title) in &self.titles {
            if !old.titles.contains_key(id) {
                added.push(DepNode { id: id.clone(), title: title.clone() });
            } else {
                // 检查 children/links 是否变了
                let old_children = old.children.get(id).cloned().unwrap_or_default();
                let new_children = self.children.get(id).cloned().unwrap_or_default();
                let old_links = old.links.get(id).cloned().unwrap_or_default();
                let new_links = self.links.get(id).cloned().unwrap_or_default();
                if old_children != new_children || old_links != new_links || old.titles.get(id) != Some(title) {
                    changed.push(DepNode { id: id.clone(), title: title.clone() });
                }
            }
        }
        for id in old.titles.keys() {
            if !self.titles.contains_key(id) {
                let title = old.titles.get(id).cloned().unwrap_or_else(|| id.clone());
                removed.push(DepNode { id: id.clone(), title });
            }
        }

        GraphDiff { added, removed, changed }
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AffectedResult {
    pub source: String,
    pub affected: Vec<DepNode>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GraphDiff {
    pub added: Vec<DepNode>,
    pub removed: Vec<DepNode>,
    pub changed: Vec<DepNode>,
}
