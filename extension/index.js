let getText = "";
let initialisation = false;
let reg1 = /[^a-zA-Z0-9]/g;
let reg2 = /[יטכ]/g;
let reg3 = /[ןמ]/g;
let reg4 = /[אגה]/g;
let reg5 = /[פצ]/g;
let reg6 = /[üûש]/g;
let reg7 = /[^0-9]/;
let regCP = /[0-9][0-9][0-9][0-9][0-9]/;
let checkedData = false;
let datasFile = {
    firstname : "",
    adress : "",
    adress_heberg : "",
    adress_complement : "",
    code_postal : null,
    name_city : ""
};



function modifyDOM() {
        console.log(getText);
        document.getElementsByName("request[custom_fields][7060121879197]")[0].value = "test";
        return document.body.innerHTML;
    }

function selectTab() {
    datasFile.firstname = datasFile.firstname.replaceAll(reg1," ");
    datasFile.adress = datasFile.adress.replaceAll(reg1," ");
    datasFile.adress_heberg = datasFile.adress_heberg.replaceAll(reg1," ");
    datasFile.adress_complement = datasFile.adress_complement.replaceAll(reg1," ");
    datasFile.name_city = datasFile.name_city.replaceAll(reg1," ");

    chrome.tabs.executeScript({
        code: 'getText.firstname = "'+datasFile.firstname+'"; getText.adress = "'+datasFile.adress+'"; getText.adress_heberg = "'+datasFile.adress_heberg+'"; getText.adress_complement = "'+datasFile.adress_complement+'"; getText.code_postal = "'+datasFile.code_postal+'"; getText.name_city = "'+datasFile.name_city+'"; (' + modifyDOM + ')();'
    }, (results) => {
        console.log(results[0]);
        initialisation = true;
    });
}

document.getElementById("clickBS").addEventListener('click', () => {
    navigator.clipboard.readText().then((content)=>{
        getText = content;
        if (initialisation){
            initialisation = false;
            getText = getText.toLowerCase();
            getText = getText.replaceAll(reg2,"e");
            getText = getText.replaceAll(reg3,"i");
            getText = getText.replaceAll(reg4,"a");
            getText = getText.replaceAll(reg5,"o");
            getText = getText.replaceAll(reg6,"u");
            getText = getText.toUpperCase();
            getText = getText.split("\n");

            getText.map((data, idLoop)=>{
                checkedData = false;
                if (data.includes("ANTOINE") && reg7.test(data)){
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
                } else if (data.includes("CHEZ ") && reg7.test(data)) {
                    datasFile.adress_heberg = data.replace("\r","");
                    if (datasFile.adress_heberg[0]==" "){
                        datasFile.adress_heberg = datasFile.adress_heberg.replace(" ","");
                    }
                } else if (data.includes("CZ ") && reg7.test(data)) {
                    datasFile.adress_heberg = data.replace("\r","");
                    if (datasFile.adress_heberg[0]==" "){
                        datasFile.adress_heberg = datasFile.adress_heberg.replace(" ","");
                    }
                } else {
                    if (idLoop==getText.length-2){
                        for (let i = 0; i < data.split('-').length; i++){
                            if (getText[idLoop+1].includes(data.split('-')[i])){                                
                                checkedData = true;
                            }
                        }
                        if (checkedData){
                            return false;
                        }
                    }
                    if (data.includes("APPARTEMENT") || 
                        data.includes("APPT") ||
                        data.includes("BATIMENT") ||
                        data.includes("RESIDENCE") ||
                        data.includes("ESCALIER") ||
                        data.includes("ETAGE") ||
                        data.includes("ETG") ||
                        data.includes("LOGEMENT") ||
                        data.includes("LOGT")
                    ){
                        datasFile.adress_complement = data;
                        }
                        else {
                        datasFile.adress = data;
                    }
                }
                datasFile.adress_complement = datasFile.adress_complement.replace("\r","");
                datasFile.adress = datasFile.adress.replace("\r","");
                if (datasFile.adress_complement[0]==" "){
                    datasFile.adress_complement = datasFile.adress_complement.replace(" ","");
                }
                if (datasFile.adress[0]==" "){
                    datasFile.adress = datasFile.adress.replace(" ","");
                }
            });
            selectTab(); 
        }
        
    });

    /*navigator.clipboard.writeText("test").then(()=>{

    });*/
   
});

chrome.tabs.executeScript({
        code: 'let getText = {};'
    }, () => {
                initialisation = true;
    });