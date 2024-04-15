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
            // Nếu không còn ô trống nào, thêm bảng đã giải vào mảng giải pháp
            this.solutions.push(copyBoard(this.board)); // Tạo một bản sao của bảng để tránh thay đổi bảng gốc
            return;
        }

        const [row, col] = emptyCell;

        for (let num = 1; num <= this.board.length; num++) {
            if (this.isValidMove(row, col, num)) {
                this.board[row][col] = num;

                this.solve();

                this.board[row][col] = 0; // Reset lại giá trị của ô
            }
        }
    }

    findEmptyCell() {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board.length; col++) {
                if (this.board[row][col] === 0) {
                    return [row, col]; // Trả về tọa độ của ô trống
                }
            }
        }
        return null; // Nếu không còn ô trống nào
    }

    isValidMove(row, col, num) {
        // Kiểm tra xem num có thỏa mãn điều kiện của Sudoku hay không
        return (
            this.isRowSafe(row, num) &&
            this.isColSafe(col, num) &&
            this.isBoxSafe(row - row % Math.sqrt(this.board.length), col - col % Math.sqrt(this.board.length), num)
        );
    }

    isRowSafe(row, num) {
        // Kiểm tra xem num đã tồn tại trong hàng hay chưa
        for (let col = 0; col < this.board.length; col++) {
            if (this.board[row][col] === num) {
                return false;
            }
        }
        return true;
    }

    isColSafe(col, num) {
        // Kiểm tra xem num đã tồn tại trong cột hay chưa
        for (let row = 0; row < this.board.length; row++) {
            if (this.board[row][col] === num) {
                return false;
            }
        }
        return true;
    }

    isBoxSafe(startRow, startCol, num) {
        // Kiểm tra xem num đã tồn tại trong ô Math.sqrt(this.board.length)xMath.sqrt(this.board.length) hay chưa
        for (let row = 0; row < Math.sqrt(this.board.length); row++) {
            for (let col = 0; col < Math.sqrt(this.board.length); col++) {
                if (this.board[row + startRow][col + startCol] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    getSolution(filledCells) { // Đạt
        if (this.solutions.length == 1) return this.solutions
        for (let key in filledCells) {
            let row = key[0];
            let col = key[1];
            let c = []
            for (let i = 0; i < this.solutions.length; i++) {
                if (filledCells[key] != this.solutions[i][row][col]) {
                    c.push(i)
                }
            }
            console.log(c)
            if (c.length == this.solutions.length) {
                return this.solutions
            }
            else {
                for (let t in c) {
                    this.solutions.splice(t, 1)
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
