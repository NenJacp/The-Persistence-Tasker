<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tasks = ref([])
const newTaskTitle = ref('')
const loading = ref(true)
const serverError = ref(false)
const notifications = ref([])

const API_URL = 'http://localhost:3000/tasks'

// --- Custom Notification Helper ---
const notify = (message, type = 'error') => {
  const id = Date.now()
  notifications.value.push({ id, message, type })
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 4000)
}

// --- Backend Actions ---
const fetchTasks = async () => {
  loading.value = true
  serverError.value = false
  try {
    const response = await axios.get(API_URL)
    tasks.value = response.data
  } catch (err) {
    console.error('Error fetching tasks:', err)
    serverError.value = true
    notify('No se pudo conectar con el servidor.')
  } finally {
    loading.value = false
  }
}

const addTask = async () => {
  if (!newTaskTitle.value.trim()) return
  
  try {
    const response = await axios.post(API_URL, { title: newTaskTitle.value })
    tasks.value.push(response.data)
    newTaskTitle.value = ''
    notify('Tarea agregada con éxito!', 'success')
  } catch (err) {
    console.error('Error adding task:', err)
    notify('Error al agregar la tarea. El servidor no responde.')
  }
}

const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`)
    tasks.value = tasks.value.filter(task => task.id !== id)
    notify('Tarea eliminada.', 'success')
  } catch (err) {
    console.error('Error deleting task:', err)
    notify('Error al eliminar la tarea. El servidor no responde.')
  }
}

onMounted(fetchTasks)
</script>

<template>
  <div class="min-h-screen bg-oxocarbon-bg flex flex-col items-center p-6 text-oxocarbon-text">
    <div class="w-full max-w-md mt-10">
      <header class="text-center mb-10">
        <h1 class="text-4xl font-bold text-oxocarbon-primary tracking-tight">The Persistence Tasker</h1>
        <p class="text-sm opacity-60 mt-2">Gestión de tareas asíncrona</p>
      </header>
      
      <!-- Input Section -->
      <div class="flex gap-2 mb-8 bg-oxocarbon-surface p-2 rounded-lg shadow-lg">
        <input 
          v-model="newTaskTitle" 
          @keyup.enter="addTask" 
          placeholder="¿Qué tienes pendiente?" 
          class="bg-transparent flex-1 px-4 py-2 focus:outline-none placeholder:text-oxocarbon-text placeholder:opacity-40"
        />
        <button 
          @click="addTask" 
          :disabled="loading"
          class="bg-oxocarbon-secondary hover:bg-oxocarbon-success disabled:opacity-50 text-oxocarbon-bg font-bold px-6 py-2 rounded-md transition-all duration-300"
        >
          Agregar
        </button>
      </div>

      <!-- Main Content -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 opacity-50">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-oxocarbon-primary mb-4"></div>
        <p>Cargando...</p>
      </div>

      <div v-else>
        <!-- Task List -->
        <TransitionGroup 
          name="list" 
          tag="ul" 
          class="space-y-3"
          v-if="tasks.length > 0"
        >
          <li 
            v-for="task in tasks" 
            :key="task.id" 
            class="bg-oxocarbon-surface group flex justify-between items-center p-4 rounded-lg border border-transparent hover:border-oxocarbon-hover transition-all"
          >
            <span class="text-lg">{{ task.title }}</span>
            <button 
              @click="deleteTask(task.id)"
              class="text-oxocarbon-text opacity-40 group-hover:opacity-100 hover:text-oxocarbon-error transition-all text-sm font-semibold border border-oxocarbon-text/20 hover:border-oxocarbon-error/40 px-3 py-1 rounded"
            >
              Eliminar
            </button>
          </li>
        </TransitionGroup>

        <!-- Empty / Error State -->
        <div v-else class="text-center py-20 bg-oxocarbon-surface/30 rounded-2xl border-2 border-dashed border-oxocarbon-surface">
          <p class="text-lg opacity-60">
            {{ serverError ? 'Tareas no disponibles' : 'No hay tareas pendientes.' }}
          </p>
          <button 
            v-if="serverError" 
            @click="fetchTasks" 
            class="mt-4 text-oxocarbon-secondary hover:underline"
          >
            Reintentar conexión
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Notification Toasts -->
    <div class="fixed bottom-6 right-6 flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div 
          v-for="n in notifications" 
          :key="n.id"
          class="min-w-[250px] p-4 rounded-lg shadow-2xl border-l-4 flex justify-between items-center pointer-events-auto"
          :class="{
            'bg-oxocarbon-surface border-oxocarbon-error text-oxocarbon-text': n.type === 'error',
            'bg-oxocarbon-surface border-oxocarbon-success text-oxocarbon-text': n.type === 'success'
          }"
        >
          <span class="font-medium">{{ n.message }}</span>
          <button @click="notifications = notifications.filter(notif => notif.id !== n.id)" class="ml-4 opacity-50 hover:opacity-100">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
/* Animations */
.list-enter-active, .list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
