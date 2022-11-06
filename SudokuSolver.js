var boardNums;
var boardFields;
var possibleNumbers;
var changes = [];

console.log("lol")

//Entfernt mögliche Nummern aufgrund der Reihen.
function removeRowsFromPN(){
    for(let i = 0; i < 9; i++){
        var row = boardNums[i];
        for(let j = 0; j < 9; j++){
            possibleNumbers[i][j] = removeFromArray(i,j,row);
        }
    }
}

//Kopiert ein gegebenes Array
function copyArray(arr){
    let new_arr = new Array(arr.length);
    for(let i = 0; i < arr.length; i++){
        new_arr[i] = arr[i];
    }
    return new_arr;
}

//Entfernt mögliche Nummern aufgrund der Spalten.
function removeColumnsFromPN(){
    for(let i = 0; i < 9; i++){
        var col = new Array(9);
        for(let j = 0; j < 9; j++){
            col[j] = boardNums[j][i];
        }
        for(let j = 0; j < 9; j++){
            possibleNumbers[j][i] = removeFromArray(j,i,col);
        }
    }
}

//Entfernt mögliche Nummern aufgrund der Box.
function removeBoxesFromPN(){
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            var box = new Array(9);
            for(let k = 0; k < 3; k++){
                for(let l = 0; l < 3; l++){
                    let field = (k+3*i)*9+(l+3*j);
                    let field_y = parseInt(field/9);
                    let field_x = field % 9;
                    box[k*3+l] = boardNums[field_y][field_x];
                }
            }
            for(let k = 0; k < 3; k++){
                for(let l = 0; l < 3; l++){
                    let field = (k+3*i)*9+(l+3*j);
                    let field_y = parseInt(field/9);
                    let field_x = field % 9;
                    possibleNumbers[field_y][field_x] = removeFromArray(field_y,field_x,box);
                }
            }
        }
    }
}

//Resettet alle möglichen Nummern, belegte Felder haben dabei ein Leeres Array.
function resetPossibleNumbers() {
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            if(boardNums[i][j] == 0){
                for(let k = 0; k < 9; k++) {
                    possibleNumbers[i][j][k] = k+1;
                }
            }
            else possibleNumbers[i][j] = [];
        }
    }
}

//Sortiere die möglichen Zahlen anhand aller vorhandenen Filter aus
function sortPossibleNumbersOut(){
    if($('#checkRows').is(":checked")) removeRowsFromPN();
    if($('#checkColums').is(":checked")) removeColumnsFromPN();
    if($('#checkBoxes').is(":checked"))removeBoxesFromPN();
}

//Platzier eine mögliche Nummer, wenn diese die letzte mögliche eines Feldes ist.
function placeLastPN(){
    for(let i=0; i < 9; i++){
        for(let j=0; j < 9; j++){
            if(boardNums[i][j] == 0 && possibleNumbers[i][j].length == 1){
                boardNums[i][j] = possibleNumbers[i][j][0];
                boardFields[i][j].value = possibleNumbers[i][j][0];
            }
        }
    }
}

//Platziert eine mögliche Zahl wenn diese, die letzte aus der Reihe ist.
function placeLastPNinRow(){
    for(let i=0; i < 9; i++){
        let occurs = new Array(9);
        for(let j=0; j < 9; j++){occurs[j] = 0}
        for(let j=0; j < 9; j++){
            for(let k=0; k < possibleNumbers[i][j].length; k++){
                occurs[possibleNumbers[i][j][k]-1] += 1;
            }
        }
        for(let j=0; j < 9; j++){
            if(occurs[j] == 1){
                for(let k = 0; k < 9; k++){
                    if(possibleNumbers[i][k].includes(j+1)){
                        boardNums[i][k] = j+1;
                        boardFields[i][k].value = j+1;
                    }
                }
            }
        }
    }
}

function placeLastPNinColumn(){
    for(let i = 0; i < 9; i++){
        let occurs = new Array(9);
        for(let j=0; j < 9; j++){occurs[j] = 0}
        for(let j=0; j < 9; j++){
            for(let k=0; k < possibleNumbers[j][i].length; k++){
                occurs[possibleNumbers[j][i][k]-1] += 1;
            }
        }
        for(let j=0; j < 9; j++){
            if(occurs[j] == 1){
                for(let k = 0; k < 9; k++){
                    if(possibleNumbers[k][i].includes(j+1)){
                        boardNums[k][i] = j+1;
                        boardFields[k][i].value = j+1;
                    }
                }
            }
        }
    }
}

function placeLastPNinBox(){
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            var occurs = new Array(9);
            for(let j=0; j < 9; j++){occurs[j] = 0}
            for(let k = 0; k < 3; k++){
                for(let l = 0; l < 3; l++){
                    let field = (k+3*i)*9+(l+3*j);
                    let field_y = parseInt(field/9);
                    let field_x = field % 9;
                    for(let k=0; k < possibleNumbers[field_y][field_x].length; k++){
                        occurs[possibleNumbers[field_y][field_x][k]-1] += 1;
                    }
                }
            }
            for(let c = 0; c < 9; c++) {
                if(occurs[c] == 1){
                    for(let k = 0; k < 3; k++){
                        for(let l = 0; l < 3; l++){
                            let field = (k+3*i)*9+(l+3*j);
                            let field_y = parseInt(field/9);
                            let field_x = field % 9;
                            if(possibleNumbers[field_y][field_x].includes(c+1)){
                                boardNums[field_y][field_x] = c+1;
                                boardFields[field_y][field_x].value = c+1;
                            }
                        }
                    }
                }
            }
        }
    }
}

//Platziere alle mögliche Zahlen anhand aller vorhandenen Platzierfilter
function placePossibleNumbers(){
    if($('#placeLastSol').is(":checked")) placeLastPN();
    if($('#placeLastSolInRow').is(":checked")) placeLastPNinRow();
    if($('#placeLastSolInColumn').is(":checked")) placeLastPNinColumn();
    if($('#placeLastSolInBox').is(":checked")) placeLastPNinBox();
}

//Berechnet die noch möglichen Ausgänge des Spielfeldes aufgrund der PossibleNumbers
function getPossibleOutcomes(){
    var outcomes = 1;
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++){
            if (boardNums[i][j] == 0){
                outcomes *= possibleNumbers[i][j].length;
            }
        }
    }
    return outcomes;
}

//Aktuallisiert den Text der möglichen Outcomes
function refreshOutcomeText(){
    resetPossibleNumbers();
    sortPossibleNumbersOut();
    $('#possibleOutcomesText').text(getPossibleOutcomes());
}

//Liest das Board aus
function getNewBoard(){
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++){
            if(boardFields[i][j].value == "") boardNums[i][j] = 0;
            else boardNums[i][j] = parseInt(boardFields[i][j].value);
        }
    }
}

//Entfernt alle Zahlen aus den möglichen Zahlen an der Boardstelle i,j die mit dem anderen Array übereinstimmen.,
function removeFromArray(i,j,removeArray){
    return possibleNumbers[i][j].filter(function(value,index,arr){
        return !removeArray.includes(value);
    });
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

//Löst das Sudoku mithilfe von Brute force
function recursiveSolve(){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if (boardNums[i][j] == 0){
                resetPossibleNumbers();
                sortPossibleNumbersOut();
                let PNthisField = copyArray(possibleNumbers[i][j]);
                for(let k = 0; k < PNthisField.length; k++){
                    boardNums[i][j] = PNthisField[k];
                    changes.push([i,j,PNthisField[k]])
                    if (recursiveSolve()){
                        return true;
                    }
                    else{
                        boardNums[i][j] = 0;
                        changes.push([i,j,0]);
                    }
                }
                return false;
            }
        }
    }
    return true;
}

//Visualisiert das rekusrive Lösen
function vizualizeRecurs(){
    if(changes.length == 0) return;
    console.log("Change: " + changes[0][0] + "," + changes[0][1] + " : " + changes[0][2] + " | " + changes.length);
    boardFields[changes[0][0]][changes[0][1]].value = changes[0][2] == 0 ? "" : String(changes[0][2]);
    changes.shift();
    setTimeout(vizualizeRecurs, 10);
}

//Löst das Sudoku
function solve(){
    resetPossibleNumbers();
    sortPossibleNumbersOut();
    placePossibleNumbers();
    refreshOutcomeText();

    recursiveSolve();
    console.log("Der Rekursive Aufruf hat " + changes.length + " Einträge gespeichert!");
    vizualizeRecurs();
}

//Resettet das Board
function resetBoard(){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            boardNums[i][j] = 0;
            boardFields[i][j].value = "";
        }
    }
}

//Initialisiert das Board beim Laden der Webseite.
function createBoard() {
    var sudokuBoard = $('.SudokuBoard');

    var boxes = new Array(9);
    for(let i = 0; i < 9; i++) {
        let box = document.createElement('div');
        box.className = 'Board_Box_' + i.toString();
        boxes[i] = box;
        sudokuBoard.append(box);
    }

    boardNums = new Array(9);
    boardFields = new Array(9);
    possibleNumbers = new Array(9);
    for(let i = 0; i < 9; i++){
        boardNums[i] = new Array(9);
        boardFields[i] = new Array(9);
        possibleNumbers[i] = new Array(9);
        for(let j = 0; j < 9; j++){

            let box_col = (j % 9) >= 0 && (j % 9) <= 2 ? 0 : ((j % 9) >= 3 && (j % 9) <= 5 ? 1 : 2)
            let box_row = parseInt(i/3);
            let box2d = (box_row*3+box_col);

            let field = document.createElement('input');
            field.className = "Sudoku_Field"
            field.id = "Sudoku_Field_" + (i*9+j).toString();
            field.type = 'text';
            field.innerHTML = (i*9+j).toString();
            field.tabIndex =  (i*9+j)+1;
            field.onkeypress = sudokuInputFieldCheck;
            field.addEventListener('input', fieldInputChange);
            boxes[box2d].append(field)

            boardNums[i][j] = 0;
            boardFields[i][j] = field;
            possibleNumbers[i][j] = new Array(9);

            for(let x = 1; x < 10; x++){
                possibleNumbers[i][j][x-1] = x;
            }
        }
    }
    refreshOutcomeText();
}

//Überprüft ob die Eingabe in ein Feld eine valide Zahl ist UND ob die Eingabeläge nicht über 1 geht.
function sudokuInputFieldCheck(evt) {
    if (evt.path[0].value.length >= 1) {
        evt.path[0].value = evt.key;
        return false;
    }
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
    return true;
}

//CheckboxUpdate
function checkBoxUpdate(){
    getNewBoard();
    resetPossibleNumbers();
    sortPossibleNumbersOut();
    refreshOutcomeText();
}

//Löse mich Button Klick-Event
$("#solveButton").click(function(){
    solve();
});

//KeyboardPressEvent
document.onkeydown = function(event){
    var keycode = parseInt((event.keyCode ? event.keyCode : event.which));
    if(keycode >= 37 && keycode <= 40){
        let currentElement = document.activeElement;
        let id = currentElement.tabIndex-1;
        if(keycode == 37)$("#Sudoku_Field_" + (Math.max(0,id-1))).focus(); //Links
        if(keycode == 39)$("#Sudoku_Field_" + (Math.min(80,id+1))).focus(); //Rechts
        if(keycode == 38)$("#Sudoku_Field_" + (Math.max(0,id-9))).focus(); //Oben
        if(keycode == 40)$("#Sudoku_Field_" + (Math.min(80,id+9))).focus(); //Unten

    }
};

//Field Input Change Event Handler
const fieldInputChange = function(e){
    getNewBoard();
    resetPossibleNumbers();
    sortPossibleNumbersOut();
    refreshOutcomeText();
}

//Sudoku Eingabe Feld Event Handler
$("#SudokuInput").on("input",function(){
    resetBoard();
    let text = (this).value;
    if(!$.isNumeric(text)) return;
    for(let i = 0; i < Math.min(81,text.length); i++){
        let y = parseInt(i/9);
        let x = i % 9;
        if(text.charAt(i) == '0'){
            boardNums[y][x] = text.charAt(i);
        }
        else{
            boardNums[y][x] = text.charAt(i);
            boardFields[y][x].value = text.charAt(i);
        }
    }
    checkBoxUpdate();
});

function test(){
}

//Aufruf der initiliasierenen Methode
createBoard();
test();
