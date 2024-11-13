const showEditModal = (fullTitle, fullDesc, onSave) => {
   document.getElementById('tittle-edit').value = fullTitle;
   document.getElementById('desc-edit').value = fullDesc;

   const editModal = document.getElementById('window-edit');
   editModal.style.display='flex';

   editModal.addEventListener('click', function(event) {
       if (event.target === editModal) {
           editModal.style.display='none';
       }
   });

   document.getElementById('save-edit').onclick = () => {
       const newTitle=document.getElementById('tittle-edit').value;
       const newDesc=document.getElementById('desc-edit').value;
       onSave(newTitle, newDesc);
       editModal.style.display='none';
   };

   document.getElementById('cancel-edit').onclick=() => { 
       editModal.style.display='none'; 
   };
};

const showShareModal=(fullTitle, fullDescription)=>{
   const shareModal=document.getElementById('window-share');
   shareModal.style.display='flex';

   const copyButton=document.getElementById('copy-button');
   
   copyButton.onclick=() => {
       const textToCopy=`Задача: ${fullTitle}\nОписание задачи: ${fullDescription}\nне заходите сюда, вам тут не рады.`;
       navigator.clipboard.writeText(textToCopy)
           .then(() => { alert('Текст скопирован в буфер обмена.'); shareModal.style.display='none'; })
           .catch(err => { console.error('Ошибка копирования: ', err); });
   };

   shareModal.addEventListener('click', (event) => { 
       if (event.target === shareModal) { 
           shareModal.style.display='none'; 
       } 
   });
};

const showInfoModal=(infoText)=>{
   const infoModal=document.getElementById('window-info');
   infoModal.querySelector('.window-content').innerHTML=`<p>${infoText}</p>`;
   
   infoModal.style.display='flex';

   infoModal.addEventListener('click', (event) => { 
       if (event.target === infoModal) { 
           infoModal.style.display='none'; 
       } 
   });
};