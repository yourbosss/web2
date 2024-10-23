document.addEventListener('DOMContentLoaded', () => {
    const addNoteButton = document.getElementById('add-note');
    const taskContainer = document.getElementById('task-container');
    const noTasksMessage = document.getElementById('no-task');
    const deleteModal = document.getElementById('window-delete');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    const editModal = document.getElementById('window-edit'); 
    const taskTitleInput = document.getElementById('tittle-edit'); 
    const taskDescriptionInput = document.getElementById('desc-edit'); 
    const shareModal = document.getElementById('window-share'); 
    const copyButton = document.getElementById('copy-button'); 
    const closeShareModalButton = document.getElementById('window-share'); 
    let activeTask = null; 
    let taskToDelete = null;
    
    // Функция для создания кнопок.
    function createSpecButtons() {
        let specButtons = document.createElement('div');
        specButtons.classList.add('button-container');

        //информация.
        let infoButton = document.createElement('button');
        infoButton.innerHTML = '<span>i</span>';
        infoButton.classList.add('task-button');
        specButtons.appendChild(infoButton);

        //редактировать.
        let editButton = document.createElement('button');
        editButton.innerHTML = '<img src="../icons/edit.svg" class="icon">';
        editButton.classList.add('task-button');
        specButtons.appendChild(editButton);
        const infoModal = document.getElementById('window-info');

        //поделиться.
        let shareButton = document.createElement('button');
        shareButton.innerHTML = '<img src="../icons/share.svg" class="icon">';
        shareButton.classList.add('task-button');
        specButtons.appendChild(shareButton);

        // Обработчик нажатия "Редактировать".
        editButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const currentTask = editButton.closest('.task'); 
            const fullTitle = currentTask.dataset.fullTitle; 
            const fullDescription = currentTask.dataset.fullDesc; 
            
            console.log(fullTitle, fullDescription);
            showEditModal(fullTitle, fullDescription, (newTitle, newDesc) => {
                currentTask.dataset.fullTitle = newTitle;
                currentTask.dataset.fullDesc = newDesc;

                currentTask.querySelector('.task-title').innerText = newTitle.length > 28 ? newTitle.slice(0, 28) + '...' : newTitle; 
                currentTask.querySelector('.task-body').innerText = newDesc.length > 28 ? newDesc.slice(0, 28) + '...' : newDesc; 
                updateLocalStorage(); 
            });
        });

        // Обработчик "Поделиться".
        shareButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            const currentTask = shareButton.closest('.task');
            const fullTitle = currentTask.dataset.fullTitle;
            const fullDescription = currentTask.dataset.fullDesc;

            shareModal.style.display = 'flex';

            copyButton.onclick = () => {
                const textToCopy = `Задача: ${fullTitle}\nОписание задачи: ${fullDescription}\nне заходите сюда, вам тут не рады.`;
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        alert('Текст скопирован в буфер обмена.');
                        shareModal.style.display = 'none'; 
                    })
                    .catch(err => {
                        console.error('Ошибка копирования: ', err);
                    });
            };

            shareModal.addEventListener('click', (event) => {
                if (event.target === shareModal) {
                    shareModal.style.display = 'none'; 
                }
            });
        });

        // Обработчик "Информация".
        infoButton.addEventListener('click', (event) => {
            event.stopPropagation(); 

            const infoText = document.createElement('p');
            infoText.textContent = 'Помогите, я в заложниках, кабинет 2130.'; 
            const infoContent = infoModal.querySelector('.window-content'); 
            infoContent.innerHTML = ''; 
            infoContent.appendChild(infoText); 

            infoModal.style.display = 'flex'; 
        });

        infoModal.addEventListener('click', (event) => {
            if (event.target === infoModal) {
                infoModal.style.display = 'none'; 
            }
        });

        return specButtons;
    }

    function showEditModal(fullTitle, fullDesc, onSave) {
        taskTitleInput.value = fullTitle; 
        taskDescriptionInput.value = fullDesc; 
    
        editModal.style.display = 'flex'; 
    
        editModal.addEventListener('click', function(event) {
            if (event.target === editModal) {
                editModal.style.display = 'none';
            }
        });
    
        document.getElementById('save-edit').onclick = () => {
            const newTitle = taskTitleInput.value;
            const newDesc = taskDescriptionInput.value;
            onSave(newTitle, newDesc); 
            editModal.style.display = 'none'; 
        };
    
        document.getElementById('cancel-edit').onclick = () => {
            editModal.style.display = 'none'; 
        };
    }          

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

        //ограничение до 28 символов для отображения.
        const truncatedTitleText = fullTitle.length > 28 ? fullTitle.slice(0, 28) + '...' : fullTitle;
        const titleElemntStrong= document.createElement('strong');
        titleElemntStrong.className='task-title';
        titleElemntStrong.textContent=truncatedTitleText;

        
         //ограничение описание до 28 символов.
         const truncatedBodyText= fullBody.length > 28 ? fullBody.slice(0, 28) + '...' : fullBody;
         const bodyElemntSpan= document.createElement('span');
         bodyElemntSpan.className='task-body';
         bodyElemntSpan.textContent=truncatedBodyText;

         taskContentDiv.appendChild(titleElemntStrong);
         taskContentDiv.appendChild(document.createElement('br'));
         taskContentDiv.appendChild(bodyElemntSpan);

         const deleteBtn=document.createElement("button");
         deleteBtn.textContent='×';  
         deleteBtn.className='delete-button';
         deleteBtn.onclick=(e)=>{
             e.stopPropagation();  
             taskToDelete=taskDiv;  
             deleteModal.style.display='block';  
         };

         const buttonContainer=createSpecButtons();
         buttonContainer.style.display='none';

         taskDiv.appendChild(taskContentDiv);
         taskDiv.appendChild(deleteBtn);
         taskDiv.appendChild(buttonContainer);
         taskContainer.prepend(taskDiv);

         //логистические штуки.
         taskDiv.onclick=(event)=>{
             if(event.target.className!=='delete-button'){
                 const buttonsVisible=buttonContainer.style.display==='block';

                 if(buttonsVisible){
                     buttonContainer.style.display='none';
                     activeTask=null;  
                     adjustTaskMargins(taskDiv,0);
                 }else{
                     if(activeTask){
                         const previousButtonContainer=activeTask.querySelector('.button-container');
                         if(previousButtonContainer){
                             previousButtonContainer.style.display='none';
                         }
                         adjustTaskMargins(activeTask,0);  
                     }

                     buttonContainer.style.display='block';
                     activeTask=taskDiv;  
                     adjustTaskMargins(taskDiv,70);  
                 }
             }
         };

         checkNoTasks();
     };

     function adjustTaskMargins(currentTask, additionalMargin) {
         const tasks=document.querySelectorAll(".task");
         let currentTaskFound=false;

         tasks.forEach(task=>{
             if(currentTaskFound){
                 task.style.marginTop=`${additionalMargin}px`;  
                 currentTaskFound=false;  
             }else{
                 task.style.marginTop='2px';  
             }

             if(task===currentTask){
                 currentTaskFound=true;  
             }
         });
     }

     const checkNoTasks=()=>{
         if(taskContainer.children.length>0){
             noTasksMessage.style.display='none';
             document.querySelectorAll('.divider').forEach(div=>div.style.display='none');
         }else{
             noTasksMessage.style.display='block';
             document.querySelectorAll('.divider').forEach(div=>div.style.display='block');
         }
     };

     // обновление локального хранилища.
     const updateLocalStorage=()=>{
         const tasks=[];
         document.querySelectorAll('.task').forEach(task=>{
             const title=task.dataset.fullTitle;  
             const body=task.dataset.fullDesc;  
             tasks.push({title,body});
         });
         localStorage.setItem('tasks',JSON.stringify(tasks));
     };

     addNoteButton.addEventListener('click',()=>{
         const titleInput=document.getElementById('title');
         const aboutInput=document.getElementById('about');

         if(titleInput.value && aboutInput.value){
             createTaskElement(titleInput.value,aboutInput.value);
             titleInput.value='';
             aboutInput.value='';
             updateLocalStorage();
         }else{
             alert('Заполни все поля, живо.!');
         }
     });

     confirmDeleteButton.addEventListener('click',()=>{
         if(taskToDelete){
             taskContainer.removeChild(taskToDelete);
             updateLocalStorage();
             checkNoTasks();
             taskToDelete=null;  
         }
          deleteModal.style.display='none';  
     });

     cancelDeleteButton.addEventListener('click',()=>{
          deleteModal.style.display='none';  
          taskToDelete=null;  
      });

      loadTasks();
      checkNoTasks();
});