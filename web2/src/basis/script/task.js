let activeTask = null;
let taskToDelete = null;

const loadTasks = () => {
    const tasksData = JSON.parse(localStorage.getItem('tasks')) || [];
    tasksData.forEach(task => createTaskElement(task.title, task.body));
};

const createTaskElement = (fullTitle, fullBody) => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.dataset.fullTitle = fullTitle;
    taskDiv.dataset.fullDesc = fullBody;

    const taskContentDiv = document.createElement('div');

    // Ограничение до 28 символов для отображения заголовка
    const truncatedTitleText = fullTitle.length > 28 ? fullTitle.slice(0, 28) + '...' : fullTitle;
    const titleElemntStrong = document.createElement('strong');
    titleElemntStrong.className = 'task-title';
    titleElemntStrong.textContent = truncatedTitleText;

    // Ограничение описания до 28 символов
    const truncatedBodyText = fullBody.length > 28 ? fullBody.slice(0, 28) + '...' : fullBody;
    const bodyElemntSpan = document.createElement('span');
    bodyElemntSpan.className = 'task-body';
    bodyElemntSpan.textContent = truncatedBodyText;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = '×';
    deleteBtn.className = 'delete-button';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        taskToDelete = taskDiv;
        document.getElementById('window-delete').style.display = 'block';
    };

    const buttonContainer = createSpecButtons();
    buttonContainer.style.display = 'none';

    taskDiv.appendChild(taskContentDiv);
    taskContentDiv.appendChild(titleElemntStrong);
    taskContentDiv.appendChild(document.createElement('br'));
    taskContentDiv.appendChild(bodyElemntSpan);
    
    taskDiv.appendChild(deleteBtn);
    taskDiv.appendChild(buttonContainer);
    
    document.getElementById('task-container').prepend(taskDiv);

    // Логика для отображения кнопок при клике на задачу
    taskDiv.onclick = (event) => {
        if (event.target.className !== 'delete-button') {
            const buttonsVisible = buttonContainer.style.display === 'block';
            if (buttonsVisible) {
                buttonContainer.style.display = 'none';
                activeTask = null;
            } else {
                if (activeTask) {
                    const previousButtonContainer = activeTask.querySelector('.button-container');
                    if (previousButtonContainer) {
                        previousButtonContainer.style.display = 'none';
                    }
                }
                buttonContainer.style.display = 'block';
                activeTask = taskDiv;
            }
        }
    };

    checkNoTasks();
};

const createSpecButtons = () => {
    let specButtons = document.createElement('div');
    specButtons.classList.add('button-container');

    // Кнопка информации
    let infoButton = document.createElement('button');
    infoButton.innerHTML = '<span>i</span>';
    infoButton.classList.add('task-button');
    
    // Кнопка редактирования
    let editButton = document.createElement('button');
    editButton.innerHTML = '<img src="../icons/edit.svg" class="icon">';
    editButton.classList.add('task-button');

    // Кнопка поделиться
    let shareButton = document.createElement('button');
    shareButton.innerHTML = '<img src="../icons/share.svg" class="icon">';
    shareButton.classList.add('task-button');

    // Обработчик нажатия "Редактировать"
    editButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const currentTask = editButton.closest('.task');
        const fullTitle = currentTask.dataset.fullTitle;
        const fullDescription = currentTask.dataset.fullDesc;

        showEditModal(fullTitle, fullDescription, (newTitle, newDesc) => {
            currentTask.dataset.fullTitle = newTitle;
            currentTask.dataset.fullDesc = newDesc;
            currentTask.querySelector('.task-title').innerText =
                newTitle.length > 28 ? newTitle.slice(0, 28) + '...' : newTitle;
            currentTask.querySelector('.task-body').innerText =
                newDesc.length > 28 ? newDesc.slice(0, 28) + '...' : newDesc;
            updateLocalStorage();
        });
    });

   // Обработчик "Поделиться"
   shareButton.addEventListener('click', (event) => {
       event.stopPropagation();
       const currentTask = shareButton.closest('.task');
       const fullTitle = currentTask.dataset.fullTitle;
       const fullDescription = currentTask.dataset.fullDesc;

       showShareModal(fullTitle, fullDescription);
   });

   // Обработчик "Информация"
   infoButton.addEventListener('click', (event) => {
       event.stopPropagation();
       showInfoModal("Помогите, я в заложниках, кабинет 2130.");
   });

   specButtons.appendChild(infoButton);
   specButtons.appendChild(editButton);
   specButtons.appendChild(shareButton);

   return specButtons;
};

const checkNoTasks=()=> {
   const noTasksMessage=document.getElementById('no-task');
   if(document.getElementById('task-container').children.length>0){
       noTasksMessage.style.display='none';
   } else {
       noTasksMessage.style.display='block';
   }
};

const updateLocalStorage=()=> {
   const tasks=[];
   document.querySelectorAll('.task').forEach(task=> {
       const title=task.dataset.fullTitle;
       const body=task.dataset.fullDesc;
       tasks.push({title,body});
   });
   localStorage.setItem('tasks', JSON.stringify(tasks));
};