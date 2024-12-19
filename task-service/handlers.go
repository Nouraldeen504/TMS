package main

import (
    // "encoding/json"
    "net/http"
    "strconv"
    "time"
    
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt"
)

func createTask(c *gin.Context) {
    userID := getUserIDFromToken(c)
    
    var task Task
    if err := c.BindJSON(&task); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    task.UserID = userID
    
    stmt, err := db.Prepare("INSERT INTO tasks(user_id, title, content) VALUES(?, ?, ?)")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not prepare statement"})
        return
    }
    defer stmt.Close()

    result, err := stmt.Exec(task.UserID, task.Title, task.Content)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create task"})
        return
    }

    id, _ := result.LastInsertId()
    task.ID = int(id)
    
    c.JSON(http.StatusCreated, task)
}

func listTasks(c *gin.Context) {
    userID := getUserIDFromToken(c)
    
    rows, err := db.Query("SELECT id, title, content, is_done, created_at, done_at FROM tasks WHERE user_id = ?", userID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch tasks"})
        return
    }
    defer rows.Close()

    var tasks []Task
    for rows.Next() {
        var task Task
        err := rows.Scan(&task.ID, &task.Title, &task.Content, &task.IsDone, &task.CreatedAt, &task.DoneAt)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not scan task"})
            return
        }
        tasks = append(tasks, task)
    }

    c.JSON(http.StatusOK, tasks)
}

func markTaskDone(c *gin.Context) {
    userID := getUserIDFromToken(c)
    taskID, _ := strconv.Atoi(c.Param("id"))

    // Get the current time
    doneAt := time.Now()

    _, err := db.Exec("UPDATE tasks SET is_done = 1, done_at = ? WHERE id = ? AND user_id = ?", doneAt, taskID, userID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update task"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Task marked as done"})
}

func getUserIDFromToken(c *gin.Context) int {
    tokenString := c.GetHeader("Authorization")
    token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return []byte("dev_secret_key_change_in_production"), nil
    })

    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        return int(claims["sub"].(float64))
    }
    
    return 0
}