package main

import (
    "database/sql"
    "log"
    "time"
    
    _ "github.com/mattn/go-sqlite3"
)

type Task struct {
    ID        int       `json:"id"`
    UserID    int       `json:"user_id"`
    Title     string    `json:"title"`
    Content   string    `json:"content"`
    IsDone    bool      `json:"is_done"`
    CreatedAt time.Time `json:"created_at"`
    DoneAt    *time.Time `json:"done_at"`
}

func initDatabase() *sql.DB {
    db, err := sql.Open("sqlite3", "./tasks.db")
    if err != nil {
        log.Fatal(err)
    }

    createTableSQL := `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        is_done BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        done_at DATETIME DEFAULT NULL
    )`

    _, err = db.Exec(createTableSQL)
    if err != nil {
        log.Fatal(err)
    }

    return db
}