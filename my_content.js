
// let resumeName = "Junior JavaScript & Intern React";
let resumeName; // название резюме
const input = document.querySelector("#resumeName"); 
input.addEventListener('change', (e) => {
  e.preventDefault();
  resumeName = input.value; // сохраняем в переменную вводимое название резюме
  // console.log(resumeName);
});

const btnStart = document.querySelector("#btnStart");
// console.log(btnStart);
btnStart.addEventListener('click', async (e)=>{
  e.preventDefault();
  if ((e.target) == btnStart){
    // chrome.storage.sync.set({ resumeName: resumeName });
  // console.log(resumeName);
    aaa(resumeName);    
    // let interval = setInterval(async ()=>{
    //   aaa(resumeName);
    //   // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    //   // chrome.storage.sync.set({ resumeName: resumeName });
    //   // // console.log(tab);
    //   // chrome.scripting.executeScript({
    //   //   target: { tabId: tab.id },
    //   //   function: hhResumesReload,
    //   // });

    //   // let timer = setTimeout(() => {
    //   //   chrome.scripting.executeScript({
    //   //     target: { tabId: tab.id },
    //   //     function: powerUpResume,
    //   //   });
    //   // }, 
    //   // (30*1000)); // 30 секунд
    // },
    // // (4*60*60*1000+60000)); // каждые 4 часа 1 минуту
    // (4*1000)); // каждые 10 секунд
  };
});
// };

async function aaa(resumeName){
  // console.log(resumeName);
  chrome.storage.local.set({ resumeName: resumeName }); // записываем в localStorage название резюме
  // let queryOptions = {}; // опции для запроса вкладок
  // let tabs = await chrome.tabs.query(queryOptions); // запрашиваем у браузера инфу о ВСЕХ вкладках
  let tabs = await chrome.tabs.query({}); // запрашиваем у браузера инфу о ВСЕХ вкладках
  for (let tab of tabs) { // пробегаемся по названиям всех вкладок
    if (tab.url.includes("https://nn.hh.ru/applicant/resumes")){ // находим данную вкладку
      // console.dir(tab);
      // chrome.scripting.executeScript({// и инкапсулируем в неё код powerUpResume
      //   target: { tabId: tab.id },
      //   function: powerUpResume,
      //   // function: log,
      // });
    }
  };
}

function powerUpResume() {
  
  let hhInterval = setInterval(async () => {

    let resume,btn,
      r = Math.floor(Math.random() * (256)),
      g = Math.floor(Math.random() * (256)),
      b = Math.floor(Math.random() * (256)),
      color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    await chrome.storage.local.get(["resumeName"], ({resumeName})=>{
      window.resumeName = resumeName;
      console.log(`resumeName = ${window.resumeName}`);
      resume = document.querySelector(`[data-qa-title="${resumeName}"]`);
      resume ?
        btn = resume.querySelector('[data-qa="resume-update-button"]'):null;
      btn ?
        btn.style.cssText = `
          border-bottom: 3px dashed ${color};
          padding-bottom: 0`:null;
      // btn.click();
    });

  },
  (10*1000))
  
  // let resume,btn,
  //     r = Math.floor(Math.random() * (256)),
  //     g = Math.floor(Math.random() * (256)),
  //     b = Math.floor(Math.random() * (256)),
  //     color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  // await chrome.storage.sync.get(["resumeName"], ({resumeName})=>{
  //   window.resumeName = resumeName;
  //   console.log(`resumeName = ${window.resumeName}`);
  //   resume = document.querySelector(`[data-qa-title="${resumeName}"]`);
  //   resume ?
  //     btn = resume.querySelector('[data-qa="resume-update-button"]'):null;
  //   btn ?
  //     btn.style.cssText = `
  //       border-bottom: 3px dashed ${color};
  //       padding-bottom: 0`:null;
  //   // btn.click();
  // });

};

// function hhResumesReload() {
//   location.reload();
// };

function log(){
  console.log(window);
}