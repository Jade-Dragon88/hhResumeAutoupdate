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

function recolorResumeName(resumeName) {
  // if(!resumeName) {
  //   console.log('!!! ОШИБКА: не указано резюме !!!');
  //   return;
  // }
  // let resume = resumeName;
  // let r, g, b, color;
  // window.location.reload();

  let recolorResumeNameInterval = setInterval(() => {
    // интервал на 5 сек
    // console.log(`resumeName = ${resumeName}`);
    let r = Math.floor(Math.random() * 256),
      g = Math.floor(Math.random() * 256),
      b = Math.floor(Math.random() * 256),
      color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
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
      : null;
    console.log(`color = ${color}`);
    // console.log('resume = ');
    // console.log(resume);
  }, 1000);
}

function tabReload() {
  window.location.reload();
}

function startSmallInterval() {
  // функция малого интервала; проверяет имя, страницу и её статус

  let validator = setInterval(async () => {
    // малый интервал на 5 сек
    await chrome.storage.local.get(console.log); // отобразить local storage из ServiceWorker
    let name; // внутр. переменная для сохранения имени резюме

    let resumeName = chrome.storage.local.get(['resumeName']); //вытаскиваем из SWLS название резюме
    resumeName.then(
      (result) => {
        name = result.resumeName;
        if (!result.resumeName) {
          // если в SWLS названия резюме нет, то
          console.log('ИМЯ РЕЗЮМЕ НЕ УСТАНОВЛЕНО');
          return;
        } // ничего не делай
        console.log('ИМЯ РЕЗЮМЕ УКАЗАНО');
        hhTabIsOpened(); // иначе выполни проверку страницы
      },
      (error) => logError(error)
    );

    function hhTabIsOpened() {
      // функция проверки присутствия страницы среди вкладок браузера
      let hhTab = chrome.tabs.query({
        //ищем страницу резюме среди вкладок браузера
        url: '*://nn.hh.ru/applicant/resumes*',
      });
      hhTab.then(
        // если есть result запусти проверку полной загрузки страницы
        (result) => {
          console.log('СТРАНИЦА ОТКРЫТА');
          hhTabIsCompleted(result[0]);
        },
        (error) => logError(error)
      );
    }

    function hhTabIsCompleted(hhTab) {
      // функция проверки полной загрузки страницы
      if (hhTab.status != 'complete') {
        console.log('СТРАНИЦА ВСЕ ЕЩЁ ГРУЗИТСЯ');
        return;
      }
      // console.log('name: ' + name);
      console.log('СТРАНИЦА ЗАГРУЖЕНА');
      clearInterval(validator); // останавливаем малый интервал validator
      console.log('validator ОСТАНОВЛЕН');
      scriptExecuter(name, recolorResumeName); // запуск функции инкапсуляции
      // chrome.storage.local.clear(); // очищаем ServiceWorker LocalStorage, удаляем имя резюме
      // console.log('УДАЛИЛИ ИМЯ РЕЗЮМЕ');
      startBigInterval(); // запуск большого интервала
    }
  }, 5000);
}

function scriptExecuter(resumeName, func) {
  // функция инкапсуляции кода на страницу
  let hhTab = chrome.tabs.query({
    //ищем страницу резюме среди вкладок браузера
    url: '*://nn.hh.ru/applicant/resumes*',
  });
  hhTab.then(
    (result) => {
      chrome.scripting.executeScript({
        // и инкапсулируем в страницу код recolorResumeName
        target: { tabId: result[0].id },
        function: func,
        args: [resumeName],
      });
    },
    (error) => logError(error)
  );
}

function startBigInterval() {
  console.log('START_BIG_INTERVAL запущен');
  let bigInterval = setTimeout(() => {
    // большой интервал на 60 секунд

    let hhTab = chrome.tabs.query({
      url: '*://nn.hh.ru/applicant/resumes*',
    });
    hhTab.then(hhTabReload, logError);
    console.log('КОМАНДА НА ПЕРЕЗАГРУЗКУ ОТПРАВЛЕНА');
    clearTimeout(bigInterval);
    console.log('BIG_INTERVAL ОСТАНОВЛЕН');
    startSmallInterval();
    console.log('START_SMALL_INTERVAL ЗАПУЩЕН');
    console.log('********************************************************');
  }, 60000);
}

function hhTabReload(hhTab) {
  // console.dir(hhTab);
  chrome.scripting.executeScript({
    // и инкапсулируем в страницу код tabReload
    target: { tabId: hhTab[0].id },
    function: tabReload,
    // args:[resumeName]
  });
}

function logError(error) {
  // функция отображения ошибки
  console.error(`Error: ${error}`);
}

startSmallInterval();

/**********************

ПРИ  ПЕРЕЗАГРУЗКЕ  СТРАНИЦЫ
ИНКАПСУЛИРОВАННЫЙ  ТЕКСТ  УДАЛЯЕТСЯ

ЭТО  ЗНАЧИТ, ЧТО  ПОЛНУЮ  ЗАГРУЗКУ  СТРАНИЦЫ
ДОЛЖЕН  ОТСЛЕЖИВАТЬ  BG.JS
И  ПОСЛЕ  ТОГО, КАК  ЭТО ПРОИЗОШЛО, СНОВА
ИНКАПСУЛИРОВАТЬ  СКРИПТ  НА  СТРАНИЦУ

************************/
