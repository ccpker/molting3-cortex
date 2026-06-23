// 文件监听模块 — modules/ 目录下的 .md 变更 → 前端事件推送
use notify::{Config, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::path::PathBuf;
use std::sync::mpsc;
use tauri::{AppHandle, Emitter};

pub struct WatcherGuard {
    _watcher: RecommendedWatcher,
}

/// 事件 payload — 发送到前端的 FileChange
#[derive(Debug, Clone, serde::Serialize)]
pub struct FileChangeEvent {
    pub path: String,
    pub kind: String, // "modified" | "created" | "removed"
}

/// 启动文件监听，发送 `file-change` 事件到前端
pub fn start_watching(app: &AppHandle, watch_dir: PathBuf) -> Result<WatcherGuard, String> {
    let app_handle = app.clone();

    let (tx, rx) = mpsc::channel::<Result<Event, notify::Error>>();

    let mut watcher = RecommendedWatcher::new(
        move |res| {
            let _ = tx.send(res);
        },
        Config::default(),
    )
    .map_err(|e| format!("Failed to create watcher: {}", e))?;

    watcher
        .watch(&watch_dir, RecursiveMode::Recursive)
        .map_err(|e| format!("Failed to watch dir: {}", e))?;

    // 后台线程处理文件事件
    std::thread::spawn(move || {
        for event in rx {
            match event {
                Ok(e) => {
                    let kind = match e.kind {
                        EventKind::Create(_) => "created",
                        EventKind::Modify(_) => "modified",
                        EventKind::Remove(_) => "removed",
                        _ => continue,
                    };

                    for p in e.paths {
                        // 只关心 _index 文件的变更
                        let is_index = p.file_name()
                            .map(|n| n == "_index")
                            .unwrap_or(false);
                        if !is_index {
                            continue;
                        }
                        let path_str = p.parent()
                            .unwrap_or(&p)
                            .to_string_lossy()
                            .to_string();
                        let _ = app_handle.emit("file-change", FileChangeEvent {
                            path: path_str,
                            kind: kind.to_string(),
                        });
                    }
                }
                Err(e) => {
                    eprintln!("[watcher] error: {}", e);
                }
            }
        }
    });

    Ok(WatcherGuard { _watcher: watcher })
}
