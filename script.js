window.addEventListener('load', () => {
    newGame(4, 0)
})

function newGame(_boardSize, _level) {

    boardSize = _boardSize;
    boxSize = parseInt(Math.sqrt(boardSize))
    level = _level;

    board = new Board(boardSize);
    isBoardValidate = board.createBoard(boardSize);
    console.log('isBoardValidate', isBoardValidate)

    //dig holes
    solvedBoard = copyBoard(board.board)
    digger = new Digger(level, board.board, boardSize)
    questionBoard = copyBoard(board.board)

    //draw grid on DOM
    view = new View()
    view.createBoardHTML(boardSize)
    view.printBoard(questionBoard)

    initActions()
}

function clearUserInput() {
    board.board = copyBoard(questionBoard)
    view.printBoard(questionBoard)
}