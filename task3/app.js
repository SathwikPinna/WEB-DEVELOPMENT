const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function renderTasks() {
    todoList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        todoList.innerHTML = '<li class="empty-message">No tasks found.</li>';
        return;
    }

    filteredTasks.forEach((task) => {
        const originalIndex = tasks.indexOf(task);

        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <span class="task-text" onclick="toggleTask(${originalIndex})">${escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="toggle-btn" onclick="toggleTask(${originalIndex})">
                    ${task.completed ? 'Undo' : 'Done'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${originalIndex})">Delete</button>
            </div>
        `;
        todoList.appendChild(li);
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        tasks.push({ text: text, completed: false });
        todoInput.value = '';
        renderTasks();
    }
});

window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    renderTasks();
};

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

renderTasks();
