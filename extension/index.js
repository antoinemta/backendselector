let getText = "";
let initialisation = false;
let reg1 = /[^a-zA-Z0-9]/g;
let reg2 = /[���]/g;
let reg3 = /[��]/g;
let reg4 = /[���]/g;
let reg5 = /[��]/g;
let reg6 = /[���]/g;



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
            //selectTab(); 
            getText = getText.toLowerCase();
            getText = getText.replaceAll(reg2,"e");
            getText = getText.replaceAll(reg3,"i");
            getText = getText.replaceAll(reg4,"a");
            getText = getText.replaceAll(reg5,"o");
            getText = getText.replaceAll(reg6,"u");
            getText = getText.toUpperCase();
            getText = getText.split("\n");

            getText.map((data)=>{
                if (reg1.test(data)){
                    console.log('test');
                }
            });
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