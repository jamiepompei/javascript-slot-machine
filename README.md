# javascript-slot-machine

This project is a command-line slot machine game built with JavaScript. The program accepts user input for a deposit amount for the game, the number of lines the user would like to bet on, and the bet per line the user would like to place. The program will validate the user input to ensure that only valid inputs are entered. Once these points are collected, the program calculates the new balance defined by subtracting the result of the bet multiplied by the number of lines from the balance. The slot machine spins and generates a 3x3 array of letter symbols that each has a defined multiplier. If there are any winnings, defined by having the same symbol across the row, these winnings are calculated by multiplying the bet by the multiplier for the winning row for each row the user places a bet on. If the balance == 0, then break as the user is out of money and the game is over. If the user still has money, prompt them to play again or exit the game. 

# Running the App
To play this game, clone down the repo into your local. cd into the directory javascript-slot-machine and run node project.js to start the game. Follow the user prompts throughout the game play and good luck! 
