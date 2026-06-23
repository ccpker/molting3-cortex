use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri;
use tauri::Manager;

mod watcher;
mod dep_graph;

// ─── 数据结构（与前端 types/module.ts 对齐） ───

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ModuleMeta {
    pub id: String,
    #[serde(rename = "type")]
    pub module_type: String,
    pub title: String,
    pub bullet: Option<String>,
    pub tags: Option<Vec<String>>,
    pub created: String,
    pub updated: String,
    pub children: Option<Vec<String>>,
    pub links: Option<Vec<String>>,
    pub pinned: Option<bool>,
    pub live: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Module {
    pub meta: ModuleMeta,
    pub body: String,
    pub source_path: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LiveScan {
    pub bullet: String,
    pub status: String,
    pub last_action: String,
    pub last_action_at: String,
    pub output_count: u64,
    pub unread_mail: u64,
    pub recent_files: Vec<RecentFile>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RecentFile {
    pub path: String,
    pub updated: String,
}

// ─── 文件监听 ───

/// 文件变更事件，通过 Tauri event 推送到前端
#[derive(Debug, Clone, Serialize)]
pub struct FileChangeEvent {
    pub path: String,
    pub kind: String,  // "created" | "modified" | "removed"
}

// ─── Tauri 命令 ───

/// 扫描目录下所有 module: true 的 .md 文件
#[tauri::command]
fn scan_modules(dir_path: String) -> Result<Vec<Module>, String> {
    let dir = std::path::Path::new(&dir_path);
    if !dir.exists() {
        return Ok(vec![]);
    }
    let mut modules = Vec::new();
    scan_md_files(dir, &mut modules)?;
    Ok(modules)
}

fn scan_md_files(dir: &std::path::Path, modules: &mut Vec<Module>) -> Result<(), String> {
    if !dir.is_dir() {
        return Ok(());
    }
    let entries = std::fs::read_dir(dir).map_err(|e| e.to_string())?;
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if path.is_dir() {
            // skip _registry (handled separately) and hidden dirs
            let name = path.file_name().unwrap_or_default().to_string_lossy();
            if !name.starts_with('_') && !name.starts_with('.') {
                scan_md_files(&path, modules)?;
            }
        } else if path.extension().map(|e| e == "md").unwrap_or(false) {
            if let Some(module) = parse_module_file(&path) {
                modules.push(module);
            }
        }
    }
    Ok(())
}

/// 解析单个 .md 文件为 Module
fn parse_module_file(path: &std::path::Path) -> Option<Module> {
    let content = std::fs::read_to_string(path).ok()?;

    // 解析 YAML frontmatter (--- 开头)
    if !content.starts_with("---") {
        return None;
    }

    let rest = content.trim_start_matches("---").trim_start();
    let fm_end = rest.find("---")?;
    let fm_str = &rest[..fm_end];
    let body = rest[fm_end + 3..].trim().to_string();

    // 简单 YAML 解析（仅提取已知字段）
    let mut meta = ModuleMeta {
        id: String::new(),
        module_type: String::new(),
        title: String::new(),
        bullet: None,
        tags: None,
        created: String::new(),
        updated: String::new(),
        children: None,
        links: None,
        pinned: None,
        live: None,
    };

    let mut module_flag = false;
    for line in fm_str.lines() {
        let line = line.trim();
        if let Some((key, value)) = line.split_once(':') {
            let value = value.trim().trim_matches(|c| c == '"' || c == '\'');
            match key.trim() {
                "module" => module_flag = value == "true",
                "id" => meta.id = value.to_string(),
                "type" => meta.module_type = value.to_string(),
                "title" => meta.title = value.to_string(),
                "bullet" => meta.bullet = Some(value.to_string()),
                "tags" => {
                    meta.tags = Some(
                        value
                            .trim_matches(|c| c == '[' || c == ']')
                            .split(',')
                            .map(|s| s.trim().trim_matches(|c| c == '"' || c == '\'' || c == ' ').to_string())
                            .filter(|s| !s.is_empty())
                            .collect(),
                    );
                }
                "created" => meta.created = value.to_string(),
                "updated" => meta.updated = value.to_string(),
                "pinned" => meta.pinned = Some(value == "true"),
                "live" => meta.live = Some(value == "true"),
                _ => {}
            }
        }
    }

    if !module_flag {
        return None;
    }

    // 如果 frontmatter 未写 children/links 用 body 中 - child:id 解析
    if meta.children.is_none() {
        let children: Vec<String> = body
            .lines()
            .filter(|l| l.trim().starts_with("- mod_") || l.trim().starts_with("- status_") || l.trim().starts_with("- output_") || l.trim().starts_with("- topic_"))
            .map(|l| l.trim().trim_start_matches("- ").to_string())
            .collect();
        if !children.is_empty() {
            meta.children = Some(children);
        }
    }

    if meta.links.is_none() {
        let links: Vec<String> = body
            .lines()
            .filter(|l| l.trim().starts_with("- link:"))
            .map(|l| l.trim().trim_start_matches("- link:").trim().to_string())
            .collect();
        if !links.is_empty() {
            meta.links = Some(links);
        }
    }

    let source_path = path.to_string_lossy().to_string();

    Some(Module {
        meta,
        body,
        source_path,
    })
}

/// 写入模块文件（合并 frontmatter + body）
#[tauri::command]
fn write_module(path: String, meta: ModuleMeta, body: String) -> Result<(), String> {
    let fm = format_yaml_frontmatter(&meta);
    let content = format!("---\n{}\n---\n\n{}\n", fm, body.trim());
    std::fs::write(&path, content).map_err(|e| e.to_string())?;
    Ok(())
}

fn format_yaml_frontmatter(meta: &ModuleMeta) -> String {
    let mut fm = String::new();
    fm.push_str("module: true\n");
    fm.push_str(&format!("id: {}\n", meta.id));
    fm.push_str(&format!("type: {}\n", meta.module_type));
    fm.push_str(&format!("title: {}\n", meta.title));
    if let Some(ref b) = meta.bullet {
        fm.push_str(&format!("bullet: {}\n", b));
    }
    if let Some(ref tags) = meta.tags {
        if !tags.is_empty() {
            fm.push_str(&format!("tags: [{}]\n", tags.join(", ")));
        }
    }
    fm.push_str(&format!("created: {}\n", meta.created));
    fm.push_str(&format!("updated: {}\n", meta.updated));
    if let Some(ref children) = meta.children {
        if !children.is_empty() {
            fm.push_str(&format!(
                "children:\n{}\n",
                children.iter().map(|c| format!("  - {}", c)).collect::<Vec<_>>().join("\n")
            ));
        }
    }
    if let Some(p) = meta.pinned {
        fm.push_str(&format!("pinned: {}\n", p));
    }
    if let Some(l) = meta.live {
        fm.push_str(&format!("live: {}\n", l));
    }
    fm
}

/// 扫描 molting3 子弹目录获取实时状态
#[tauri::command]
fn scan_live(molting3_root: String) -> Result<Vec<LiveScan>, String> {
    let identity_dir = std::path::Path::new(&molting3_root)
        .join("core")
        .join("身份");

    if !identity_dir.exists() {
        return Ok(vec![]);
    }

    let mut results = Vec::new();
    let entries = std::fs::read_dir(&identity_dir).map_err(|e| e.to_string())?;

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if !path.is_dir() {
            continue;
        }

        let bullet_name = path
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();

        // 检测活跃度：06_收件箱 或 07_项目 是否有最近修改
        let inbox = path.join("06_收件箱");
        let projects = path.join("07_项目");

        let mut status = "unknown".to_string();
        let mut last_action = String::new();
        let mut last_action_at = String::new();
        let mut output_count = 0u64;
        let mut unread_mail = 0u64;
        let recent_files = Vec::new();

        // 统计产出
        if projects.exists() {
            output_count = count_files_recursive(&projects);
        }

        // 统计未读邮件（06_收件箱下非 已读/ 和 _规则.md 的文件）
        if inbox.exists() {
            if let Ok(entries) = std::fs::read_dir(&inbox) {
                unread_mail = entries
                    .filter_map(|e| e.ok())
                    .filter(|e| {
                        let name = e.file_name().to_string_lossy().to_string();
                        e.path().is_file()
                            && name != "_规则.md"
                    })
                    .count() as u64;
            }
        }

        // 找最近修改的文件
        let mut latest: Option<(u64, String, String)> = None;
        if let Ok(entries) = std::fs::read_dir(&path) {
            for entry in entries.filter_map(|e| e.ok()) {
                if let Ok(meta) = entry.metadata() {
                    if let Ok(modified) = meta.modified() {
                        let t = modified
                            .duration_since(std::time::UNIX_EPOCH)
                            .map(|d| d.as_secs())
                            .unwrap_or(0);
                        if latest.is_none() || t > latest.as_ref().unwrap().0 {
                            let name = entry.file_name().to_string_lossy().to_string();
                            let formatted = chrono_like_format(t);
                            latest = Some((t, name.clone(), formatted.clone()));
                            last_action = name;
                            last_action_at = formatted;
                        }
                    }
                }
            }
        }

        // 判定状态
        if let Some((t, _, _)) = latest {
            let now = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_secs())
                .unwrap_or(0);
            if now - t < 86400 * 7 {
                status = "active".to_string();
            } else {
                status = "dormant".to_string();
            }
        }

        results.push(LiveScan {
            bullet: bullet_name,
            status,
            last_action,
            last_action_at,
            output_count,
            unread_mail,
            recent_files,
        });
    }

    Ok(results)
}

fn count_files_recursive(dir: &std::path::Path) -> u64 {
    let mut count = 0;
    if let Ok(entries) = std::fs::read_dir(dir) {
        for entry in entries.filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.is_dir() {
                count += count_files_recursive(&path);
            } else {
                count += 1;
            }
        }
    }
    count
}

fn chrono_like_format(unix_secs: u64) -> String {
    // 简单 ISO 格式（不引入 chrono crate）
    let secs = unix_secs as i64;
    let days_since_epoch = secs / 86400;
    // rough conversion — good enough for display
    let mut y = 1970i64;
    let mut d = days_since_epoch;
    loop {
        let days_in_year = if is_leap(y) { 366 } else { 365 };
        if d < days_in_year {
            break;
        }
        d -= days_in_year;
        y += 1;
    }
    let months = if is_leap(y) {
        [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    } else {
        [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    };
    let mut m = 1;
    for &days in &months {
        if d < days as i64 {
            break;
        }
        d -= days as i64;
        m += 1;
    }
    let day = d + 1;
    let remaining_secs = secs % 86400;
    let h = remaining_secs / 3600;
    let min = (remaining_secs % 3600) / 60;
    format!("{:04}-{:02}-{:02}T{:02}:{:02}:00+08:00", y, m, day, h, min)
}

fn is_leap(y: i64) -> bool {
    (y % 4 == 0 && y % 100 != 0) || y % 400 == 0
}

/// 查询模块依赖关系
#[tauri::command]
fn query_deps(
    module_id: String,
    graph: tauri::State<'_, Mutex<dep_graph::DepGraph>>,
) -> Result<dep_graph::DepQuery, String> {
    let g = graph.lock().map_err(|e| e.to_string())?;
    g.query(&module_id).ok_or_else(|| format!("Module not found: {}", module_id))
}

/// 查询"改了此模块会影响到谁"
#[tauri::command]
fn query_affected(
    module_id: String,
    graph: tauri::State<'_, Mutex<dep_graph::DepGraph>>,
) -> Result<dep_graph::AffectedResult, String> {
    let g = graph.lock().map_err(|e| e.to_string())?;
    Ok(g.affected(&module_id))
}

/// 获取依赖图统计
#[tauri::command]
fn dep_stats(
    graph: tauri::State<'_, Mutex<dep_graph::DepGraph>>,
) -> Result<serde_json::Value, String> {
    let g = graph.lock().map_err(|e| e.to_string())?;
    Ok(serde_json::json!({
        "moduleCount": g.module_count(),
    }))
}

// ─── 应用入口 ───

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            scan_modules,
            write_module,
            scan_live,
            query_deps,
            query_affected,
            dep_stats,
        ])
        .setup(|app| {
            // 构建全局依赖图（通过 scan_modules 的结果初始化）
            let modules_dir = std::path::PathBuf::from(
                "D:\\workspaces\\dev\\projects\\molting3-cortex\\modules"
            );
            if modules_dir.exists() {
                // 启动时扫描一次，构建依赖图
                if let Ok(file_modules) = scan_modules(
                    modules_dir.to_string_lossy().to_string()
                ) {
                    let graph = dep_graph::DepGraph::build(&file_modules);
                    println!(
                        "[dep_graph] built with {} modules",
                        graph.module_count()
                    );
                    app.manage(Mutex::new(graph));
                }
            }

            // 启动文件监听
            if modules_dir.exists() {
                match watcher::start_watching(&app.handle(), modules_dir.clone()) {
                    Ok(guard) => {
                        app.manage(Mutex::new(Some(guard)));
                        println!("[watcher] started");
                    }
                    Err(e) => eprintln!("[watcher] failed to start: {}", e),
                }
            } else {
                eprintln!("[watcher] modules dir not found");
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
