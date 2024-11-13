document.addEventListener('DOMContentLoaded', () => {
    const addNoteButton = document.getElementById('add-note');
    const taskContainer = document.getElementById('task-container');
    const noTasksMessage = document.getElementById('no-task');
    const deleteModal = document.getElementById('window-delete');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');

    loadTasks();
    checkNoTasks();

    addNoteButton.addEventListener('click', () => {
        const titleInput = document.getElementById('title');
        const aboutInput = document.getElementById('about');
        if (titleInput.value && aboutInput.value) {
            createTaskElement(titleInput.value, aboutInput.value);
            titleInput.value = '';
            aboutInput.value = '';
            updateLocalStorage();
        } else {
            alert('Заполни все поля, живо.!');
        }
    });

    confirmDeleteButton.addEventListener('click', () => {
        if (taskToDelete) {
            taskContainer.removeChild(taskToDelete);
            updateLocalStorage();
            checkNoTasks();
            taskToDelete = null;
        }
        deleteModal.style.display = 'none';
    });

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        taskToDelete = null;
    });
});