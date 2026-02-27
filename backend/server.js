const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read tasks from JSON
const readTasks = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
};

// Helper function to write tasks to JSON
const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data file:', error);
  }
};

// GET: Fetch all tasks
app.get('/tasks', (req, res) => {
  console.log('GET /tasks - Solicitando lista de tareas');
  const tasks = readTasks();
  res.json(tasks);
});

// POST: Add a new task
app.post('/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title
  };
  console.log(`POST /tasks - Agregando tarea: "${newTask.title}" (ID: ${newTask.id})`);
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// DELETE: Remove a task by ID
app.delete('/tasks/:id', (req, res) => {
  let tasks = readTasks();
  const id = parseInt(req.params.id);
  console.log(`DELETE /tasks/${id} - Eliminando tarea con ID: ${id}`);
  tasks = tasks.filter(task => task.id !== id);
  writeTasks(tasks);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
