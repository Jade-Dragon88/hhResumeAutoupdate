
function logResumeName(resumeName){
  // if(!resumeName) {
  //   console.log('!!! ОШИБКА: не указано резюме !!!');
  //   return;
  // }
  // let resume = resumeName;
  // let r, g, b, color;
  let logResumeNameInterval = setInterval(()=>{ // интервал на 5 сек
      console.log(`resumeName = ${resumeName}`);
      let r = Math.floor(Math.random() * (256)),
          g = Math.floor(Math.random() * (256)),
          b = Math.floor(Math.random() * (256)),
          color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
      let resume = document.querySelector(`[data-qa-title="${resumeName}"] span`);
      console.log(`color = ${color}`);
      console.log('resume = '+resume);
      resume.style.cssText = `
          border-bottom: 5px dashed ${color};
          padding-bottom: 0`;
    },500);
}






// let scriptIsEncapsulated = 0; // тумблер вкл/выкл инкапсуляцию кода
let encapsulater = setInterval(async () =>{ // интервал на 10 сек
  await chrome.storage.local.get(console.log); // отобразить local storage из ServiceWorker
  await chrome.storage.local.get(['resumeName'], 
    ({resumeName})=>{
      if(!resumeName) { return }; // если в local storage НЕТ resumeName, то ничего не делай
      scriptExecuter(resumeName); // иначе выполняй scriptExecuter
    }
  )
  // console.log('ПРЕЗАГРУЗКА');
  async function scriptExecuter(resumeName){
    // (!resumeName) ? 
    //   (resumeName = null) : 
    //   (clearInterval(encapsulater), scriptIsEncapsulated = !scriptIsEncapsulated);
      
    // if(!resumeName) { return }; // если в local storage НЕТ resumeName, то ничего не делай
    clearInterval(encapsulater);
    // scriptIsEncapsulated = !scriptIsEncapsulated;
      // clearInterval(encapsulater);
    console.log('ПРИВЕТ ИЗ scriptExecuter');
      // console.log(this); // ServiceWorkerGlobalScope
    let tabs = await chrome.tabs.query({}); // запрашиваем у браузера инфу о ВСЕХ вкладках
    for (let tab of tabs) { // пробегаемся по названиям всех вкладок
      if (tab.url.includes("https://nn.hh.ru/applicant/resumes") // находим данную вкладку
          /*&& !scriptIsEncapsulated*/){ 
        // console.dir(tab);
        chrome.scripting.executeScript({// и инкапсулируем в страницу код logResumeName
          target: { tabId: tab.id },
          function: logResumeName,
          args:[resumeName]
        });
        // scriptIsEncapsulated = !scriptIsEncapsulated; // тумблер вкл/выкл инкапсуляцию кода
      }
    };
    chrome.storage.local.clear(); // очищаем ServiceWorker LocalStorage
    // await chrome.storage.local.get(console.log);
  }
},10000)



/**********************

СНАЧАЛА  ИНКАПСУЛИРУЕМ  КОД  function logResumeName
А  ЗАТЕМ  УПРАВЛЯЕМ  ВЫПОЛНЕНИЕМ  ЭТОЙ  ФУНКЦИИ
ЧЕРЕЗ  ИЗМЕНЕНИЕ  ГЛОБАЛЬНОЙ  ПЕРЕМЕННОЙ  НА  СТРАНИЦЕ HEADHANTER

***********************/