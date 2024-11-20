let getText = "";
let initialisation = false;

function modifyDOM() {
        console.log(getText);
        return document.body.innerHTML;
    }

function selectTab() {
    chrome.tabs.executeScript({
        code: 'getText = "'+getText+'"; (' + modifyDOM + ')();'
    }, (results) => {
        console.log(results[0]);
    });
}

document.getElementById("test").addEventListener('click', () => {
    navigator.clipboard.readText().then((content)=>{
        getText = content;
        if (initialisation){
            selectTab();
        }
        
    });

    /*navigator.clipboard.writeText("test").then(()=>{

    });*/
   
});

chrome.tabs.executeScript({
        code: 'let getText = "";'
    }, () => {
                initialisation = true;
    });