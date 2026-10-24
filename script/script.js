let tasks = {}

function addTask(){
    let dateInput = document.getElementById("taskDate");
    let timeInput = document.getElementById("taskTime");
    let textInput = document.getElementById("taskInput");
    let validationMessage = document.getElementById("validationMessage");

    let date = dateInput.value;
    let time = timeInput.value;
    let text = textInput.value.trim();

    if (date === ""){
        validationMessage.textContent = "Select a date.";
        return;
    }

    if (time === ""){
        validationMessage.textContent = "Select a time.";
        return;
    }

    if (text === ""){
        validationMessage.textContent = "Describe the task.";
        return;
    }

    if (!tasks[date]){
        tasks[date] = [];
    }
    let isDuplicate = tasks[date].some(function(task){
        return task.time === time && task.text.toLowerCase() === text.toLowerCase();
    });

    if (isDuplicate){
        alert("A task with the same time and description already exists for this date.");
        return;
    }
    
    tasks[date].push({time:time, text: text});

    tasks[date].sort(function(a,b){
        return a.time.localeCompare(b.time);
    });

    validationMessage.textContent = "";
    textInput.value = "";
    timeInput.value = "";

    renderTasks();
}

function deleteTask(date, index){
    if (!tasks[date]) return;
    tasks[date].splice(index, 1);
    if (tasks[date].length === 0) {
        delete tasks[date];
    }
    renderTasks();
}

function getDayName(dateString){
    let dateObj = new Date(dateString + "T00:00:00");
    return dateObj.toLocaleDateString("en-US", { weekday: "long" });
}

function renderTasks(){
    let taskListContainer = document.getElementById("taskList");

    taskListContainer.innerHTML = "";

    let dates = Object.keys(tasks).sort();

    dates.forEach(function (date) {
        let dateSection = document.createElement("div");
        dateSection.className = "date-section";
        
        let dateHeader = document.createElement("div");
        dateHeader.className = "date-header";

        let dateTitle = document.createElement("h3");
        dateTitle.textContent = date + " (" +getDayName(date)+ ")";

        let taskCount = document.createElement("span");
        taskCount.className = "task-count";
        taskCount.textContent = tasks[date].length + (tasks[date].length === 1 ? " task" : " tasks");

        dateHeader.appendChild(dateTitle);
        dateHeader.appendChild(taskCount);
        dateSection.appendChild(dateHeader);
    
        // Create the list of tasks for this date
        let taskUl = document.createElement("ul");
        taskUl.className = "task-list";
    
        tasks[date].forEach(function (task, index) {
            let li = document.createElement("li");
            li.className = "task-item";
        
            let taskText = document.createElement("span");
            taskText.innerHTML = "<span class='task-time'>" + task.time + "</span>" + task.text;
        
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = function () {
                deleteTask(date, index);
            };
        
            li.appendChild(taskText);
            li.appendChild(deleteBtn);
            taskUl.appendChild(li);
        });
    
        dateSection.appendChild(taskUl);
        taskListContainer.appendChild(dateSection);
    });
}