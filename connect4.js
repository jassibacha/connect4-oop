/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
    constructor(color) {
        this.color = color;
    }
}

class Game {
    constructor(p1, p2, height = 6, width = 7) {
        this.players = [p1, p2];
        this.width = width;
        this.height = height;
        this.currPlayer = p1;
        this.board = [];
        this.makeBoard();
        this.makeHtmlBoard();
    }
    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */
    makeBoard() {
        for (let y = 0; y < this.height; y++) {
            this.board.push(Array.from({ length: this.width }));
        }
    }
    /** makeHtmlBoard: make HTML table and row of column tops. */
    makeHtmlBoard() {
        const board = document.getElementById('board');

        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');

        console.log('this:', this);
        //console.log('handleClick:', this.handleClick);

        // Moved this to startGame()
        // We bind handleClick to this, still kinda confused haha
        this.handleClickBind = this.handleClick.bind(this);
        // we do this.handleClickBind to add it in constructor
        //console.log(handleClickBind);
        top.addEventListener('click', this.handleClickBind);

        for (let x = 0; x < this.width; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }

        board.append(top); // ?

        // make main part of board
        for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }

            board.append(row); // ?
        }

        // TALK WITH MENTOR ABOUT THIS BINDING, GET A BETTER EXPLANATION
        //const startBtn = document.querySelector('.play');
        //this.startGame = this.startGame.bind(this);
        //startBtn.addEventListener('click', this.startGame);
        //console.log(this.startGame());
    }
    /** findSpotForCol: given column x, return top empty y (null if filled) */
    findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    }
    /** placeInTable: update DOM to place piece into HTML table of board */

    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        console.log(this.currPlayer, this.currPlayer.color);
        piece.style.backgroundColor = this.currPlayer.color;
        //piece.classList.add(`${this.currPlayer}`);
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    // startGame() {
    //     console.log('startGame is being called.');
    //     const startBtn = document.querySelector('.play');
    //     startBtn.innerText = 'Restart';
    //     this.board = [];
    //     this.p1 = new Player(document.querySelector('.p1Color').value);
    //     this.p2 = new Player(document.querySelector('.p2Color').value);
    //     console.log(this.p1); // this.p1 works
    //     this.currPlayer = this.p1;

    //     const board = document.querySelector('#board');
    //     board.innerHTML = '';
    //     this.makeBoard();
    //     this.makeHtmlBoard();

    //     const top = document.getElementById('column-top');
    //     // We bind handleClick to this, still kinda confused haha
    //     this.handleClickBind = this.handleClick.bind(this);
    //     // we do this.handleClickBind to add it in constructor
    //     top.addEventListener('click', this.handleClickBind);
    // }

    /** endGame: announce game end */
    endGame(msg) {
        alert(msg);
        const top = document.querySelector('#column-top');
        console.log('endGame this: ', this);
        //this.handleClickBind = this.handleClick.bind(this);
        top.removeEventListener('click', this.handleClickBind);
        console.log('Removing event listener.');
    }
    /** handleClick: handle click of column top to play piece */

    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;

        console.log('this.findSpotForCol()', this.findSpotForCol());
        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);

        // check for win
        if (this.checkForWin()) {
            return this.endGame(`Player ${this.currPlayer.color} won!`);
        }

        // check for tie
        if (this.board.every((row) => row.every((cell) => cell))) {
            return this.endGame('Tie!');
        }

        // switch players
        this.currPlayer =
            this.currPlayer === this.players[0]
                ? this.players[1]
                : this.players[0];
    }
    /*
     * checkForWin: check board cell-by-cell for "does a win start here?" */

    checkForWin() {
        const _win = (cells) => {
            // Check four cells to see if they're all color of current player
            //  - cells: list of four (y, x) cells
            //  - returns true if all are legal coordinates & all match currPlayer

            return cells.every(
                ([y, x]) =>
                    y >= 0 &&
                    y < this.height &&
                    x >= 0 &&
                    x < this.width &&
                    this.board[y][x] === this.currPlayer
            );
        };

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [
                    [y, x],
                    [y, x + 1],
                    [y, x + 2],
                    [y, x + 3],
                ];
                const vert = [
                    [y, x],
                    [y + 1, x],
                    [y + 2, x],
                    [y + 3, x],
                ];
                const diagDR = [
                    [y, x],
                    [y + 1, x + 1],
                    [y + 2, x + 2],
                    [y + 3, x + 3],
                ];
                const diagDL = [
                    [y, x],
                    [y + 1, x - 1],
                    [y + 2, x - 2],
                    [y + 3, x - 3],
                ];

                // find winner (only checking each win-possibility as needed)
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
}

document.querySelector('.play').addEventListener('click', () => {
    const board = document.querySelector('#board');
    board.innerHTML = '';
    let p1 = new Player(document.querySelector('.p1Color').value);
    let p2 = new Player(document.querySelector('.p2Color').value);
    new Game(p1, p2, 6, 7);
});
// make a click event listener out here
