document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const themeToggle = document.getElementById('themeToggle');
    const bgAnimation = document.getElementById('bgAnimation');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (bgAnimation) createParticles();

    renderTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());

    clearCompletedBtn.addEventListener('click', () => {
        if (!tasks.some(task => task.completed)) {
            alert("No completed tasks to clear!");
            return;
        }
        if (confirm("Clear all completed tasks?")) {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
        }
    });

    themeToggle.addEventListener('click', toggleTheme);

    function createParticles() {
        const particles = 50;
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('span');
            particle.classList.add('particles');

            const size = Math.random() * 30 + 10;
            const posX = Math.random() * window.innerWidth;
            const delay = Math.random() * 15;
            const duration = Math.random() * 10 + 10;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}px`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;

            bgAnimation.appendChild(particle);
        }
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
            alert("Task already exists!");
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = "";
        taskInput.focus();
    }

    function renderTasks() {
        taskList.innerHTML = tasks.length ? "" : '<li style="color: white; text-align: center;">No tasks yet!</li>';

        tasks.forEach(task => {
            const taskEl = document.createElement('li');
            taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskEl.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" data-id="${task.id}">×</button>
            `;
            taskList.appendChild(taskEl);
            taskEl.style.animation = "floatIn 0.5s ease-out";

            const checkbox = taskEl.querySelector('.task-checkbox');
            const deleteBtn = taskEl.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
        });

        updateTaskCount();
    }

    function toggleTask(id, completed) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = completed;
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(id) {
        const taskEl = document.querySelector(`.delete-btn[data-id="${id}"]`).parentElement;
        taskEl.style.animation = "slideOut 0.4s forwards";
        taskEl.addEventListener("animationend", () => {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        });
    }

    function updateTaskCount() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        taskCount.textContent = `${completed} of ${total} tasks done`;
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? "🌞" : "🌙";
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    }

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = "🌞";
    }
});
