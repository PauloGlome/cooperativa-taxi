const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");

const languages = document.getElementById("languages");
const languageBtn = document.getElementById("languageBtn");

let menuAberto = false;
let idiomasAbertos = false;

/* MENU */

menuBtn.addEventListener("click",()=>{

if(menuAberto){

menu.style.right="-260px";
menuAberto=false;

}else{

menu.style.right="0";
menuAberto=true;

languages.style.left="-260px";
idiomasAbertos=false;

}

});

/* IDIOMAS */

languageBtn.addEventListener("click",()=>{

if(idiomasAbertos){

languages.style.left="-260px";
idiomasAbertos=false;

}else{

languages.style.left="0";
idiomasAbertos=true;

menu.style.right="-260px";
menuAberto=false;

}

});

/* FECHAR AO CLICAR FORA */

document.addEventListener("click",(e)=>{

if(!menu.contains(e.target) && !menuBtn.contains(e.target)){

menu.style.right="-260px";
menuAberto=false;

}

if(!languages.contains(e.target) && !languageBtn.contains(e.target)){

languages.style.left="-260px";
idiomasAbertos=false;

}

});

