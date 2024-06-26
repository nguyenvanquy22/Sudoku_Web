class Solver {
    watch = true;
    speed = 200;
    requestStop = false;
    started = false
    positionContinue = 0
    i = 0

    board;
    originalBoard;

    boardSize;
    boxSize;

    boardRows;
    boardColumns;
    boardBoxes;

    questionsCount;
    solvedCount = 0;
    isBoardSolved = false;

    emptiesObject = {};
    singlesObject = {};
    backTrackObject = {};

    constructor(_board) {
        this.board = _board;
        this.originalBoard = copyBoard(_board);

        this.boardSize = _board.length;
        this.boxSize = parseInt(Math.sqrt(this.boardSize))

        this.init3arrays()
        this.questionsCount = this.findQuestionsCount();
        this.solvedCount = 0;
    }

    startSolving() {
        this.started = true
        this.initEmptiesObject()
        this.singlesFinder()
        if (!this.isBoardSolved) this.backTracking()
    }

    //
    initEmptiesObject() {
        let emptyObjectCounter = 0;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {

                if (this.board[row][col] == 0) {

                    let boxNumber = getBoxNumber(row, col, this.boxSize);
                    this.emptiesObject[`${emptyObjectCounter}`] = {
                        row: row,
                        col: col,
                        box: boxNumber,
                        currentValue: 0,
                        possibleValues: [],
                        possibleIdx: null,
                        isSingle: false,
                        solved: false
                    }

                    emptyObjectCounter++;
                }
            }
        }
        this.initPossibleValuesEmptiesObj()

        if (emptyObjectCounter != this.questionsCount) {
            console.log("Error in intEmptiesObject: questionsCount and empty object count doesn't match");
        }
    }

    initPossibleValuesEmptiesObj() {
        for (let idx in this.emptiesObject) {
            let obj = this.emptiesObject[idx]
            if (!obj.solved) {
                let { row, col, box } = obj;
                let possible = this.checkIfSingle(row, col, box);
                obj.possibleValues = [...possible];
                obj.possibleIdx = 0;
            }
        }
    }


    //################################ Singles Finder START
    singlesFinder() {
        let valuesFilledCounter;

        do {
            valuesFilledCounter = 0;
            for (let idx in this.emptiesObject) {
                let obj = this.emptiesObject[idx]
                if (!obj.solved) {
                    let isSingleFilled = this.findSinglesFromObject(obj);
                    if (isSingleFilled == 0) {
                        isSingleFilled = this.findSinglesFromBox(obj);
                    }
                    if (isSingleFilled > 0) {
                        this.updatePossibleValuesEmptiesObj(obj, isSingleFilled)
                        this.singlesObject[valuesFilledCounter] = obj;
                        valuesFilledCounter++;
                    }
                }
            }

            // write values to board
            if (valuesFilledCounter > 0) {
                this.solvedCount += valuesFilledCounter;
                this.writeToBoard(this.singlesObject)
                view.printBoard(this.board)
            }
        } while (valuesFilledCounter > 0);

        // is board solved
        if (this.solvedCount == this.questionsCount) {
            this.isBoardSolved = true;
            console.log("Singles: board solved");
            //validate the board
            let isSolutionValid = this.boardValidation()
            if (isSolutionValid) console.log('Singles: solution is a valid sudoku');
            setTimeout(() => {
                alert('Yo!!! Board Solved')
            }, 100)
        }
        console.log(`Singles: ${this.solvedCount} filled out of ${this.questionsCount}`);
    }

    findSinglesFromObject(obj) {
        let valueFilled = 0;

        if (obj.possibleValues.length == 1) {
            valueFilled = obj.possibleValues[0];
            obj.isSingle = true;
            obj.solved = true;
            obj.currentValue = obj.possibleValues[0];
        }

        return valueFilled;
    }

    checkIfSingle(row, col, box) {
        let possible = Array.from({ length: boardSize }, (val, idx) => idx + 1)
        let rowValues = [...new Set(this.boardRows[row])]
        let colValues = [...new Set(this.boardColumns[col])]
        let boxValues = [...new Set(this.boardBoxes[box])]
        let existigValues = [...new Set(rowValues.concat(colValues).concat(boxValues))]
        removeInArrayValue(existigValues, 0);

        for (let item of existigValues) removeInArrayValue(possible, item);

        return possible;
    }

    findSinglesFromBox(obj) {
        for (let v1 of obj.possibleValues) {
            let isSingle = true
            for (let idx in this.emptiesObject) {
                let emptyObj = this.emptiesObject[idx]
                if (obj.solved || obj.box != emptyObj.box ||
                    (obj.row == emptyObj.row && obj.col == emptyObj.col)) {
                    continue
                }
                for (let v2 of emptyObj.possibleValues) {
                    if (v1 == v2) {
                        isSingle = false
                        break
                    }
                }
            }
            if (isSingle) {
                obj.isSingle = true;
                obj.solved = true;
                obj.currentValue = v1;
                return v1;
            }
        }
        return 0;
    }

    updatePossibleValuesEmptiesObj(obj, value) {
        for (let idx in this.emptiesObject) {
            let emptyObj = this.emptiesObject[idx]
            if (!emptyObj.solved &&
                (obj.row == emptyObj.row
                    || obj.col == emptyObj.col
                    || obj.box == emptyObj.box)) {
                if (emptyObj.possibleValues.includes(value)) {
                    removeInArrayValue(emptyObj.possibleValues, value)
                }
            }
        }
    }

    //################################ Singles Finder END

    //################################ back tracking START
    async backTracking() {

        let bTquestions = this.createBackTrackingObject()
        console.log(`backTrackign: remaining empty items are: ${bTquestions}`);
        let beforeBackTrackBoard = copyBoard(this.board);

        //let i = 0;
        let iterations = 0;
        while (this.i < bTquestions) {
            let obj = this.backTrackObject[this.i]
            let { row, col, box, possibleValues, possibleIdx } = obj;

            let isFilled = false;
            while (possibleIdx < possibleValues.length) {
                let value = possibleValues[possibleIdx]
                let isValueValid = this.checkIfValidValue(row, col, box, value)
                possibleIdx++;
                this.backTrackObject[this.i].possibleIdx = possibleIdx;
                if (isValueValid) {
                    this.backTrackObject[this.i].currentValue = value
                    isFilled = true
                    break;
                }
            }

            //if no value filled for this 'i'
            if (!isFilled) {
                if (this.i == 0) {
                    console.log('backTracking: solution cannot be found');
                    return;
                } else {
                    this.backTrackObject[this.i].possibleIdx = 0;
                    this.backTrackObject[this.i].currentValue = 0;
                    this.i -= 2;
                }
            }

            if (this.requestStop) {
                this.i++;
                return;
            }
            this.writeToBoard(this.backTrackObject)
            view.printBoard(this.board)
            //if user requests to stop then abort

            // all things related to speeed and watch
            // if (this.watch) {
            //     let reduction = parseInt(iterations / 100) * 10
            //     reduction = reduction >= this.speed ? 0 : reduction;
            //     await sleep(this.speed - reduction)
            // }
            await sleep(50)
            this.i++; iterations++;
        }

        // final steps
        console.log('iteration done: ', iterations);
        if (this.boardValidation()) {
            console.log('backTracking Complete: board Solved');
            setTimeout(() => {
                alert('Yo!!! Board Solved')
            }, 100)
        } else {
            console.log('backTracking Complete: no solution found');
            setTimeout(() => {
                alert('No solution found')
            }, 100)
        }
    }

    checkIfValidValue(row, col, box, value) {
        let isValid = true;
        let rowValues = [...new Set(this.boardRows[row])]
        let colValues = [...new Set(this.boardColumns[col])]
        let boxValues = [...new Set(this.boardBoxes[box])]
        if (rowValues.includes(value) || colValues.includes(value) || boxValues.includes(value)) isValid = false;

        return isValid;
    }

    createBackTrackingObject() {
        let counter = 0;
        for (let idx in this.emptiesObject) {
            let obj = this.emptiesObject[idx];
            if (!obj.solved) {
                this.backTrackObject[counter] = obj;
                counter++;
            }
        }
        return counter;
    }
    //################################ back tracking END

    writeToBoard(_obj) {
        let objLen = Object.keys(_obj).length;
        for (let i = 0; i < objLen; i++) {
            let obj = _obj[i];
            this.board[obj.row][obj.col] = obj.currentValue;
        }
        this.init3arrays()
    }


    init3arrays() {
        this.boardRows = this.board;
        this.boardColumns = generateColumnArray(this.board)
        this.boardBoxes = generateBoxArray(this.board, this.boardSize)
    }

    findQuestionsCount() {
        return parseInt(Math.pow(this.boardSize, 2)) - this.board.reduce((a, b) => a + (b.filter(x => x > 0).length), 0)
    }

    boardValidation() {
        let resultValidator = new Validate(this.board, this.boardSize);
        return resultValidator.runTests()
    }
}