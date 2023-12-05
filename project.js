const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;
const MIN_NUM_LINES = 1;
const MAX_NUM_LINES = 3;

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
/**
 * This function prompts a user for their deposit amount and validates the input. If the input is NaN or is negative, it is invalid and they are prompted to enter a deposite amount until a valid amount is entered. 
 * 
 * @returns 
 */
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

/**
 * This function prompts the user for the number of lines they would like to bet on and validates the input. If the input is NaN, is less than the MIN_NUM_LINES or greater than the MAX_NUM_LINES, 
 then they are prompted to try again until the input
 is valid.
 * @returns 
 */
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines < MIN_NUM_LINES || numberOfLines > MAX_NUM_LINES) {
            console.log("Invalid number of lines, try again.");
        } else {
            return numberOfLines;
        }
    }
};

/**
 * This function prompts a user to enter the bet per line and validates the input. If the input is NaN, less than or equal to 0, or greater than the available balance, the user is prompted to try again until the bet is valid.
 * @param {*} balance 
 * @param {*} lines 
 * @returns 
 */
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

/**
 * This function handles the spin logic for the slot reels.
 * 1. Generate an array with all of the available symbols
 * 2. For each COLUMN, push an empty array into the reels array.
 * 3. Create a copy of the available symbols so each  as the copy of the symbol array will be manipulated.
 * 4. For each row, generate a random number rounded down based on the number of available symbols which is the index to choose a symbol from in the array of symbols. 
 * 5. Get the symbol from that randomly generated index. 
 * 6. Add the selected symbol to the current index in the reel array. 
 * 7. Remove the selected symbol from the copy of symbols so it does not appear again in the current reel.
 * @returns 
 */
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

/**
 * This helper function transposes the 2D array so we are able to easily access the symbols by row.
 * 1. For each ROW, add an empty array to the rows array.
 * 2. For each column, get the element from the reel and add to the row we are currently building.
 * @param {*} reels 
 * @returns 
 */
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

/**
 * This function formats the rows for printing in the console. Each symbol will be separated by a pipe delimiter only if it is not the last symbol in the array ie A | C | D
 * 1. For each row array in the rows array, create an empty string to hold the row values.
 * 2. For each index and symbol in the row entries, add the symbol to the rowString. If we are not at the end of the row array, add a pipe delimiter after the symbol.
 * @param {*} rows 
 */
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

/**
 * This function handles calculating the winnings.
 * 1. Get the symbols from the row array based on how many lines the user bet.
 * 2. Compare each symbol to the first symbol and if they are not equal, then break. If they are all equal, then calculate the winnings.
 * 3. When calculating the winnings, all of the symbols will be the same in that row, so we can get the multiplier from SYMBOL_VALUES from the first symbol in the array. Multiply the bet by the multiplier and add to the winnings variable.
 * 
 * @param {*} rows 
 * @param {*} bet 
 * @param {*} lines 
 * @returns 
 */
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
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

/**
 * This function is the driver of the game where all of the business logic is called. 
 * 1. The user deposits money and this balance is printed to the console. 
 * 2. We collect the number of lines the user wants to bet on and the user's bet per line. 
 * 3. We calculate the new balance defined by subtracting result of the bet multiplied by the number of lines from the balance.
 * 4. Generate the reels via the spin function. 
 * 5. Transpose the reels so we can access the rows. 
 * 6. Format and print the rows. 
 * 7. Get the winnings.
 * 8. Add the winnings to the balance.
 * 9. If the balance == 0, then break as the user is out of money and the game is over.
 * 10. If the user still has money, prompt them to play again or exit the game. 
 */
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
            console.log("You ran out of money! Game over.");
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

