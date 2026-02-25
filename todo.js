document.addEventListener("DOMContentLoaded", function () {

    const addButton = document.getElementById("addButton");
    const form = document.getElementById("taskForm");
    const saveButton = document.getElementById("saveTask");
    const titleInput = document.getElementById("taskTitle");
    const descInput = document.getElementById("taskDesc");
    const container = document.getElementById("todoContainer");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Show / Hide form
    addButton.addEventListener("click", function () {
        form.classList.toggle("hidden");
    });

    // Save Task
    saveButton.addEventListener("click", function () {

        const titleText = titleInput.value.trim();
        const descText = descInput.value.trim();

        if (!titleText) return;

        const task = {
            id: Date.now(),
            title: titleText,
            desc: descText,
            completed: false
        };

        tasks.push(task);
        saveToStorage();
        renderTasks();

        titleInput.value = "";
        descInput.value = "";
        form.classList.add("hidden");
    });

    function renderTasks() {
        container.innerHTML = "";

        // Sort: incomplete first
        tasks.sort((a, b) => a.completed - b.completed);

        tasks.forEach(task => {
            const newBox = document.createElement("div");
            newBox.className = "todo-box";
            if (task.completed) newBox.classList.add("completed");

            const title = document.createElement("div");
            title.className = "todo-title";
            title.textContent = task.title;
            newBox.appendChild(title);

            if (task.desc) {
                const desc = document.createElement("div");
                desc.className = "todo-description";
                desc.textContent = task.desc;
                newBox.appendChild(desc);
            }

            // Toggle complete
            newBox.addEventListener("click", function () {
                task.completed = !task.completed;
                saveToStorage();
                renderTasks();
            });

            // Edit
            newBox.addEventListener("dblclick", function (e) {
                e.stopPropagation();

                titleInput.value = task.title;
                descInput.value = task.desc;

                form.classList.remove("hidden");

                tasks = tasks.filter(t => t.id !== task.id);
                saveToStorage();
                renderTasks();
            });

            container.appendChild(newBox);
        });
    }

    function saveToStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Task Loader
    renderTasks();

});