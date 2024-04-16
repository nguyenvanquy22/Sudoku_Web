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
        let d = Array(this.solutions.length).fill(0)
        for (let i = 0; i < this.solutions.length; i++) {
            for (let key in filledCells) {
                if (filledCells[key] == this.solutions[i][key[0]][key[1]]) {
                    d[i]++
                }
            }
        }
        let max = d[0];
        let maxIndex = 0;
        for (let i = 1; i < d.length; i++) {
            if (d[i] > max) {
                max = d[i];
                maxIndex = i;
            }
        }
        return this.solutions[maxIndex]
    }

    printSolutions(allSolutions) {
        console.log("Tất cả các giải pháp:");
        allSolutions.forEach((solution, index) => {
            console.log(`Giải pháp ${index + 1}:`);
            console.log(solution);
        });
    }
}
