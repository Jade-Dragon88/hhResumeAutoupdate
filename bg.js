/*
! SWLS - ServiceWorker LocalStorage
*/

{
  /* chrome.tabs.onUpdated.addListener(
    // recolorResumeName('!!!  DONE  !!!')
    (id, status, tabInfo)=>{
      // console.dir();
      if(status.status == 'complete'){
        console.dir(tabInfo);
      }
    }
  )





  let hhTab = chrome.tabs.query({ 
    url: "*://nn.hh.ru/applicant/resumes*" 
  });
  function hhTabIsCompleted(hhTab) {
    for (const tab of hhTab) {
      console.log(tab);
    }
  }
  function logError(error) {
    console.error(`Error: ${error}`);
  }
  hhTab.then(hhTabIsCompleted, logError) */
}

function tabReload() {
  window.location.reload();
}

function logError(error) {
  // функция отображения ошибки
  console.error(`Error: ${error}`);
}

function getTab(url) {
  return chrome.tabs.query({
    //ищем страницу резюме среди вкладок браузера
    url: url,
  });
}

function executingScript(target, func, args = null) {
  chrome.scripting.executeScript({
    // и инкапсулируем в страницу код tabReload
    target: { tabId: target[0].id },
    function: func,
    args: [args],
  });
}

function recolorResumeName(resumeName) {
  function randomNumber(max) {
    // Случайное число [0;max-1]
    return Math.floor(Math.random() * max);
  }
  let recolorResumeNameInterval = setInterval(() => {
    // let recolorResumeNameTimeout = setTimeout(() => {
    // таймер на 3 сек
    // console.log(`resumeName = ${resumeName}`);
    let color =
      '#' +
      `${`00${(51 + randomNumber(205)).toString(16)}`.slice(-2)}` +
      `${`00${(51 + randomNumber(205)).toString(16)}`.slice(-2)}` +
      `${`00${(51 + randomNumber(205)).toString(16)}`.slice(-2)}`;
    // let resume = document.querySelector(`[data-qa-title="${resumeName}"] span`);
    let resume = document.querySelector(`[data-qa-title="${resumeName}"]`);
    resume
      ? (upDateBtn = resume.querySelector(
          '[data-qa="resume-update-button_actions"]'
        ))
      : null;
    upDateBtn
      ? (upDateBtn.style.cssText = `
          border-bottom: 3px dashed ${color}; 
          padding-bottom: 0`)
      : // upDateBtn.click(); tabReload()
        null;
    console.log(`color = ${color}`);
    // console.log('resume = ');
    // console.log(resume);
  }, 3000);
}

function startSmallInterval() {
  // функция малого интервала; проверяет имя, присутствие страницы и её статус загрузки
  let validator = setInterval(() => {
    // малый интервал на 5 сек
    // chrome.storage.local.get(console.log); // отобразить local storage из ServiceWorker
    let name; // внутр. переменная для сохранения имени резюме

    let resumeName = chrome.storage.local.get(['resumeName']); //вытаскиваем из SWLS название резюме
    resumeName.then(
      (result) => {
        name = result.resumeName;
        if (!result.resumeName) {
          // если в SWLS названия резюме нет, то
          console.log('ИМЯ РЕЗЮМЕ НЕ УСТАНОВЛЕНО');
          return; // ничего не делай
        }
        console.log(`ИМЯ РЕЗЮМЕ ${name}`);
        hhTabIsOpened(); // иначе выполни проверку страницы
      },
      (error) => logError(error)
    );

    function hhTabIsOpened() {
      // функция проверки присутствия страницы среди вкладок браузера
      let hhTab = getTab('*://nn.hh.ru/applicant/resumes*');
      hhTab.then(
        // если есть result запусти проверку полной загрузки страницы
        (result) => {
          console.log('СТРАНИЦА ОТКРЫТА');
          hhTabIsCompleted(result);
        },
        (error) => logError(error)
      );
    }

    function hhTabIsCompleted(hhTab) {
      // функция проверки полной загрузки страницы
      if (hhTab[0].status != 'complete') {
        console.log('СТРАНИЦА ВСЕ ЕЩЁ ГРУЗИТСЯ');
        return;
      }
      // console.log('name: ' + name);
      clearInterval(validator); // останавливаем малый интервал validator
      executingScript(hhTab, recolorResumeName, name); // запускаем инкапсуляцию ф-ции смены цветов
      console.log(`СТРАНИЦА ЗАГРУЖЕНА
validator ОСТАНОВЛЕН`);
      bigTimerMng('start'); // запуск большого интервала
      // chrome.storage.local.clear(); // очищаем ServiceWorker LocalStorage, удаляем имя резюме
      // console.log('УДАЛИЛИ ИМЯ РЕЗЮМЕ');
    }
  }, 5000);
}
let bigTimerID;
function bigTimerMng(command) {
  // let bigTimer;
  let bigTimer = function () {
    // console.log(`START_BIG_INTERVAL запущен`);
    // большой интервал на 60 секунд
    let hhTab = getTab('*://nn.hh.ru/applicant/resumes*'); // снова проверяем присутствие страницы
    hhTab.then(
      // если она есть, инкапсулируем ф-цию перезагрузки страницы
      (result) => executingScript(result, tabReload),
      (error) => logError(error)
    );
    clearTimeout(bigTimer);
    startSmallInterval();
    //   console.log(`КОМАНДА НА ПЕРЕЗАГРУЗКУ ОТПРАВЛЕНА
    // BIG_INTERVAL ОСТАНОВЛЕН
    // START_SMALL_INTERVAL ЗАПУЩЕН
    // ********************************************************`);
    console.log('Конец bigTimer');
  };
  // command == 'start' ? setTimeout(bigTimer, 60000) : null;
  // command == 'stop' ? clearTimeout(bigTimer) : null;

  if (command == 'start') {
    bigTimerID = setTimeout(bigTimer, 60000);
    console.log(`START_BIG_INTERVAL запущен`);
    // console.dir(bigTimer);
  }
  // console.log(`bigTimer = ${bigTimer}`);
  if (command == 'stop') {
    clearTimeout(bigTimerID);
    startSmallInterval();
    console.log(`КОМАНДА НА ПЕРЕЗАГРУЗКУ ОТПРАВЛЕНА
    BIG_INTERVAL ОСТАНОВЛЕН
    START_SMALL_INTERVAL ЗАПУЩЕН
    ********************************************************`);
    // console.log(`stop bigTimer = ${bigTimer}`);
  }
}

chrome.runtime.onMessage.addListener((req, sender, response) => {
  if (req.message) response({ status: 'ok', message: req.message });
  // console.dir(this);
  if (req.message == 'STOP') {
    let hhTab = getTab('*://nn.hh.ru/applicant/resumes*'); // снова проверяем присутствие страницы
    hhTab.then(
      // если она есть, инкапсулируем ф-цию перезагрузки страницы
      (result) => executingScript(result, tabReload),
      (error) => logError(error)
    );
    bigTimerMng('stop');
    console.log(`КОМАНДА НА ПЕРЕЗАГРУЗКУ ОТПРАВЛЕНА
BIG_INTERVAL ОСТАНОВЛЕН`);
  }
  // console.log('req:');
  // console.dir(req);
});

startSmallInterval(); // запускаем весь скрипт
