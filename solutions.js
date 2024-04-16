class Solutions {
    solutions;
    board;

    constructor(_board) {
        this.board = copyBoard(_board)
        this.solutions = [];
        this.solve();
    }

    solve() {
        const emptyCell = this.findEmptyCell();

        if (!emptyCell) {
            this.solutions.push(copyBoard(this.board));
            return;
        }

        const [row, col] = emptyCell;

        for (let num = 1; num <= this.board.length; num++) {
            if (this.isValidMove(row, col, num)) {
                this.board[row][col] = num;

                this.solve();

                this.board[row][col] = 0;
            }
        }
    }

    findEmptyCell() {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board.length; col++) {
                if (this.board[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    isValidMove(row, col, num) {
        return (
            this.isRowSafe(row, num) &&
            this.isColSafe(col, num) &&
            this.isBoxSafe(row - row % Math.sqrt(this.board.length), col - col % Math.sqrt(this.board.length), num)
        );
    }

    isRowSafe(row, num) {
        for (let col = 0; col < this.board.length; col++) {
            if (this.board[row][col] === num) {
                return false;
            }
        }
        return true;
    }

    isColSafe(col, num) {
        for (let row = 0; row < this.board.length; row++) {
            if (this.board[row][col] === num) {
                return false;
            }
        }
        return true;
    }

    isBoxSafe(startRow, startCol, num) {
        for (let row = 0; row < Math.sqrt(this.board.length); row++) {
            for (let col = 0; col < Math.sqrt(this.board.length); col++) {
                if (this.board[row + startRow][col + startCol] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    getSolution(filledCells) {
        if (this.solutions.length == 1) return this.solutions
        for (let key in filledCells) {
            let row = key[0];
            let col = key[1];
            let checkValues = []
            for (let i = 0; i < this.solutions.length; i++) {
                if (filledCells[key] != this.solutions[i][row][col]) {
                    checkValues.push(i)
                }
            }
            if (checkValues.length == this.solutions.length) {
                return this.solutions
            }
            else {
                for (let value in checkValues) {
                    this.solutions.splice(value, 1)
                }
            }
        }
        return this.solutions
    }

    printSolutions(allSolutions) {
        console.log("Tất cả các giải pháp:");
        allSolutions.forEach((solution, index) => {
            console.log(`Giải pháp ${index + 1}:`);
            console.log(solution);
        });
    }
}
