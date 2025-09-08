let gameSeq=[];
let userSeq=[];

let btns=["yellow","red","green","purple"];

let started=false;
let level=0;

h2=document.querySelector("h2");

document.addEventListener("keypress",function(){
    if(started==false){
        console.log("Game started");
        started=true;

        levelup();
    }   
});     

function gameflash(btn){
    btn.classList.add("flash");
    setTimeout(function(){
        btn.classList.remove("flash");
    },200);    
}

function userflash(btn){
    btn.classList.add("userflash");
    setTimeout(function(){
        btn.classList.remove("userflash");
    },200);    
}

function levelup(){
    userSeq=[];
    level++;
    h2.innerText="Level "+level;

    let randIdx=Math.floor(Math.random()*4);
    let randColor=btns[randIdx];
    console.log(randIdx);
    console.log(randColor);
    gameSeq.push(randColor);
    console.log(gameSeq);
    randBtn=document.querySelector("."+randColor);
    gameflash(randBtn);
}    

function checkans(idx){
   
    if(userSeq[idx]===gameSeq[idx]){
        console.log("Success");
        if(userSeq.length===gameSeq.length){
            setTimeout(levelup,1000);
        }    
    }
    else{
        console.log("Wrong");
        h2.innerHTML=`Game Over! your score was <b> ${level}</b> Press any key to restart`;
        document.querySelector("body").style.backgroundColor="red";
        setTimeout(function(){
            document.querySelector("body").style.backgroundColor="white";
        },200);
        reset();
    }        
}    
function btnPress(){
    let btn=this;
    userflash(btn);

    usercolor=btn.getAttribute("id");
    userSeq.push(usercolor);

    checkans(userSeq.length-1);
}

let allbtns=document.querySelectorAll(".btn");

for(btn of allbtns){
    btn.addEventListener("click",btnPress);    
}

function reset(){
    level=0;
    gameSeq=[];
    started=false;
    userSeq=[];
}    