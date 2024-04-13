class View {

    createBoardHTML(size) {
        this.changeGridCSS(size)

        //board
        let boardElement = document.querySelector('#board')
        let html = '';
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let id = String(i) + String(j);

                let setSize = parseInt(Math.sqrt(size));
                let set__row = (i + 1) % (setSize) == 0 ? "set__row" : "";
                let set__col = (j + 1) % (setSize) == 0 ? "set__col" : "";

                let item = `<div id='${id}' data-row='${i}' class="cell grid__item flex-col ${set__row} ${set__col}">${j + 1}</div>`
                html += item;
            }
        }

        boardElement.innerHTML = html;

        //btnNumbers
        let btnNumbers = document.querySelector('.btn-numbers')
        let row = Math.sqrt(size)
        let sizeClass = size == 9 ? 'small' : 'large'
        html = ''
        for (let i = 0; i < row; i++) {
            let html_number = ''
            for (let j = 0; j < row; j++) {
                html_number += `<div class="btn-number ${sizeClass}">${j + 1 + i * row}</div>`
            }
            html += `<div class="btn-numbers-row flex-row">${html_number}</div>`
        }
        btnNumbers.innerHTML = html;
    }

    printBoard(board) {

        let size = board.length;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let element = document.getElementById(`${i}${j}`);

                element.textContent = board[i][j] > 0 ? board[i][j] : "";
                let given = board[i][j] > 0 ? "given " : "emptyItem ";

                element.classList.add(given.replace(" ", ''))

            }
        }
    }

    changeGridCSS(size) {
        let temp = "auto ".repeat(size)
        let boardElement = document.querySelector('#board')
        boardElement.style.gridTemplateColumns = temp
        boardElement.style.gridTemplateRows = temp
        boardElement.style.fontSize = size == 4 ? "2.25rem" : "1rem";
    }
}