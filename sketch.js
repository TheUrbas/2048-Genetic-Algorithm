let board = [
    [2, 0, 4, 4], //The 2d array representing the board
    [4, 0, 0, 4], //Top left corner is (100,100)
    [8, 4, 8, 64], //Bottom right corner is (500,500)
    [8, 0, 0, 2]
]
let gameEnded = false; //Set a flag to check when the game ends
let button = new Button(); //Create the button
let algorithmStart = -1; //Set a falg to decide if the algorithm should run
let neuralNetwork = new Perceptron(16, 100, 100, 4) //Create a perceptron
let previousDirection; //Store the direction of the previous move
let repeatCount = 0; //Store the amount of times a move was repeated
let population = new Population(150); //Generate a population of controllers
let controllerCount = 0; //Keep track of which controller should be used
let score = 0; //Save a score
let generations = 1 //Keep track of how many generations there have been
let averageScore = 0 //Keep track of the average score of the previous generation
let highestScore = 0 //Keep track of the best score of the previous generation

function setup() {
    createCanvas(windowWidth, windowHeight);
    newGame();
}

function draw() {
    showBoard();
    if (gameEnded == false) {
        //console.log(controllerCount)
        if (controllerCount == population.population.length) { //If the controllerCount matches the size of the population
            controllerCount = 0; //Reset the controllerCount
            averageScore = population.avgScore(); //Get the average and the highest score
            highestScore = population.maxScore();
            console.log("Generation " + generations + " has finished.")
            generations++
            population.evolve()
        }
        if (algorithmStart == 1) {
            algorithmPlay()
        }
        background(179, 242, 255);
        strokeWeight(10);
        stroke(70, 130, 180);
        for (let i = 2; i < 5; i++) { //Drawing the vertical lines
            line(i * 100, 100, i * 100, 500)
        }
        for (let i = 2; i < 5; i++) { //Drawing the horizontal lines    
            line(100, i * 100, 500, i * 100)
        }
        let y = 165;
        showBoard() //Show the board
        button.show();
        let full = true;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    full = false; //Loop through the board and check if there are empty spots
                    break; //If there are, set full to false and leave the loop
                }
            }
        }
        if (full == true) {
            checkLoss(); //Check if the game has ended

        }
    }
    else {
        population.population[controllerCount].score = score; //Save the score as the score for the controller
        console.log("Previous iteration score: " + score)
        console.log("Controller score: " + population.population[controllerCount].score)
        controllerCount++; //Increment the controllerCount
        newGame(); //Start a new game
        console.log("GAME OVER");
    }
}

function keyPressed() {
    operate(keyCode); //Make a move, in the direction of the key pressed.
}

function showBoard() {
    let y = 165;
    for (let i = 0; i < 4; i++) { //Loop through the board array     
        let x = 150;
        for (let j = 0; j < 4; j++) {
            fill(0);
            noStroke();
            textSize(40);
            textAlign(CENTER);
            if (board[i][j] != 0) { //Only do this if the thing at that spot on the array isn't a 0
                text(board[i][j], x, y) //Print out the stuff in that spot on the array 
            }
            x += 100;
        }
        y += 100;
    }
    textAlign(LEFT);
    text("Score: " + score, 550, 120) // Display the score
    textSize(32);
    text("Current Generation: " + generations, 550, 150)
    text("Highest Score: " + highestScore, 550, 182)
    text("Average Score: " + averageScore, 550, 214)
}

function placeBlock() {
    let newNumber //Select whether the new number will be 4 or 2
    if (random(0, 10) <= 1) {
        newNumber = 4;
    }
    else {
        newNumber = 2;
    }
    let spots = [];
    for (let i = 0; i < 4; i++) { //Loop through the board array and push all spots with 0
        for (let j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                spots.push({ x: i, y: j });
            }
        }
    }
    if (spots.length == 0) { //Validate if there's a spot on the board.
        console.log("Can't place anymore.");
    }
    else {
        let chosenSpot = random(spots);
        board[chosenSpot.x][chosenSpot.y] = newNumber;
    }
}

function slide(b, direction) {
    if (direction == LEFT_ARROW) { //Check which key was pressed
        for (let i = 0; i < 4; i++) { //Loop through the row
            let newArray = b[i].filter(function(val) {
                return val != 0; //Take out the zeroes from the array
            })
            let zeroes = 4 - newArray.length; //Check how many zeroes have been taken out
            for (let j = 0; j < zeroes; j++) {
                newArray.push(0); //Add the zeroes back in to the end of the array
            }
            b[i] = newArray; //Set the row to be in the moved state
        }
    }
    else if (direction == RIGHT_ARROW) { //Check which key was pressed
        for (let i = 0; i < 4; i++) { //Loop through the row
            let newArray = b[i].filter(function(val) {
                return val != 0; //Take out the zeroes from the array
            })
            let zeroes = 4 - newArray.length; //Check how many zeroes have been taken out
            for (let j = 0; j < zeroes; j++) {
                newArray.unshift(0); //Add the zeroes back in to the start of the array
            }
            b[i] = newArray; //Set the row to be in the moved state
        }
    }
    else if (direction == UP_ARROW) { //Check which key was pressed
        for (let j = 0; j < 4; j++) { //Loop through the columns
            let newArray = []; //Create a new array for the column
            for (let i = 0; i < 4; i++) {
                newArray.push(b[i][j]); //Put the column into the new array
            }

            newArray = newArray.filter(function(val) {
                return val != 0; //Take out the zeroes
            })
            let zeroes = 4 - newArray.length; //Check how many zeroes have been taken out
            for (let k = 0; k < zeroes; k++) {
                newArray.push(0); //Put the zeroes back in at the end of the array
            }
            for (let i = 0; i < 4; i++) {
                b[i][j] = newArray[i]; //Set the moved array to be the column in the board array
            }
        }
    }
    else if (direction == DOWN_ARROW) { //Check which key was pressed
        for (let j = 0; j < 4; j++) { //Loop through the columns
            let newArray = []; //Create a new array for the column
            for (let i = 0; i < 4; i++) {
                newArray.push(b[i][j]); //Put the column into the new array
            }
            newArray = newArray.filter(function(val) {
                return val != 0; //Take out the zeroes
            })
            let zeroes = 4 - newArray.length; //Check how many zeroes have been taken out
            for (let j = 0; j < zeroes; j++) {
                newArray.unshift(0); //Put the zeroes back in at the start of the array
            }

            for (let i = 0; i < 4; i++) {
                b[i][j] = newArray[i]; //Set the moved array to be the column in the board array
            }
        }
    }
}

function combine(b, direction) {

    if (direction == LEFT_ARROW) { //Check which key was pressed
        for (let i = 0; i < 4; i++) { //Loop through the rows
            for (let j = 0; j < 3; j++) { //Loop through the array, but only to the second to last spot, to avoid an out of bounds error
                if (b[i][j] == b[i][j + 1]) { //If 2 adjacent blocks are the same
                    b[i][j] = b[i][j] * 2; //Then double the first one's value
                    score += b[i][j]; //Add the value of the new block to the score
                    b[i][j + 1] = 0; //And set the next one to be 0
                }
            }
        }
    }
    else if (direction == RIGHT_ARROW) { //Check which key was pressed
        for (let i = 0; i < 4; i++) { //Loop through the rows
            for (let j = 3; j > 0; j--) { //Loop through the array, but only to the second to last spot, to avoid an out of bounds error
                if (b[i][j] == b[i][j - 1]) { //If 2 adjacent blocks are the same
                    b[i][j] = b[i][j] * 2; //Then double the first one's value
                    score += b[i][j]; //Add the value of the new block to the score
                    b[i][j - 1] = 0; //And set the next one to be 0
                }
            }
        }
    }
    else if (direction == UP_ARROW) { //Check which key was pressed
        for (let j = 0; j < 4; j++) { //Loop through the columns
            let newArray = []; //Create a new array for the column
            for (let i = 0; i < 4; i++) {
                newArray.push(b[i][j]); //Put the column into the new array
            }
            for (let i = 0; i < 3; i++) { //Loop through the array, but only to the second to last spot, to avoid an out of bounds error
                if (newArray[i] == newArray[i + 1]) { //If 2 adjacent blocks are the same
                    newArray[i] = newArray[i] * 2; //Then double the first one's value
                    score += newArray[i]; //Add the value of the new block to the score
                    newArray[i + 1] = 0; //And set the next one to be 0
                }
            }
            for (let i = 0; i < 4; i++) {
                b[i][j] = newArray[i]; //Set the moved array to be the column in the board array
            }
        }
    }
    else if (direction == DOWN_ARROW) { //Check which key was pressed
        for (let j = 0; j < 4; j++) { //Loop through the columns
            let newArray = []; //Create a new array for the column
            for (let i = 0; i < 4; i++) {
                newArray.push(b[i][j]); //Put the column into the new array
            }
            for (let i = 4; i > 0; i--) { //Loop through the array, but only to the second to last spot, to avoid an out of bounds error
                if (newArray[i] == newArray[i - 1]) { //If 2 adjacent blocks are the same
                    newArray[i] = newArray[i] * 2; //Then double the first one's value
                    score += newArray[i]; //Add the value of the new block to the score
                    newArray[i - 1] = 0; //And set the next one to be 0
                }
            }
            for (let i = 0; i < 4; i++) {
                b[i][j] = newArray[i]; //Set the moved array to be the column in the board array
            }
        }
    }
}

function newGame() {
    board = [ //Reset the board
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    placeBlock(); //Randomly place two starting blocks
    placeBlock();
    gameEnded = false; //Set the gameEnded flag to false
    score = 0; // Reset the score
}


function createCopy(original) {
    let copy = [ //Create an empty array matching the board
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            copy[i][j] = original[i][j]; //For each spot, replace it with the corresponding value from the original
        }
    }
    return copy;
}

function checkLoss() {
    let copy1 = createCopy(board); //Create a copy of the board to operate on
    let copy2 = createCopy(copy1); //Create a copy of th copy to check if it changes
    //console.log("start")
    //console.table(copy)
    slide(copy1, LEFT_ARROW);
    combine(copy1, LEFT_ARROW);
    slide(copy1, LEFT_ARROW);
    //console.log("after left")
    //console.table(copy)
    slide(copy1, RIGHT_ARROW);
    combine(copy1, RIGHT_ARROW);
    slide(copy1, RIGHT_ARROW);
    //console.log("after right")
    //console.table(copy)
    slide(copy1, UP_ARROW);
    combine(copy1, UP_ARROW);
    slide(copy1, UP_ARROW);
    //console.log("after up")
    //console.table(copy)
    slide(copy1, DOWN_ARROW);
    combine(copy1, DOWN_ARROW);
    slide(copy1, DOWN_ARROW);
    //console.log("after down")
    //console.table(copy)
    let different = false;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (copy1[i][j] != copy2[i][j]) {
                different = true; //Loop through the new board and compare it to the copy of the old one
            }
        }
    }
    if (different == false) {
        gameEnded = true; //Set a flag to say the game has ended
    }

}

function mousePressed() {
    if (button.buttonPressed()) {
        algorithmStart = algorithmStart * -1;
    };
    //CODE FOR TESTING THE MOVE
    /*let dir = decideDirection(); //Get a random direction
    if (dir == LEFT_ARROW) { //Show me where the direction goes
        console.log("left")
    }
    else if (dir == RIGHT_ARROW) {
        console.log("right");
    }
    else if (dir == UP_ARROW) {
        console.log("up");
    }
    else if (dir == DOWN_ARROW) {
        console.log("down");
    }*/

}

function operate(direction) {
    if (repeatCount > 10) {
        gameEnded = true; //If the same move has been made more than 10 times, end the game
        repeatCount = 0;
    }
    if (gameEnded == false) { //Only do this if the game is to continue
        if (previousDirection == direction) {
            repeatCount += 1; //If the current move is the same as the next move, increment the repeatCount
        }
        else {
            repeatCount = 0; //If the move goes in a different direction, reset the repeatCount   
        }
        let oldArray = createCopy(board); //Create a copy of the previous state of the board.
        slide(board, direction);
        combine(board, direction);
        slide(board, direction);
        let different = false;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] != oldArray[i][j]) {
                    different = true; //Loop through the new board and compare it to the copy of the old one
                }
            }
        }
        if (different == true) {
            placeBlock(); //If the state of the board changed, place a new block.
        }
        previousDirection = direction;
    }


}


////////////
//AI STUFF//
////////////
function decideDirection() {
    let r = Math.floor(random(4)); //Pick a random number between 0 and 3.
    if (r == 0) { //Choose a direction based on the value of the random number.
        return RIGHT_ARROW;
    }
    else if (r == 1) {
        return LEFT_ARROW;
    }
    else if (r == 2) {
        return UP_ARROW;
    }
    else if (r == 3) {
        return DOWN_ARROW;
    }
}

function algorithmPlay() {
    let cont = population.retrieve(controllerCount); //Retirve the controller
    operate(neuralNetwork.feedfoward(board, cont[0], cont[1], cont[2])); // PLay the game as the controller
}
