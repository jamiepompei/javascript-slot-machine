const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6, 
    D: 8
}

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        } else {
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.");
        } else {
            return numberOfLines;
        }
    }
};

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet, try again.");
        } else {
            return numberBet;
        }
    }
};

const spin = () => {
    const symbols = [];
    //generate an array with all the available symbols
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    //for each column, add a reel
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        // create a copy of the available symbols so each reel can be unique 
        const reelSymbols = [...symbols];
        for (let j=0; j< ROWS; j++){
            //generate a random number rounded down based on the number of available symbols
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            //get the symbol from that index
            const selectedSymbol = reelSymbols[randomIndex];
            //add the selected symbol to the current reel
            reels[i].push(selectedSymbol);
            //remove the selected symbol from the copy of symbols so it does not appear again in the current reel 
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

//transpose the matrix
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        //each row needs a new array
        rows.push([]);
        //for every row, loop through every column
        for (let j = 0; j < COLS; j++) {
            //for each column, get the element in the row we are currently building
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            // only add the pipe delimiter if it is not the last symbol in the row
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row ++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

const game = () => {
    console.log("Welcome to the game! May the odds be in your favor.");
    let balance = deposit();
    while (true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines =  getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if(balance == 0){
            console.log("You ran out of money!");
            break;
        }
        const playAgain = prompt("Do you want to play again? (y/n)");
        if (playAgain != "y") {
            console.log("Thanks for playing!");
            break;
        }
    }
};

game();

