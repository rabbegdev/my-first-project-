document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const taskName = document.getElementById('taskName');
    const taskId = document.getElementById('taskId');
    const submitBtn = document.getElementById('submitBtn');

    // Load tasks on page load
    loadTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (taskId.value === '') {
            createTask();
        } else {
            updateTask();
        }
    });

    function loadTasks() {
        fetch('api.php?action=read')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const li = createTaskElement(task);
                    taskList.appendChild(li);
                });
            });
    }

    function createTask() {
        const task = { name: taskName.value };
        fetch('api.php?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
        .then(() => {
            taskName.value = '';
            loadTasks();
        });
    }

    function updateTask() {
        const task = { id: taskId.value, name: taskName.value };
        fetch('api.php?action=update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
        .then(() => {
            taskId.value = '';
            taskName.value = '';
            submitBtn.textContent = 'Add Task';
            loadTasks();
        });
    }

    function deleteTask(id) {
        fetch(`api.php?action=delete&id=${id}`, { method: 'DELETE' })
            .then(() => loadTasks());
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${task.name}
            <div>
                <button class="editBtn" data-id="${task.id}">Edit</button>
                <button class="deleteBtn" data-id="${task.id}">Delete</button>
            </div>
        `;

        li.querySelector('.editBtn').addEventListener('click', () => {
            taskId.value = task.id;
            taskName.value = task.name;
            submitBtn.textContent = 'Update Task';
        });

        li.querySelector('.deleteBtn').addEventListener('click', () => {
            deleteTask(task.id);
        });

        return li;
    }
});