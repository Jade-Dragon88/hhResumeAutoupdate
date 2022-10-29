let resumeName; // название резюме
const input = document.querySelector('#resumeName'); // поле для ввода названия резюме
const btnStartStop = document.querySelector('#btnStartStop'); // кнопка для запуска/остановки скрипта

input.addEventListener('change', (e) => {
  e.preventDefault();
  resumeName = input.value; // сохраняем в переменную вводимое название резюме
});

btnStartStop.addEventListener(
  'click',
  /* async */ (e) => {
    e.preventDefault();
    if (e.target == btnStartStop) {
      chrome.storage.local.set({ resumeName: resumeName }); // записываем в localStorage название резюме
      console.dir(btnStartStop.innerText);
      switch (btnStartStop.innerText) {
        case 'START':
          btnStartStop.innerText = 'STOP';
          btnStartStop.classList.remove('btn-success');
          btnStartStop.classList.add('btn-warning');
          break;
        case 'STOP':
          btnStartStop.innerText = 'START';
          btnStartStop.classList.remove('btn-warning');
          btnStartStop.classList.add('btn-success');
          break;
      }
    }
  }
);
