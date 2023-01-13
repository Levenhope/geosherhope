const db = new Dexie("toDoDataBase");

db.version(1).stores({
    taskList: '++id,title,desc,color,subTasks',
    projects: '++id,name,tasks,isActive'
});

function initDate() {
    const dateContainer = document.querySelector('.header__today');
    const timeContainer = document.querySelector('.header__time');

    function getCurrentTime(){
        const today = new Date();
        dateContainer.innerHTML = today.toLocaleString('ru-RU', {day: 'numeric', month: 'long'});
        timeContainer.innerHTML = today.toLocaleString('ru-RU', {hour: '2-digit', minute: '2-digit'});
    }

    getCurrentTime();

    setInterval(getCurrentTime, 1000);
}

initDate();

//tasks

//const addTaskForm = document.querySelector('#addTaskForm');
const tasksHolder = document.querySelector('.tasks-holder');
const projectModalClose = document.querySelector('#projectModalClose');
const projectModalToggle = document.querySelector('#projectModalToggle');
const projectModal = document.querySelector('#projectModal');
const newProjectForm = document.querySelector('#newProjectForm');
const projectSelect = document.querySelector('#projectSelect');
const projectFormButton = document.querySelector('#projectFormButton');

function renderTask(task) {
    let subTasksTemplate = null;

    if (task.subTasks !== null) {
        subTasksTemplate = task.subTasks.map(function(subTask) {
            return `<div class="subtask"><input type="checkbox" data-index="${task.subTasks.indexOf(subTask)}" 
                    class="subtask__check" ${subTask.checked ? 'checked' : ''}>${subTask.name}</div>`;
        }).join('');
    }

    const taskTemplate = `
                <div class="task" id="${task.id}" style="border-top-color: ${task.color};">
                    <button class="task__delete" title="Удалить">&times;</button>
                    <div class="task__title">${task.title}</div>
                    <div class="task__desc">${task.desc}</div>
                    ${task.subTasks !== null ? subTasksTemplate : ''}
                </div>
            `;

    tasksHolder.insertAdjacentHTML('beforeend', taskTemplate);
}

/*addTaskForm.onsubmit = function(e) {
    e.preventDefault();

    const subTasks = Array.from(addTaskForm.querySelectorAll('.subtask-input'))
        .map(function (subTask) {
            return subTask.value ? {name: subTask.value, checked: false} : false;
        }).filter(Boolean);

    const task = {
        title: addTaskForm.querySelector('#taskTitle').value,
        desc: addTaskForm.querySelector('#taskDesc').value,
        color: addTaskForm.querySelector('#taskColor').value,
        subTasks
    };

    db.taskList.add(task).then(function(){
        db.projects.get({isActive: 'y'}).then(function(user) {
            let updatedUserTasks = user.tasks;
            updatedUserTasks.push(task.id);
            db.projects.update(user.id, {tasks: updatedUserTasks});
        }).catch(function(error) {
            alert ("Не удалось привязать задачу к пользователю: " + error);
        });
    }).then(function() {
        renderTask(task);
        Array.from(addTaskForm.querySelectorAll('input')).forEach(function (field) {
            if (field.type === 'color') {
                field.value = '#000000';
            } else {
                field.value = '';
            }

            if (field.classList.contains('subtask-input')) {
                field.closest('div').remove();
            }
        });
    }).catch(function(error) {
        alert ("Не удалось добавить задачу: " + error);
    });
};*/

document.addEventListener('click', function (e) {
    const deleteButton = e.target.closest('.task__delete');

    if (!deleteButton) return;

    const parentTaskElement = deleteButton.closest('.task');
    db.taskList.delete(+parentTaskElement.id).then(function() {
        db.projects.get({isActive: 'y'}).then(function(user) {
            let updatedUserTasks = user.tasks;
            updatedUserTasks.splice(updatedUserTasks.indexOf(+parentTaskElement.id), 1);
            db.projects.update(user.id, {tasks: updatedUserTasks}).catch(function(error) {
                alert ("Не удалось обновить список задач пользователя: " + error);
            });
        }).catch(function(error) {
            alert ("Не удалось определить пользователя: " + error);
        });
    }).then(function() {
        parentTaskElement.remove();
    }).catch(function(error) {
        alert ("Не удалось удалить задачу: " + error);
    });
});

//projects

function addProjectOption(project) {
    let option = document.createElement("option");
    option.value = project.id;
    option.text = project.name;
    projectSelect.add(option);
}

db.projects.get({name: "Курсовая"}).then(function(defaultProject) {
    if(!defaultProject) {
        db.projects.add({
            name: 'Курсовая',
            tasks: [],
            isActive: 'y'
        });
    }
}).then(function(){
    db.projects.each(addProjectOption);
}).then(function() {
    db.projects.get({isActive:'y'}).then(function(project) {
        const currentProjectElements = document.querySelectorAll('.current-project');

        Array.from(currentProjectElements).forEach(function(currentProjectElement){
            currentProjectElement.textContent = project.name;
        });

        projectSelect.value = +project.id;
    }).catch(function(error) {
        alert ("Не удалось установить текущий проект: " + error);
    });
}).catch(function(error) {
    alert ("Не удалось инициировать список проектов: " + error);
});

projectModalToggle.addEventListener('click', function() {
    projectModal.classList.add('is-open');
});

projectFormButton.addEventListener('click', function() {
    newProjectForm.hidden = false;
    projectFormButton.hidden = true;
});

projectModalClose.addEventListener('click', function(e) {
    projectModal.classList.remove('is-open');
    newProjectForm.hidden = true;
    projectFormButton.hidden = false;
});

newProjectForm.onsubmit = function(e) {
    e.preventDefault();

    const nameField = newProjectForm.querySelector('#projectName');
    const project = {
        name: nameField.value,
        tasks: [],
        isActive: 'n'
    };

    db.projects.add(project).then(function () {
        addUserOption(project);
        nameField.value = '';
    });
};

projectSelect.onchange = function() {
    const currentProjectElements = document.querySelectorAll('.current-user');
    const selectedOption = projectSelect.options[ projectSelect.selectedIndex ];

    db.projects.toCollection().modify(user => {
        user.isActive = (user.id === +selectedOption.value) ? 'y' : 'n';
    });

    Array.from(currentProjectElements).forEach(function(currentProjectElement){
        currentProjectElement.textContent = selectedOption.text
    });

    Array.from(document.querySelectorAll('.task:not(.is-form)'))
        .forEach(function(taskElement) {
            taskElement.remove();
        });

    renderCurrentProjectTasks();
};

//render

function renderCurrentProjectTasks() {
    db.projects.get({isActive:'y'}).then(function(currentProject) {
        return currentProject.tasks;
    }).then(function (tasks) {
        db.taskList.each(function(task) {
            if (tasks.includes(task.id)) {
                renderTask(task);
            }
        }).catch(function(error) {
            alert ("Не удалось отобразить задачи текущего проекта: " + error);
        });
    }).catch(function(error) {
        alert ("Не удалось определить проект для отображения задач: " + error);
    });
}

renderCurrentProjectTasks();
