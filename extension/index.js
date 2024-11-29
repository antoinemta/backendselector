let getText = "";
let initialisation = false;
let reg1 = /[^a-zA-Z0-9]/g;
let reg2 = /[���]/g;
let reg3 = /[��]/g;
let reg4 = /[���]/g;
let reg5 = /[��]/g;
let reg6 = /[���]/g;
let reg7 = /[^0-9]/;
let reg8 = /  +/g;
let reg9 = / $/;
let regCP = /[0-9][0-9][0-9][0-9][0-9]/;
let regMin = /[a-z]/;
let checkedData = false;
let datasFile = {
    firstname : "",
    lastname : "",
    adress : "",
    adress_heberg : "",
    adress_complement : "",
    code_postal : null,
    name_city : ""
};

function gettingContent(typeFile){
    alert(typeFile);
}

function getDom(){
        let currentName = [];
        let loopName = null;
        currentName = document.getElementsByTagName("a");
        for (let a = 0; a<currentName.length; a++){
            if (currentName[a].href.includes("/personne") && !currentName[a].href.includes("/document")){
                loopName = a;
            }
        }
        return currentName[loopName].textContent;
    }

function modifyDOM() {
        if (getText.adress_heberg!=""){
            getText.adress_heberg = getText.adress_heberg + " ";
        }
        if (getText.adress_complement!=""){
            getText.adress_complement = getText.adress_complement + " ";
        }
        document.getElementsByName("data[nom1]")[0].value = getText.firstname;
        document.getElementsByName("data[nom_usage1]")[0].value = getText.firstname;
        document.getElementsByName("data[prenom1]")[0].value = getText.firstname;
        document.getElementsByName("data[adresse]")[0].value = getText.adress_heberg + getText.adress_complement + getText.adress;
        document.getElementsByName("data[code_postal]")[0].value = getText.code_postal;
        document.getElementsByName("data[ville]")[0].value = getText.name_city;
        document.getElementsByName("data[rnvp_intitule2]")[0].value = getText.adress_heberg;
        document.getElementsByName("data[rnvp_batiment]")[0].value = getText.adress_complement;
        document.getElementsByName("data[rnvp_rue]")[0].value = getText.adress;
        return true;
    }

function selectTab() {
    datasFile.firstname = datasFile.firstname.replaceAll(reg1," ");
    datasFile.lastname = datasFile.lastname.replaceAll(reg1," ");
    datasFile.adress = datasFile.adress.replaceAll(reg1," ");
    datasFile.adress_heberg = datasFile.adress_heberg.replaceAll(reg1," ");
    datasFile.adress_complement = datasFile.adress_complement.replaceAll(reg1," ");
    datasFile.name_city = datasFile.name_city.replaceAll(reg1," ");
    datasFile.firstname = datasFile.firstname.replaceAll(reg8," ");
    datasFile.lastname = datasFile.lastname.replaceAll(reg8," ");
    datasFile.adress = datasFile.adress.replaceAll(reg8," ");
    datasFile.adress_heberg = datasFile.adress_heberg.replaceAll(reg8," ");
    datasFile.adress_complement = datasFile.adress_complement.replaceAll(reg8," ");
    datasFile.name_city = datasFile.name_city.replaceAll(reg8," ");


    chrome.tabs.executeScript({
        code: 'getText.firstname = "'+datasFile.firstname+'"; getText.adress = "'+datasFile.adress+'"; getText.adress_heberg = "'+datasFile.adress_heberg+'"; getText.adress_complement = "'+datasFile.adress_complement+'"; getText.code_postal = "'+datasFile.code_postal+'"; getText.name_city = "'+datasFile.name_city+'"; (' + modifyDOM + ')();'
    }, (results) => {
        initialisation = true;
    });
}

document.getElementById("clickAI").addEventListener('click', () => {
    gettingContent("AI");
    return false;
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
                if (data.includes(datasFile.firstname) && reg7.test(data)){
                    datasFile.lastname = data.split(datasFile.firstname)[0];
                    datasFile.lastname = datasFile.lastname.toLowerCase();
                    datasFile.lastname = datasFile.lastname.replaceAll(reg2,"e");
                    datasFile.lastname = datasFile.lastname.replaceAll(reg3,"i");
                    datasFile.lastname = datasFile.lastname.replaceAll(reg4,"a");
                    datasFile.lastname = datasFile.lastname.replaceAll(reg5,"o");
                    datasFile.lastname = datasFile.lastname.replaceAll(reg6,"u");
                    datasFile.lastname = datasFile.lastname.replace("mle ","");
                    datasFile.lastname = datasFile.lastname.replace("mlle ","");
                    datasFile.lastname = datasFile.lastname.replace("mme ","");
                    datasFile.lastname = datasFile.lastname.replace("mr ","");
                    datasFile.lastname = datasFile.lastname.replace("ou ","");
                    if (datasFile.lastname[0]==" "){
                        datasFile.lastname = datasFile.lastname.replace(" ","");
                    }
                    if (datasFile.lastname[datasFile.lastname.length-1]==" "){
                        datasFile.lastname = datasFile.lastname.replace(reg9,"");
                    }
                    datasFile.lastname = datasFile.lastname.toUpperCase();
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
        code: 'let getText = {}; (' + getDom + ')();'
    }, (getName) => {
                let names = "";
                let names2 = [];
                names=getName[0];
                names = names.split(" ");
                names.map((actualName)=>{
                    if (actualName != "" && actualName != " " && !actualName.includes("ocataire")){
                        names2.push(actualName);
                    }
                });
                names2.map((actualName2)=>{
                    if (regMin.test(actualName2)){
                        datasFile.firstname = actualName2;
                    }
                });
                datasFile.firstname = datasFile.firstname.toLowerCase();
                datasFile.firstname = datasFile.firstname.replaceAll(reg2,"e");
                datasFile.firstname = datasFile.firstname.replaceAll(reg3,"i");
                datasFile.firstname = datasFile.firstname.replaceAll(reg4,"a");
                datasFile.firstname = datasFile.firstname.replaceAll(reg5,"o");
                datasFile.firstname = datasFile.firstname.replaceAll(reg6,"u");
                datasFile.firstname = datasFile.firstname.toUpperCase();
                console.log(datasFile);
                initialisation = true;
    });