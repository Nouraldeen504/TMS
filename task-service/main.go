package main

import (
    "database/sql"
    "log"
    
    "github.com/gin-gonic/gin"
)

var db *sql.DB

func main() {
    db = initDatabase()
    defer db.Close()

    r := gin.Default()

    r.POST("/tasks", createTask)
    r.GET("/tasks", listTasks)
    r.PUT("/tasks/:id/complete", markTaskDone)

    log.Fatal(r.Run(":8080"))
}