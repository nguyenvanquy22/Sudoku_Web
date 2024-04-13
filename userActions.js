let isFirstTime = true;
let emptyItems;
let btnNumberItems;
let user__level = [0, 'Easy'];
let user__size = 4;

function initActions() {

    if (isFirstTime) {
        let submitButton = document.querySelector('#header__submit > span')
        let body = document.querySelector('body')
        let size_options = document.querySelectorAll('.size-option')
        let level_options = document.querySelectorAll('.level-option')
        let btn_undo = document.querySelector(".btn-undo")
        let btn_remove = document.querySelector('.btn-remove')
        let btn_hint = document.querySelector('.btn-hint')
        let btn_solver = document.querySelector('.btn-solver')
        let btn_newGame = document.querySelector('.btn-newGame')

        submitButton.addEventListener('click', submitHandler)
        body.addEventListener('keyup', keyUpHandler)
        size_options.forEach(x => x.addEventListener('click', (e) => newGameHandler(e, 'size-option', x)))
        level_options.forEach(x => x.addEventListener('click', (e) => newGameHandler(e, 'level-option', x)))
        btn_undo.addEventListener('click', undoHandler)
        btn_remove.addEventListener('click', removeHandler)
        btn_hint.addEventListener("click", hintHandler)
        btn_solver.addEventListener('click', solverHandler)
        btn_newGame.addEventListener('click', restartGame)

        declareBoardElements()

        isFirstTime = false;
    }

    function declareBoardElements() {
        emptyItems = document.querySelectorAll('.emptyItem')
        btnNumberItems = document.querySelectorAll('.btn-number')

        emptyItems.forEach(x => x.addEventListener('click', emptyItemHandler))
        btnNumberItems.forEach(x => x.addEventListener('click', keyPadHandler))

        initSolver()
    }


    let selection;
    let position = [];

    function emptyItemHandler() {
        let x = this.id[0];
        let y = this.id[1];
        let boxNumber1 = getBoxNumber(x, y, parseInt(Math.sqrt(user__size)))
        let cells = document.querySelectorAll('.cell')
        cells.forEach(cell => {
            cell.classList.remove('sameRowCol')
            let boxNumber2 = getBoxNumber(cell.id[0], cell.id[1], parseInt(Math.sqrt(user__size)))
            if (cell.id[0] == x || cell.id[1] == y || boxNumber1 == boxNumber2) {
                cell.classList.add('sameRowCol')
            }
        })
        emptyItems.forEach(x => x.classList.remove('selected'))
        this.classList.add('selected')
    }

    function keyPadHandler(event) {
        event.stopPropagation()
        if (selection = document.querySelector('.selected')) {
            let x = selection.id[0];
            let y = selection.id[1];
            value = selection.textContent == '' ? 0 : parseInt(selection.textContent);

            if (value == this.textContent) {
                selection.textContent = ''
                board.board[x][y] = 0
            }
            else {
                selection.textContent = this.textContent;
                board.board[x][y] = this.textContent == '' ? 0 : parseInt(this.textContent)
            }
            position.push({ x, y, value });
        }
    }

    function keyUpHandler(event) {
        if (selection = document.querySelector('.selected')) {
            let k = event.keyCode;
            if (((k < 46 || k > 57) && (k < 96 || k > 105)) || k == 47) {
                //not a number        
            } else {
                let x = selection.id[0];
                let y = selection.id[1];
                value = selection.textContent == '' ? 0 : parseInt(selection.textContent);

                if (value == event.key) {
                    selection.textContent = ''
                    board.board[x][y] = 0
                }
                else {
                    selection.textContent = k == 46 ? "" : event.key;
                    board.board[x][y] = k == 46 ? 0 : parseInt(event.key)
                }
                position.push({ x, y, value });
            }
        }
    }

    //starts game
    function restartGame() {
        solver.requestStop = true;
        btn_solver = document.querySelector('.btn-solver')
        if (btn_solver.classList.contains('solving'))
            btn_solver.classList.remove('solving')
        newGame(user__size, user__level[0])
        declareBoardElements()
    }

    function newGameHandler(e, option, selectedOption) {
        e.stopPropagation()
        if (option == 'size-option') {
            user__size = parseInt(selectedOption.dataset.size);
        } else if (option == 'level-option') {
            user__level[0] = selectedOption.dataset.level;
        } else {
            return;
        }
        if (selectedOption.classList.contains('active')) return;
        document.querySelectorAll(`.${option}`).forEach(opt => {
            opt.classList.remove('active');
        });
        selectedOption.classList.add('active');
        restartGame()
    }

    function undoHandler() {
        if (position.length != 0) {
            let lastPos = position.pop();
            emptyItems.forEach(x => {
                x.classList.remove('selected')
                if (x.id[0] == lastPos.x && x.id[1] == lastPos.y) {
                    x.classList.add('selected')
                    x.textContent = lastPos.value == 0 ? '' : lastPos.value
                    board.board[lastPos.x, lastPos.y] = lastPos.value;
                }
            })
        }
    }

    function removeHandler(event) {
        event.stopPropagation()
        if (selection = document.querySelector('.selected')) {
            selection.textContent = '';
            let x = selection.id[0];
            let y = selection.id[1];
            board.board[x][y] = 0
        }
    }

    function hintHandler() {
        clearUserInput()
        console.log('clear')
    }

    function submitHandler(event) {
        event.stopPropagation();
        let validater = new Validate(board.board, boardSize)
        let isValid = validater.runTests();
        if (isValid) {
            alert("You've Solved this. Awesome!!!")
        } else {
            alert("That's not correct. Keep trying.")
        }
    }

    function initSolver() {
        let copiedBoard = copyBoard(board.board);
        solver = new Solver(copiedBoard)
        solver.watch = true;
        solver.requestStop = false;
        solver.speed = 50;
    }

    function solverHandler() {
        if (this.classList.contains('solving')) {
            this.classList.remove('solving')
            solver.requestStop = true;
        }
        else {
            solver.requestStop = false;
            this.classList.add('solving')
            if (solver.started) {
                solver.backTracking()
            } else {
                solver.startSolving()
            }
            board.board = solver.board
        }
    }
}
