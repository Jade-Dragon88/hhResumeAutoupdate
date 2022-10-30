let resumeName; // название резюме
const input = document.querySelector('#resumeName'); // поле для ввода названия резюме
const btnStartStop = document.querySelector('#btnStartStop'); // кнопка для запуска/остановки скрипта

function changeBtn(btnText) {
  if (btnText == 'START') {
    chrome.storage.local.set({ resumeName: resumeName }); // записываем в localStorage название резюме
    btnStartStop.innerText = 'STOP';
  }
  if (btnText == 'STOP') {
    chrome.storage.local.remove(['resumeName']); // удаляем из localStorage название резюме
    [resumeName, input.value] = [null, null]; // обнуляем resumeName и значение input
    btnStartStop.innerText = 'START';
  }
  chrome.storage.local.get(console.log);
  // console.dir(chrome.storage);
  console.dir(input);
  btnStartStop.classList.toggle('btn-success');
  btnStartStop.classList.toggle('btn-warning');
}

input.addEventListener('change', (e) => {
  e.preventDefault();
  resumeName = input.value; // сохраняем в переменную вводимое название резюме
});

btnStartStop.addEventListener('click', (e) => {
  e.preventDefault();
  let btnText = btnStartStop.innerText;
  e.target == btnStartStop ? changeBtn(btnText) : null;
});
