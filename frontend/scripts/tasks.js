const API_URL = 'http://localhost:3000';

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
    return token;
}

// Fetch and display tasks
async function fetchTasks() {
    const token = checkAuth();
    
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            }
        });

        const tasks = await response.json();
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = ''; // Clear previous tasks

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = "d-flex justify-content-between align-items-center"
            taskElement.innerHTML = `
            <div class="mb-3">
            <div>Title: ${task.title}</div>
            <div>Description: ${task.content}</div>
            <div>Status: ${task.is_done ? 'Completed' : 'Pending'}</div>
            <div>Created at: ${new Date(task.created_at).toLocaleString('en-US', {dateStyle: 'medium',timeStyle: 'short'})}</div>
            <div>${task.done_at ? `Completed at: ${new Date(task.done_at).toLocaleString('en-US', {dateStyle: 'medium',timeStyle: 'short'})}` : ''}</div>
            </div>
            
        `;

        // Check if the task is not done to add the button
        if (!task.is_done) {
            const markDoneButton = document.createElement('button');
            markDoneButton.className ="btn btn-success";
            markDoneButton.innerText = 'Mark as Done';
            markDoneButton.onclick = () => markTaskDone(task.id); // Call function with task ID
            taskElement.appendChild(markDoneButton);
        }
            tasksList.appendChild(taskElement);
        });
    } catch (error) {
        console.error('Fetch tasks error:', error);
        alert('Failed to fetch tasks');
    }
}

//logout 
document.getElementById('logout-btn').addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (token){
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    } else{
        alert('No user is currently logged in!')
    }
});

// Create a new task
document.getElementById('create-task-btn').addEventListener('click', async () => {
    const token = checkAuth();
    const title = document.getElementById('task-title').value;
    const content = document.getElementById('task-content').value;

    if(title === '' || content === ''){
        alert("Please fill in the required fields!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify({ title, content })
        });

        const task = await response.json();
        if (task.id) {
            // Clear input fields
            document.getElementById('task-title').value = '';
            document.getElementById('task-content').value = '';
            
            // Refresh tasks list
            fetchTasks();
        } else {
            alert('Failed to create task');
        }
    } catch (error) {
        console.error('Create task error:', error);
        alert('Failed to create task');
    }
});

// Mark task as done
async function markTaskDone(taskId) {
    const token = checkAuth();

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            }
        });

        const data = await response.json();
        if (data.message) {
            fetchTasks();
        } else {
            alert('Failed to mark task as done');
        }
    } catch (error) {
        console.error('Mark task done error:', error);
        alert('Failed to mark task as done');
    }
}

// Initial load of tasks
document.addEventListener('DOMContentLoaded', fetchTasks);