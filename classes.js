class Button {
    constructor() {}

    mouseOver(x, y) {
        if (x > 100 && x < 300 && y > 550 && y < 600) { //Check if the mouse is within the bounds of the button
            return true;
        }
        else {
            return false;
        }
    }

    show() {
        stroke(0) //Create a border around the button, for aethetic reasons.
        strokeWeight(3)
        if (this.mouseOver(mouseX, mouseY)) {
            fill(150, 200, 230);
        }
        else {
            fill(150, 200)
        }
        rect(100, 550, 200, 50); //Draw a rectangle (this will be the button), at a specific location.
        fill(0);
        noStroke();
        textSize(20);
        textAlign(CENTER);
        text("START ALGORITHM", 200, 582);
    }

    buttonPressed() {
        if (this.mouseOver(mouseX, mouseY)) { //Check if the mouse is within the bounds of the button
            return true;
        }
        else {
            return false;
        }
    }

}

class Perceptron {
    constructor(input, hidden1, hidden2, output) {
        //Creating the matrices that will store the values in the neurons
        this.inputMatrix = math.zeros(input, 1)
        this.hidden1Matrix = math.zeros(hidden1, 1)
        this.hidden2Matrix = math.zeros(hidden2, 1)
        this.outputMatrix = math.zeros(output, 1)
        //Creating the matrices that will contain the weights
        this.weightsInputHidden1 = math.zeros(hidden1, input)
        this.weightsHidden1Hidden2 = math.zeros(hidden2, hidden1)
        this.weightsHidden2Output = math.zeros(output, hidden2)
        //This is code for filling the weight matrices. It has been commented out as it has been replaceed by the controller class.
        /*//Filling the weights matrices with random values between 0 and 1
        this.weightsInputHidden1.forEach(function(value, index, matrix) { //Loop through the matrix
            matrix.subset(math.index(index[0], index[1]), Math.random() * (1 - -1) + -1) //Make each value a random number between -1 and 1
        })
        this.weightsHidden1Hidden2.forEach(function(value, index, matrix) { //Loop through the matrix
            matrix.subset(math.index(index[0], index[1]), Math.random() * (1 - -1) + -1) //Make each value a random number between -1 and 1
        })
        this.weightsHidden2Output.forEach(function(value, index, matrix) { //Loop through the matrix
            matrix.subset(math.index(index[0], index[1]), Math.random() * (1 - -1) + -1) //Make each value a random number between -1 and 1
        })*/
    }

    feedfoward(input, weightsInputHidden1, weightsHidden1Hidden2, weightsHidden2Output) {
        input = [...input[0], ...input[1], ...input[2], ...input[3]] //Make the board 1 dimensional
        this.inputMatrix.forEach(function(value, index, matrix) {
            matrix.subset(math.index(index[0], index[1]), input[index[0]]); //Replace the values in the input matrix with those from the board
        })
        //Getting the weights matrices from the controller
        this.weightsInputHidden1 = weightsInputHidden1;
        this.weightsHidden1Hidden2 = weightsHidden1Hidden2;
        this.weightsHidden2Output = weightsHidden2Output;
        //Input ---> Hidden1
        this.hidden1Matrix = math.multiply(this.weightsInputHidden1, this.inputMatrix); //Set the hidden matrix to be the multiplication of the weights matrix and the input matrix
        this.hidden1Matrix.forEach(function(value, index, matrix) {
            let activated = 1 / (1 + (math.exp(-1 * matrix.subset(math.index(index[0], index[1]))))) //Check what the activated value should be
            matrix.subset(math.index(index[0], index[1]), activated) //Replace the values in the matrix with their activated values
        })
        //Hidden1 --> Hidden2
        this.hidden2Matrix = math.multiply(this.weightsHidden1Hidden2, this.hidden1Matrix); //Set the hidden matrix to be the multiplication of the weights matrix and the input matrix
        this.hidden2Matrix.forEach(function(value, index, matrix) {
            let activated = 1 / (1 + (math.exp(-1 * matrix.subset(math.index(index[0], index[1]))))) //Check what the activated value should be
            matrix.subset(math.index(index[0], index[1]), activated) //Replace the values in the matrix with their activated values
        })
        //Hidden2 ---> Output
        this.outputMatrix = math.multiply(this.weightsHidden2Output, this.hidden2Matrix); //Set the output matrix to be the multiplication of the weights matrix and the hidden matrix
        this.outputMatrix.forEach(function(value, index, matrix) {
            let activated = 1 / (1 + (math.exp(-1 * matrix.subset(math.index(index[0], index[1]))))) //Check what the activated value should be
            matrix.subset(math.index(index[0], index[1]), activated) //Replace the values in the matrix with their activated values
        })
        let biggest = 0 //Set the biggest number as the first number
        this.outputMatrix.forEach(function(value, index, matrix) { //Loop through the output matrix
            let big = matrix.subset(math.index(biggest, index[1])) //Set the biggest number using the current biggest value
            let current = matrix.subset(math.index(index[0], index[1])) //Set the number currently being checked as the index of the one being seen
            if (current > big) {
                biggest = index[0]; //If the current is bigger than the most recent biggest, make the biggest this new value
            }
        })
        //Pick a direction based on which value of the output matrix is the biggest
        if (biggest == 0) {
            return LEFT_ARROW;
        }
        else if (biggest == 1) {
            return RIGHT_ARROW;
        }
        else if (biggest == 2) {
            return UP_ARROW
        }
        else {
            return DOWN_ARROW
        }
    }

}

class Controller {
    constructor(input, hidden1, hidden2, output) {
        //Creating the matrices that will contain the weights
        this.weightsInputHidden1 = math.zeros(hidden1, input)
        this.weightsHidden1Hidden2 = math.zeros(hidden2, hidden1)
        this.weightsHidden2Output = math.zeros(output, hidden2)
        //Filling the weights matrices with random values between 0 and 1
        this.weightsInputHidden1.forEach(function(value, index, matrix) { //Loop through the matrix
            matrix.subset(math.index(index[0], index[1]), Math.random() * (1 - -1) + -1) //Make each value a random number between -1 and 1
        })
        this.weightsHidden1Hidden2.forEach(function(value, index, matrix) { //Loop through the matrix
            matrix.subset(math.index(index[0], index[1]), Math.random() * (1 - -1) + -1) //Make each value a random number between -1 and 1
        })
        this.weightsHidden2Output.forEach(function(value, index, matrix) { //Loop through the matrix
            matrix.subset(math.index(index[0], index[1]), Math.random() * (1 - -1) + -1) //Make each value a random number between -1 and 1
        })
        this.score = 0;
    }
    showMatrices() {
        console.log(this.weightsInputHidden1);
        console.log(this.weightsHidden1Hidden2);
        console.log(this.weightsHidden2Output);
    }
}

class Population {
    constructor(size) {
        this.population = [] //Create an array to store the controllers in
        for (let i = 0; i < size; i++) { //Loop through the array and create a number of new controllers equal to the size
            this.population.push(new Controller(16, 100, 100, 4)) //Fill the array with controllers
        }
    }

    showPopulation() {
        console.log(this.population)
    }

    retrieve(pos) {
        return [this.population[pos].weightsInputHidden1, this.population[pos].weightsHidden1Hidden2, this.population[pos].weightsHidden2Output] //Retrieve the weights matrices at the given position
    }

    normalise() {
        let scores = [] //Create an array for the scores
        for (let i = 0; i < this.population.length; i++) {
            scores.push(this.population[i].score); //Push in the scores into the scores array
        }
        let max = Math.max(...scores) //Pick the largest score
        let min = Math.min(...scores) //Pick the smallest score
        for (let i = 0; i < this.population.length; i++) {
            this.population[i].score = (this.population[i].score - min) / (max - min); //Normalise the values
            //console.log(this.population[i].score);
        }
    }

    fitness() {
        this.normalise()
        for (let i = 0; i < this.population.length; i++) {
            this.population[i].score = (Math.pow(15, this.population[i].score)) - 0.99; //Apply the fitness function to each score
            //console.log(this.population[i].score);
        }
    }

    avgScore() {
        let average = 0;
        for (let i = 0; i < this.population.length; i++) {
            average += this.population[i].score; //Add the scores to an average variable
        }
        average = Math.floor(average / this.population.length) //Divide average by the total to get the mean and floor it
        return average //Return te mean score
    }

    maxScore() {
        let scores = [] //Create an array for the scores
        for (let i = 0; i < this.population.length; i++) {
            scores.push(this.population[i].score); //Push in the scores into the scores array
        }
        return Math.max(...scores) //Return the largest score
    }

    evolve() {
        this.fitness();
        let newPopulation = [] //Create an array to store the new population
        for (let i = 0; i < this.population.length; i++) {
            newPopulation.push(this.crossover()) //Create a new controller using the crossover method
        }
        console.log(newPopulation)
        this.population = newPopulation //Replace the old population with the new one
    }

    crossover() {
        let parentA = this.chooseParent(); //Use the chooseParent method to get a parentA and a parentB
        let parentB = this.chooseParent();
        let child = new Controller(16, 100, 100, 4); //Create a child controller
        //Filling the InputHidden1 matrix
        child.weightsInputHidden1.forEach(function(value, index, matrix) { //Loop through the matrix
            let r = Math.random() //Randomly pick from which parent to take the value
            if ((r - 0.5) <= 0) { //Pick parent A's genes
                matrix.subset(math.index(index[0], index[1]), parentA.weightsInputHidden1.subset(math.index(index[0], index[1]))) //Replace the value in the child matrix with the value from parent A's matrix 
            }
            else {
                matrix.subset(math.index(index[0], index[1]), parentB.weightsInputHidden1.subset(math.index(index[0], index[1]))) //Replace the value in the child matrix with the value from parent B's matrix 
            }
            let rand = Math.random(); //Get a random number between 0 and 1
            if (rand < 0.01) { //If the random chance is met
                matrix.subset(math.index(index[0], index[1]), Math.random() * (1 - -1) + -1) //Replace the value with a random number between -1 and 1
            }
        })

        //Filling the Hidden1Hidden2 matrix
        child.weightsHidden1Hidden2.forEach(function(value, index, matrix) { //Loop through the matrix
            let r = Math.random() //Randomly pick from which parent to take the value
            if ((r - 0.5) <= 0) { //Pick parent A's genes
                matrix.subset(math.index(index[0], index[1]), parentA.weightsHidden1Hidden2.subset(math.index(index[0], index[1]))) //Replace the value in the child matrix with the value from parent A's matrix 
            }
            else {
                matrix.subset(math.index(index[0], index[1]), parentB.weightsHidden1Hidden2.subset(math.index(index[0], index[1]))) //Replace the value in the child matrix with the value from parent B's matrix 
            }
            let rand = Math.random(); //Get a random number between 0 and 1
            if (rand < 0.01) { //If the random chance is met
                matrix.subset(math.index(index[0], index[1]), Math.random() * (1 - -1) + -1) //Replace the value with a random number between -1 and 1
            }
        })
        //Filling the Hidden2Output matrix
        child.weightsHidden2Output.forEach(function(value, index, matrix) { //Loop through the matrix
            let r = Math.random() //Randomly pick from which parent to take the value
            if ((r - 0.5) <= 0) { //Pick parent A's genes
                matrix.subset(math.index(index[0], index[1]), parentA.weightsHidden2Output.subset(math.index(index[0], index[1]))) //Replace the value in the child matrix with the value from parent A's matrix 
            }
            else {
                matrix.subset(math.index(index[0], index[1]), parentB.weightsHidden2Output.subset(math.index(index[0], index[1]))) //Replace the value in the child matrix with the value from parent B's matrix 
            }
            let rand = Math.random(); //Get a random number between 0 and 1
            if (rand < 0.01) { //If the random chance is met
                matrix.subset(math.index(index[0], index[1]), Math.random() * (1 - -1) + -1) //Replace the value with a random number between -1 and 1
            }
        })
        return child; //Return the child
    }

    chooseParent() {
        while (true) { //Repeat this process until a suitable candidate is found
            let r = Math.floor(Math.random() * (this.population.length - 1))
            let candidate = this.population[r] //Pick a random controller from the population
            let random = Math.random() * 14.01 //Pick a random number between 0 and the max fitnees (14.01)
            if (random < candidate.score) { //If random is less than the fitness of the candidate, then return the candidate
                return candidate //This will force the program out of the while loop
            }
        }
    }

    mutate(matrix, index) {
        let r = Math.random(); //Get a random number between 0 and 1
        if (r < 1) { //If the random chance is met
            matrix.subset(math.index(index[0], index[1]), Math.random() * (1 - -1) + -1) //Replace the value with a random number between -1 and 1
        }
    }
}
