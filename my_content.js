
// let resumeName = "Junior JavaScript & Intern React";
let resumeName;
const input = document.querySelector("#resumeName");
input.addEventListener('change', (e) => {
  e.preventDefault();
  resumeName = input.value;
});

const btnStart = document.querySelector("#btnStart");
// console.log(btnStart);
btnStart.addEventListener('click', async (e)=>{
  e.preventDefault();
  if ((e.target) == btnStart){
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.sync.set({ resumeName: resumeName });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: powerUpResume,
    });
    let interval = setInterval(async ()=>{
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.storage.sync.set({ resumeName: resumeName });
      // console.log(tab);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: hhResumesReload,
      });

      let timer = setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: powerUpResume,
        });
      }, 
      (30*1000)); // 30 секунд
    },
    (4*60*60*1000+60000)); // 4 часа и 1 минута
  };
});
// };

async function powerUpResume() {
  let resume,btn,
      r = Math.floor(Math.random() * (256)),
      g = Math.floor(Math.random() * (256)),
      b = Math.floor(Math.random() * (256)),
      color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  await chrome.storage.sync.get(["resumeName"], ({resumeName})=>{
    resume = document.querySelector(`[data-qa-title="${resumeName}"]`);
    resume ?
      btn = resume.querySelector('[data-qa="resume-update-button"]'):null;
    btn ?
      btn.style.cssText = `
        border-bottom: 3px dashed ${color};
        padding-bottom: 0`:null;
    btn.click();
  });
  
};

function hhResumesReload() {
  location.reload();
};









// async function first() {
//   await chrome.storage.sync.get(["resumeName"], ({resumeName})=>{
//     let resume, 
//         btn,
//         r = Math.floor(Math.random() * (256)),
//         g = Math.floor(Math.random() * (256)),
//         b = Math.floor(Math.random() * (256)),
//         color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    
//     resume = document.querySelector(`[data-qa-title="${resumeName}"]`);
//     resume ?
//       btn = resume.querySelector('[data-qa="resume-update-button"]'):
//       null;
//     console.log(`btn =`);
//     console.log(btn);
//     console.log(`color = ${color}`);
//     btn ?
//       btn.style.cssText = `
//         border-bottom: 3px dashed ${color};
//         padding-bottom: 0`:
//       null; 
//   });

// //   // let timerTwo = setTimeout(() => {btn.click()}, (30 * 1000));
// };

// async function second(){
//   await chrome.storage.sync.get(["resumeName"], ({resumeName})=>{
//     let resume, 
//         btn,
//         r = Math.floor(Math.random() * (256)),
//         g = Math.floor(Math.random() * (256)),
//         b = Math.floor(Math.random() * (256)),
//         color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    
//     resume = document.querySelector(`[data-qa-title="${resumeName}"]`);
//     resume ?
//       btn = resume.querySelector('[data-qa="resume-update-button"]'):
//       null;
//     console.log(`btn =`);
//     console.log(btn);
//     console.log(`color = ${color}`);
//     btn ?
//       btn.style.cssText = `
//         border-bottom: 3px dashed ${color};
//         padding-bottom: 0`:
//       null; 
//   });
//   location.reload();
// };
