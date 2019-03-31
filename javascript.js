///// CONSTANT /////
var DIMENSION = prompt("Entrez la taille du tableau de jeu que vous desirez : ");

///// NON GAME RELATED FUNCTIONS /////
function print2DArray(array){
  //imprime un tableau 2 dimension dans la console (pour debuggage)
  let str="";
  for(let i=0;i<array.length;++i){
    for(let j=0;j<array[i].length;++j){
      str += array[i][j]+" ";
    }
    str += "\n";
  }
  console.log(str);
  console.log("\n");
}

function initArray(dimension){
  //cree un tableau 2D de 0 
  let array = [];
  for(let i=0;i<dimension;++i){
    array.push([])
    for(let j=0;j<dimension;++j){
      array[i].push(0);
    }
  }
  return array;
}

function randomIntInRange(range){
  return Math.floor((Math.random() * range));
}

function indexesInArrayOfVal(array, val) {
  //trouve toutes les positions dans un tableau 1D d'une certaine valeur
  let indexesArray = [];
  for(let i = 0; i < array.length; i++){
      if (array[i] === val){
        indexesArray.push(i);
      }
  }
  return indexesArray;
}

function flatten2DArray(array){
  //ecrase un tableau 2D en un tableau 1D 
  let flatArray = [];
  for(var i=0;i<DIMENSION;++i){
    for(var j=0;j<DIMENSION;++j){
      flatArray.push(array[i][j]);
    }
  }
  return flatArray;
}

function unflatten2DArray(flatArray, dimension){
  //accepte un tableau 1D et fait un tableau 2D 
  let unflattenedArray = [];
  while (flatArray.length > 0){
    unflattenedArray.push(flatArray.splice(0, dimension));
  } 
  return unflattenedArray;
}

function array2DDirectionVariables(key,array){
  // Donne les fonctions et variables necessaires pour traverser un tableau dans uen direction donne 
  var valInitial, fonctionFin, fonctionIncrement, horizontal;
  if (key.keyCode == '37') { //leftArrow
    valInitial = 0;
    fonctionFin = function(i){return i<array.length;};
    fonctionIncrement = function(i){return ++i;};
    horizontal = true;
  }
  else if (key.keyCode == '38') { //upArrow
    valInitial = 0;
    fonctionFin = function(i){return i<array.length;};
    fonctionIncrement = function(i){return ++i;};
    horizontal = false;
  }
  else if (key.keyCode == '39') { //rightArrow
    valInitial = array.length-1;
    fonctionFin = function(i){return i>=0;};
    fonctionIncrement = function(i){return --i;};
    horizontal = true;
  }
  else if (key.keyCode == '40') { //downArrow
    valInitial = array.length-1;
    fonctionFin = function(i){return i>=0;};
    fonctionIncrement = function(i){return --i;};
    horizontal = false;
  }
  return [valInitial, fonctionFin, fonctionIncrement, horizontal];
}

function equalArrays(arr1,arr2){
  var same = true;

  for(var i=0;i<arr1.length;++i){
    for(var j=0;j<arr1[i].length;++j){
      if(arr1[i][j] != arr2[i][j]){
        same = false;
      }
    }
  }

  return same;
}

/////GAME RELATED FUNCTIONS /////

function array2DMergeCells(key,array){
  //fusionne les cases identiques dans la range ou la colonne dans la direction de la key
  var [valInitial, fonctionFin, fonctionIncrement, horizontal] = array2DDirectionVariables(key,array);
  for(var i=valInitial;fonctionFin(i);i=fonctionIncrement(i)){
    var currentInterestIndexI;
    var currentInterestIndexJ;
    var currentInterestExist = false;
    for(var j=valInitial;fonctionFin(j);j=fonctionIncrement(j)){
      if(horizontal){
        if(array[i][j]!=0){
          if(currentInterestExist&&(array[currentInterestIndexI][currentInterestIndexJ] == array[i][j])){
            array[currentInterestIndexI][currentInterestIndexJ] += array[i][j];
            array[i][j] = 0;
            currentInterestExist = false;
          }else{
            currentInterestIndexI = i;
            currentInterestIndexJ = j;
            currentInterestExist = true;
          }
        }
      }else{
        if(array[j][i]!=0){
          if(currentInterestExist&&(array[currentInterestIndexJ][currentInterestIndexI] == array[j][i])){
            array[currentInterestIndexJ][currentInterestIndexI] += array[j][i];
            array[j][i] = 0;
            currentInterestExist = false;
          }else{
            currentInterestIndexI = i;
            currentInterestIndexJ = j;
            currentInterestExist = true;
          }
        }
      }
    }
  }
  return array;
}

function array2DCompressCells(key, array){
  //compresse toutes les cases dans la direction de la key.
  var [valInitial, fonctionFin, fonctionIncrement, horizontal] = array2DDirectionVariables(key,array);
  for(var i=valInitial;fonctionFin(i);i=fonctionIncrement(i)){
    var currentInterestIndexI;
    var currentInterestIndexJ;
    var currentInterestExist = false;
    for(var j=valInitial;fonctionFin(j);j=fonctionIncrement(j)){  
      if(horizontal){
        if(currentInterestExist){
          if(array[i][j] != 0){
            array[currentInterestIndexI][currentInterestIndexJ] = array[i][j];
            array[i][j] = 0;
            currentInterestIndexJ = fonctionIncrement(currentInterestIndexJ);
          }
        }else{
          if(array[i][j] == 0){
            currentInterestIndexI = i;
            currentInterestIndexJ = j;
            currentInterestExist = true;
          }
        }
      }else{
        if(currentInterestExist){
          if(array[j][i] != 0){
            array[currentInterestIndexJ][currentInterestIndexI] = array[j][i];
            array[j][i] = 0;
            currentInterestIndexJ = fonctionIncrement(currentInterestIndexJ);
          }
        }else{
          if(array[j][i] == 0){
            currentInterestIndexI = i;
            currentInterestIndexJ = j;
            currentInterestExist = true;
          }
        }
      }
    }
  }
  return array;
}

function arrowKeyBehavior(key,array){
  //comportement attendu lorsque l'on presse une touche
  array = array2DMergeCells(key,array);
  array = array2DCompressCells(key,array);
  return array;
}

function displayHtml2DArray(array, id){
  //affiche le tableau de jeu dans le fichier et donne la bonne couleur aux cases
  var table = document.getElementById("tableauCases");
  table.innerHTML = "";
  for(let i=0;i<(array.length*2)-1;++i){
    var rangee = table.insertRow(i);
    if(i%2==1){
      for(let j=0;j<(array.length*2)-1;++j){
        var cell = rangee.insertCell(j);
        cell.className = "horizontalSpacer";
        if(j%2==1){
          cell.className = "doubleSpacer";
        }
      }
    }else{
      for(let j=0;j<(array.length*2)-1;++j){
        var cell = rangee.insertCell(j);
        if(j%2==1){
          cell.className = "verticalSpacer";
        }else{
          cell.className = "valueCell";
          if(array[i/2][j/2] != 0){
            cell.innerHTML = array[i/2][j/2];
          }
          cell.style.backgroundColor = colorSelection(array[i/2][j/2]);
        }
      }
    }
  }
}

function colorSelection(value){
  //switch statement donnant la couleur de la case selon la valeur qui y est contenu
  switch(value){
    case 0:
      return '#CAC1B1';
    case 2:
      return '#ECE5D7';
    case 4:
      return '#EAE3C1';   
    case 8:
      return '#EEB566';
    case 16:
      return '#F3944A';
    case 32:
      return '#F67448';  
    case 64:
      return '#F65000';
    case 128:
      return '#E5DB56';
    case 256:
      return '#F3F0D9';   
    case 512:
      return '#EDC850';
    case 1024:
      return '#EDC53F';
    case 2048:
      return '#EDC22E';        
  }
}

function createNewTile(){
  if(Math.random()<0.9){
    return 2;
  }else{
    return 4;
  }
}

function addNewTile(array){
  //ajoute une nouvelle tuile a un index qui contient un 0. ne fait rien si le tableau de jeu est plein
  let flatArray = flatten2DArray(array);
  let indexArray = indexesInArrayOfVal(flatArray,0);
  if(indexArray.length!=0){
    flatArray[indexArray[randomIntInRange(indexArray.length)]]=createNewTile();
    return unflatten2DArray(flatArray, DIMENSION);
  }else{
    return array;
  }
}

function existValidMove(array){
  //verifie s'il existe un mouvemen valide sur le jeu
  existValid = false;
  if(flatten2DArray(array).filter(function check0(value) {return value === 0;}).length!=0){
    existValid = true;
  }else{
    for(var i=0;i<DIMENSION;++i){
      for(var j=0;j<DIMENSION;++j){
        if(array[i-1] != undefined){
          if(array[i][j]==array[i-1][j]){
            existValid = true;
          }
        }
        if(array[i][j-1] != undefined){
          if(array[i][j]==array[i][j-1]){
            existValid = true;
          }
        }
        if(array[i+1] != undefined){
          if(array[i][j]==array[i+1][j]){
            existValid = true;
          }
        }
        if(array[i][j+1] != undefined){
          if(array[i][j]==array[i][j+1]){
            existValid = true;
          }
        }
      }
    }
  }
  return existValid;
}

///// DECLARATION SINGLETON GAME /////

var game = {
  nbrMouvements : 0,
  gameState : initArray(DIMENSION),
  updateGameState : function(key){
  if(key.keyCode=='37'||key.keyCode=='38'||key.keyCode=='39'||key.keyCode=='40'){// si une autre touche que les fleche est presse, rien n'arrive
    var oldGameState = this.gameState;
    this.gameState = arrowKeyBehavior(key,this.gameState);
    if(equalArrays(oldGameState,this.gameState)){//verifie qu'il y a eu un changement depuis le dernier mouvement
      this.gameState = addNewTile(this.gameState);
    }
    let won = flatten2DArray(this.gameState).filter(function check2048(value) {return value === 2048;}).length!=0;//victoire si le tableau contient une case 2048
    let lost = !existValidMove(this.gameState);//defaite si il ne contient pas de mouvement legal

    displayHtml2DArray(this.gameState, 'tableauCases');

    if(won){
      document.getElementById("etatJeu").innerHTML = "Victoire";
      document.getElementById("etatJeu").style.color = colorSelection(2048);
      document.getElementById("tableauCases").style.filter = "brightness(50%)";
    }else if(lost){
      document.getElementById("etatJeu").innerHTML = "Defaite";
      document.getElementById("etatJeu").style.color = colorSelection(64);
      document.getElementById("tableauCases").style.filter = "brightness(50%)";
    }
    if(!won && !lost && !equalArrays(oldGameState,this.gameState)){
      this.nbrMouvements += 1;
      document.getElementById("nbrMouvements").innerHTML = "Nombre de mouvements : "+game.nbrMouvements;
    }
  }}
};

///// DOCUMENT RELATED FUNCTIONS /////

function keyDown(k){
  //fonctions a executer lorsqu'une touche est presse
  game.updateGameState(k)
}

window.onload = function(){
  game.gameState = addNewTile(game.gameState);
  document.getElementById("etatJeu").innerHTML = "Partie En Cours";
  document.getElementById("etatJeu").style.color = colorSelection(16);
  displayHtml2DArray(game.gameState);

  document.onkeydown = keyDown;

  document.getElementById("nouvellePartieBoutton").addEventListener("click", function(){
    // reinitialisation du tableau de jeu lorsque l'on presse sur le boutton "Nouvelle Partie"
    game.gameState = initArray(DIMENSION);
    game.gameState = addNewTile(game.gameState);
    displayHtml2DArray(game.gameState);
    game.nbrMouvements=0;
    document.getElementById("tableauCases").style.filter = "brightness(100%)"
    document.getElementById("etatJeu").innerHTML = "Partie En Cours";
    document.getElementById("etatJeu").style.color = colorSelection(16);
    document.getElementById("nbrMouvements").innerHTML = "Nombre de mouvements :"+game.nbrMouvements;
  });
}