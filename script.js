var rows = document.getElementById("rows").value;
var cols = document.getElementById("cols").value;
var mines = document.getElementById("mines").value;
var numFlags = document.getElementById("numFlags");
var hasStarted = 0;
var nonMineCells = 0;
var startTime;
var timerInterval;

var rowsDef = rows, colsDef = cols, minesDef = mines;

var minesPos = [];
var mineVal = new Array(4040).fill(-1);

var flagPos = [];
//console.log(mineVal);

window.onload = function(){
    numFlags.value = mines;
    document.addEventListener('contextmenu', event => event.preventDefault());
    generate();
}

function setValue(){
    rows = document.getElementById("rows").value;
    cols = document.getElementById("cols").value;
    mines = document.getElementById("mines").value;
    minesPos = [];
    mineVal = new Array(4040).fill(-1);
    flagPos = [];
    nonMineCells = 0;
    document.getElementById("timer").textContent="00:00";
    clearInterval(timerInterval);
    if(rows>40 || cols>40){
        alert("Too large board to generate!");
        rows = rowsDef; cols=colsDef; mines=minesDef;
        document.getElementById("rows").value = rows;
        document.getElementById("cols").value = cols;
        document.getElementById("mines").value = mines;
        return;
        //generate();
    }else if(mines> (0.5 * rows * cols) || mines<1){
        alert("Too many mines :)");
        rows = rowsDef; cols=colsDef; mines=minesDef;
        document.getElementById("rows").value = rows;
        document.getElementById("cols").value = cols;
        document.getElementById("mines").value = mines;
        numFlags.innerText = mines;
        generate();
    }else{
        numFlags.innerText = mines;
        generate();
    }
}
function generate(){
    hasStarted = 0;
    var table = document.getElementById("table");
    let child = table.lastElementChild;
    while(child){
        table.removeChild(child);
        child = table.lastElementChild;
    }
    for(let i=0; i<rows; i++){
        var tr = document.createElement("tr");
        for(let j=0; j<cols; j++){
            var td = document.createElement("td");
            td.setAttribute("id",100*i + j);
            //td.setAttribute("onclick","clickCell(this)");
            td.setAttribute("onmousedown","getMouseClick(this,event)");
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    rowsDef = rows, colsDef = cols, minesDef = mines;
};

function getMouseClick(element,event){
    if(event.button == 0){
        clickCell(element);
    }else if(event.button == 2){
        dblClickCell(element);
    }
}

function generateMinePos(currID){
    let x = Math.floor(Math.random()*cols);
    let y = Math.floor(Math.random()*rows);
    var id = 100*y + x;
    currID = parseInt(currID);
    if (id!=currID && !minesPos.includes(id) && id!=currID+1 && id!=currID-1 && id!=currID+100 && id!=currID-100 && id!=currID+101 && id!=currID+99 && id!=currID-99 && id!=currID-101){
        return id;
    }else{
        return generateMinePos(currID);
    }
}

function placeMines(currID){
    for(let i=0; i<mines; i++){
        minesPos.push(generateMinePos(currID));
    }
    //console.log(minesPos);
}

function updateTimer(){
    let elapsedTime = (Date.now() - startTime) / 1000;
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = Math.floor(elapsedTime % 60);
    document.getElementById("timer").textContent = `${pad(minutes)}:${pad(seconds)}`;
    //console.log(minutes + ":" + seconds);
}

function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

function clickCell(element){
    if(hasStarted==0) {
        //console.log(element.id);
        placeMines(element.id);
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
        hasStarted = 1;
    }
    if(document.getElementById(element.id).innerText==""){
        dig(element.id);
        //console.log(nonMineCells);
    }
    if(nonMineCells==(rows*cols)-mines){
        alert("You Won!!");
        victory();
    }
}

function dblClickCell(element){
    var flag = document.getElementById(element.id);
    if(flag.innerHTML==""){ 
        flag.innerHTML = "&#128681";
        numFlags.innerText-=1;
        flagPos.push(parseInt(element.id));
    }else if(flagPos.includes(parseInt(element.id))){
        flag.innerHTML = "";
        numFlags.innerText=parseInt(numFlags.innerText)+1;
        flagPos.splice(flagPos.indexOf(parseInt(element.id)),1);
    }
    //console.log(flagPos);
}

function dig(currID){
    if(minesPos.includes(parseInt(currID))){
        gameOver();
        alert("Game Over");
        clearInterval(timerInterval);
        return;
    }
    nonMineCells++;
    var numMines = detectMine(currID);
    var cell = document.getElementById(currID);
    if(numMines>0){
        cell.innerText=numMines;
        mineVal[currID]=numMines;
        if(numMines==1){
            cell.style.color = "rgb(0, 57, 227)";
        }
        if(numMines==2){
            cell.style.color = "rgb(36, 115, 36)";
        }
        if(numMines==3){
            cell.style.color = "rgb(180, 8, 8)";
        }
        if(numMines==4){
            cell.style.color = "rgb(100, 8, 180)";
        }
        if(numMines==5){
            cell.style.color = "rgb(180, 22, 119)";
        }
        if(numMines==6){
            cell.style.color = "rgb(179, 255, 0)";
        }
        if(numMines==7){
            cell.style.color = "rgb(255, 170, 0)";
        }
        if(numMines==8){
            cell.style.color = "rgb(0, 0, 0)";
        }
        return;
    }
    cell.innerText=0;
    mineVal[currID]=0;
    currID = parseInt(currID);
    if(currID%100 != cols-1){
        if(mineVal[currID+1]==-1) dig(currID+1);
    }
    if(currID%100 != 0){
        if(mineVal[currID-1]==-1) dig(currID-1);
    }
    if(Math.floor(currID/100)!=0){
        if(mineVal[currID-100]==-1) dig(currID-100);
    }
    if(Math.floor(currID/100)!=rows-1){
        if(mineVal[currID+100]==-1) dig(currID+100);
    }
    if(currID%100 != cols-1 && Math.floor(currID/100)!=rows-1){
        if(mineVal[currID+101]==-1) dig(currID+101);
    }
    if(currID%100 != cols-1 && Math.floor(currID/100)!=0){
        if(mineVal[currID-99]==-1) dig(currID-99);
    }
    if(currID%100 != 0 && Math.floor(currID/100)!=0){
        if(mineVal[currID-101]==-1) dig(currID-101);
    }
    if(currID%100 != 0 && Math.floor(currID/100)!=rows-1){
        if(mineVal[currID+99]==-1) dig(currID+99);
    }
}

function detectMine(currID){
    var count=0;
    currID = parseInt(currID);
    if(currID%100 != cols-1){
        if(minesPos.includes(currID+1)) {count++;}
        if(minesPos.includes(currID+1+100)) {count++;}
        if(minesPos.includes(currID+1-100)) {count++;}
    }
    if(currID%100 != 0){
        if(minesPos.includes(currID-1)) count++;
        if(minesPos.includes(currID-1-100)) count++;
        if(minesPos.includes(currID-1+100)) count++;
    }
    if(minesPos.includes(currID-100)) count++;
    if(minesPos.includes(currID+100)) count++;
    //console.log(currID+" : "+count);
    return count;
}

function gameOver(){
    for(let i=0; i<minesPos.length; i++){
        var mineCell = document.getElementById(minesPos[i]);
        if(mineCell.innerText==""){
            mineCell.innerHTML="&#128163";
        }
    }
    for(let i=0; i<flagPos.length; i++){
        //console.log(minesPos);
        //console.log(flagPos);
        //console.log(minesPos.indexOf(flagPos[i]));
        if((minesPos.indexOf(flagPos[i])==-1)){
            document.getElementById(flagPos[i]).innerHTML="&#10060;";
        }
    }
}

function victory(){
    clearInterval(timerInterval);
}