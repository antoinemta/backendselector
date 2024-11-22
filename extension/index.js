let getText = "";
let initialisation = false;
let reg1 = /[^a-zA-Z0-9]/g;
let reg2 = /[���]/g;
let reg3 = /[��]/g;
let reg4 = /[���]/g;
let reg5 = /[��]/g;
let reg6 = /[���]/g;
let regCP = /[0-9][0-9][0-9][0-9][0-9]/;
let datasFile = {
    firstname : "",
    adress : "",
    code_postal : null,
    name_city : ""
};



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
                if (data.includes("ANTOINE")){
                    datasFile.firstname = "ANTOINE";
                } else if (regCP.test(data)){
                    data = data.split(" ");
                    data.map((selectedData, id)=>{
                        if (regCP.test(selectedData)){
                            datasFile.code_postal = selectedData;
                        }else{
                            if (selectedData!=""){
                                datasFile.name_city = datasFile.name_city + selectedData;
                                if (id<data.length-1){
                                    datasFile.name_city = datasFile.name_city + " ";
                                }
                            }
                        }
                    });                    
                } else {
                    datasFile.adress = datasFile.adress + data.replaceAll("\r","");
                    if (datasFile.adress[0]===" "){
                        datasFile.adress = datasFile.adress.replace(" ","");
                    }
                }             
            });
            console.log(datasFile);
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