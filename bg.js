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



function recolorResumeName(resumeName){
  // if(!resumeName) {
  //   console.log('!!! ОШИБКА: не указано резюме !!!');
  //   return;
  // }
  // let resume = resumeName;
  // let r, g, b, color;
  // window.location.reload();
  
   let recolorResumeNameInterval = setInterval(()=>{ // интервал на 5 сек
      // console.log(`resumeName = ${resumeName}`);
      let r = Math.floor(Math.random() * (256)),
          g = Math.floor(Math.random() * (256)),
          b = Math.floor(Math.random() * (256)),
          color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
      // let resume = document.querySelector(`[data-qa-title="${resumeName}"] span`);
      let resume = document.querySelector(`[data-qa-title="${resumeName}"]`);
      resume ?
        upDateBtn = resume.querySelector('[data-qa="resume-update-button_actions"]') : null;
      upDateBtn ?
        upDateBtn.style.cssText = `
          border-bottom: 3px dashed ${color};
          padding-bottom: 0` : null;
      console.log(`color = ${color}`);
      // console.log('resume = ');
      // console.log(resume);
  },1000);
}



function tabReload(){
  window.location.reload();
}



function startSmallInterval(){

  let encapsulater = setInterval(async () =>{ // малый интервал на 5 сек
    await chrome.storage.local.get(console.log); // отобразить local storage из ServiceWorker
    
    await chrome.storage.local.get(
      ['resumeName'], 
      ({resumeName})=>{
        if(!resumeName) { // если в local storage НЕТ resumeName, то ничего не делай
          console.log('ИМЯ РЕЗЮМЕ НЕ УСТАНОВЛЕНО');
          return;
        };
        console.log('ИМЯ РЕЗЮМЕ УКАЗАНО');
        hhTabIsOpened(); // иначе выполни проверку страницы
      }
    )
    
    function hhTabIsOpened() { // функция проверки присутствия страницы среди вкладок
      let hhTab = chrome.tabs.query({ 
        url: "*://nn.hh.ru/applicant/resumes*" 
      });
      hhTab.then(hhTabIsCompleted, logError);
    } 
    
    async function hhTabIsCompleted(hhTab) { // функция проверки оконченной загрузки страницы
      console.log('СТРАНИЦА ОТКРЫТА');
      for (const tab of hhTab) {
        // console.log('привет из hhTabIsOpened, страница открыта');
        // console.dir(tab);
        if(tab.status != 'complete'){
          console.log('СТРАНИЦА ВСЕ ЕЩЁ ГРУЗИТСЯ');
          // console.dir(tab);
          return;
        }
        console.log('СТРАНИЦА ЗАГРУЖЕНА');
        // console.dir(tab);
        clearInterval(encapsulater); // останавливаем setInterval encapsulater
        console.log('ENCAPSULATER ОСТАНОВЛЕН');
        await chrome.storage.local.get(
          ['resumeName'],
          ({resumeName})=>{ scriptExecuter(resumeName); } // запуск функции инкапсуляции
        );
        // chrome.storage.local.clear(); // очищаем ServiceWorker LocalStorage, удаляем имя резюме
        // console.log('УДАЛИЛИ ИМЯ РЕЗЮМЕ');
        startBigInterval(); // запуск большого интервала
      }
    }
  
  },5000);
}



async function scriptExecuter(resumeName){ // функция инкапсуляции кода на страницу
  // (!resumeName) ? 
  //   (resumeName = null) : 
  //   (clearInterval(encapsulater), scriptIsEncapsulated = !scriptIsEncapsulated);
  
  // if(!resumeName) { return }; // если в local storage НЕТ resumeName, то ничего не делай
  // clearInterval(encapsulater); // останавливаем setInterval encapsulater
  // console.log('ОСТАНАВИЛИ ENCAPSULATER');
  // scriptIsEncapsulated = !scriptIsEncapsulated;
  // clearInterval(encapsulater);
  // console.log('ПРЕЗАГРУЗКА');
  // console.log(this); // ServiceWorkerGlobalScope
  let tabs = await chrome.tabs.query({}); // массив из ВСЕХ вкладок браузера
  for (let tab of tabs) { // пробегаемся по названиям всех вкладок
    if (tab.url.includes("https://nn.hh.ru/applicant/resumes")){ // находим данную вкладку
      chrome.scripting.executeScript({// и инкапсулируем в страницу код recolorResumeName
        target: { tabId: tab.id },
        function: recolorResumeName,
        args:[resumeName]
      });
      // scriptIsEncapsulated = !scriptIsEncapsulated; // тумблер вкл/выкл инкапсуляцию кода
    }
  };
  // chrome.storage.local.clear(); // очищаем ServiceWorker LocalStorage
  // console.log('ОЧИCТИЛИ SERVICEWORKER LOCALSTORAGE');
  // await chrome.storage.local.get(console.log);
};



function startBigInterval(){
  console.log('ПРИВЕТ ИЗ START_BIG_INTERVAL');
  let bigInterval = setInterval(() =>{
    
    let hhTab = chrome.tabs.query({ 
      url: "*://nn.hh.ru/applicant/resumes*" 
    });
    hhTab.then(hhTabReload, logError);
    
    function hhTabReload(hhTab){
      // console.dir(hhTab);
      chrome.scripting.executeScript({// и инкапсулируем в страницу код tabReload
        target: { tabId: hhTab[0].id },
        function: tabReload,
        // args:[resumeName]
      });
      console.log('КОМАНДА НА ПЕРЕЗАГРУЗКУ ОТПРАВЛЕНА');
      clearInterval(bigInterval);
      console.log('BIG_INTERVAL ОСТАНОВЛЕН');
      startSmallInterval();
      console.log('START_SMALL_INTERVAL ЗАПУЩЕН');
      console.log('********************************************************');
    }
  
  },60000)
}





















function logError(error) { // функция отображения ошибки
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

***********************/