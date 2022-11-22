class Game {
    constructor(rows, cols) {
        this.rows = rows || 4
        this.cols = cols || 4
        this.numStartTiles = 2
        this.score = 0
        this.bestScore = localStorage.getItem('best')
        this.board = []
        this.newTileIndex = []
        this.mergedTilesIndex = []
        this.bindKeyEvent()
    }

    start() {
        this.clear()
        this.initTiles()
        this.renderTiles()
        // this.mockData()
        this.updateTiles()
        this.updateBestScore()
    }

    clear() {
        let tiles = e('#tiles')
        tiles.innerHTML = ''
        this.score = 0
    }

    initTiles() {
        this.board = new Array(this.rows).fill([]).map(() => new Array(this.cols).fill(0))
        for (let i = 0; i < this.numStartTiles; i++) {
            this.addRandomTile()
        }
    }

    addRandomTile() {
        let r = Game.randomIntBetween(0, this.rows)
        let c = Game.randomIntBetween(0, this.cols)
        if (this.board[r][c] === 0) {
            this.newTileIndex = [r, c]
            this.board[r][c] = 2
        } else {
            this.addRandomTile()
        }
    }

    renderTiles() {
        let tiles = e('#tiles')
        let len = this.rows * this.cols
        for (let i = 0; i < len; i++) {
            let row = Math.floor(i / this.rows)
            let col = i % this.rows
            let t = `<div class="tile" data-row="${row}" data-col="${col}"></div>`
            appendHTML(tiles, t)
        }
    }

    updateTiles() {
        let model = this.board
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let num = model[r][c]
                let tile = this.getTileByRowAndCol(r, c)

                if (num !== 0) {
                    if (num === 1024 || num === 2048) {
                        tile.innerHTML = `<span class="tile-${num} small-text">${num}</span>`
                    } else {
                        tile.innerHTML = `<span class="tile-${num}">${num}</span>`
                    }
                } else {
                    // Blank tiles
                    let span = tile.querySelector('span')
                    if (span) {
                        tile.removeChild(span)
                    }
                }
            }
        }
        this.updateTileNew()
        this.updateTilesMerged()
    }

    updateTileNew() {
        let [r, c] = this.newTileIndex
        let tile = this.getTileByRowAndCol(r, c)
        let span = tile.querySelector('span')
        span.classList.add('tile-new')
    }

    updateTilesMerged() {
        this.mergedTilesIndex.forEach((o) => {
            let {r, c} = o
            // log('updateTilesMerged', r, c)
            let tile = this.getTileByRowAndCol(r, c)
            let span = tile.querySelector('span')
            if (span) {
                span.classList.add('tile-merged')
            }
        })
        this.mergedTilesIndex = []
    }

    getTileByRowAndCol(r, c) {
        return [...es(`[data-row="${r}"]`)][c]
    }

    updateScore() {
        let prevScore = this.score
        this.mergedTilesIndex.forEach(o => {
            let {r, c} = o
            let num = this.board[r][c]
            this.score += num
        })
        let s = e('#score')
        s.innerHTML = this.score

        this.addScoreAnimation(prevScore)

        if (this.bestScore === null || this.score > this.bestScore) {
            localStorage.setItem('best', this.score)
            this.updateBestScore()
        }
    }

    addScoreAnimation(prevScore) {
        let s = e('#score')
        let add = this.score - prevScore
        if (add > 0) {
            let t = `<div class="score-addition">+${add}</div>`
            appendHTML(s, t)
        } else {
            let d = s.querySelector('div')
            if (d) {
                d.remove()
            }
        }
    }

    updateBestScore() {
        let best = localStorage.getItem('best')
        let s = e('#best-score')
        s.innerHTML = best === null ? 0 : best
    }

    move(keycode) {
        if (keycode === 'ArrowLeft' && this.canMoveLeft()) {
            this.moveLeft()
        } else if (keycode === 'ArrowRight' && this.canMoveRight()) {
            this.moveRight()
        } else if (keycode === 'ArrowUp' && this.canMoveUp()) {
            this.moveUp()
        } else if (keycode === 'ArrowDown' && this.canMoveDown()) {
            this.moveDown()
        } else {
            return
        }

        this.updateScore()
        this.addRandomTile()
        this.updateTiles()

        if (this.isGameOver()) {
            this.showResult()
        }
        // log(this.board)
    }

    noBlockHorizontal(row, col1, col2) {
        for (let i = col1 + 1; i < col2 ; i++) {
            if (this.board[row][i] !== 0) {
                return false
            }
        }
        return true
    }

    noBlockVertical(col, row1, row2) {
        for (let i = row1 + 1; i < row2 ; i++) {
            if (this.board[i][col] !== 0) {
                return false
            }
        }
        return true
    }

    moveLeft() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] !== 0) {
                    for (let k = 0; k < j; k++) {
                        if (this.board[i][k] === 0 && this.noBlockHorizontal(i, k, j)) {
                            // from i, j to i, k
                            this.board[i][k] = this.board[i][j]
                            this.board[i][j] = 0
                        // } else if (this.board[i][k] === this.board[i][j] && this.noBlockHorizontal(i, k, j) && !this.hasConflictedArr[i][k]) {
                        } else if (this.board[i][k] === this.board[i][j] && this.noBlockHorizontal(i, k, j)) {
                            this.board[i][k] += this.board[i][j]
                            this.board[i][j] = 0

                            // log('moveLeft merged', i, k)
                            this.mergedTilesIndex.push({r: i, c: k})
                        }
                    }
                }
            }
        }
    }

    moveRight() {
        for (let i = this.rows - 1; i >= 0; i--) {
            for (let j = this.cols - 1; j >= 0; j--) {
                if (this.board[i][j] !== 0) {
                    for (let k = this.cols - 1; k > j; k--) {
                        if (this.board[i][k] === 0 && this.noBlockHorizontal(i, j, k)) {
                            this.board[i][k] = this.board[i][j]
                            this.board[i][j] = 0
                            // } else if (this.board[i][k] === this.board[i][j] && this.noBlockHorizontal(i, k, j) && !this.hasConflictedArr[i][k]) {
                        } else if (this.board[i][k] === this.board[i][j] && this.noBlockHorizontal(i, j, k)) {
                            this.board[i][k] += this.board[i][j]
                            this.board[i][j] = 0

                            // log('moveRight merged', i, k)
                            this.mergedTilesIndex.push({r: i, c: k})
                        }
                    }
                }
            }
        }
    }

    moveUp() {
        for (let j = 0; j < this.cols; j++) {
            for (let i = 1; i < this.rows; i++) {
                if (this.board[i][j] !== 0) {
                    for (let k = 0; k < i; k++) {
                        if (this.board[k][j] === 0 && this.noBlockVertical(j, k, i)) {
                            this.board[k][j] = this.board[i][j]
                            this.board[i][j] = 0
                        } else if (this.board[k][j] === this.board[i][j] && this.noBlockVertical(j, k, i)) {
                            this.board[k][j] += this.board[i][j]
                            this.board[i][j] = 0

                            // log('moveUp merged', k, j)
                            this.mergedTilesIndex.push({r: k, c: j})
                        }
                    }
                }
            }
        }
    }

    moveDown() {
        for (let j = 0; j < this.cols; j++) {
            for (let i = this.rows - 1; i >= 0; i--) {
                if (this.board[i][j] !== 0) {
                    for (let k = 3; k > i; k--) {
                        if (this.board[k][j] === 0 && this.noBlockVertical(j, i, k)) {
                            this.board[k][j] = this.board[i][j]
                            this.board[i][j] = 0
                        } else if (this.board[k][j] === this.board[i][j] && this.noBlockVertical(j, i, k)) {
                            this.board[k][j] += this.board[i][j]
                            this.board[i][j] = 0

                            // log('moveDown merged', k, j)
                            this.mergedTilesIndex.push({r: k, c: j})
                        }
                    }
                }
            }
        }
    }

    canMoveLeft() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 1; j < this.cols; j++) {
                if (this.board[i][j] !== 0) {
                    if (this.board[i][j - 1] === 0 || this.board[i][j - 1] === this.board[i][j]) {
                        return true
                    }
                }
            }
        }
        return false
    }

    canMoveRight() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] !== 0) {
                    if (this.board[i][j + 1] === 0 || this.board[i][j + 1] === this.board[i][j]) {
                        return true
                    }
                }
            }
        }
        return false
    }

    canMoveUp() {
        for (let i = 1; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] !== 0) {
                    if (this.board[i - 1][j] === 0 || this.board[i - 1][j] === this.board[i][j]) {
                        return true
                    }
                }
            }
        }
        return false
    }

    canMoveDown() {
        for (let i = 0; i < this.rows - 1; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] !== 0) {
                    if (this.board[i + 1][j] === 0 || this.board[i + 1][j] === this.board[i][j]) {
                        return true
                    }
                }
            }
        }
        return false
    }

    bindKeyEvent() {
        document.addEventListener('keydown', (event) => {
            this.move(event.code)
        })
    }

    isGameOver() {
        return !this.canMoveLeft() && !this.canMoveRight() && !this.canMoveUp() && !this.canMoveDown()
    }

    showResult() {
        let board = e('#board')
        let t = `
            <div id="result-box">
                <div id="result-message">GAME OVER</div>
                <button id="try-again-button" class="result-button">Try Again</button>
            </div>
            `
        appendHTML(board, t)

        let b = e('#try-again-button')
        b.addEventListener('click', () => {
            let r = e('#result-box')
            r.remove()
            this.start()
        })
    }

    mockData() {
        // this.board = [
        //     [64, 4, 8, 0],
        //     [8, 32, 16, 4],
        //     [128, 64, 32, 16],
        //     [256, 1024, 512, 256]
        // ]
        // this.board = [
        //     [64, 4, 0, 0],
        //     [8, 32, 0, 4],
        //     [128, 64, 32, 16],
        //     [1024, 1024, 512, 256]
        // ]
        this.board = [
            [0, 2, 2, 0],
            [2, 0, 0, 0],
            [2, 0, 0, 0],
            [2, 0, 0, 0],
        ]
    }

    static randomIntBetween(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }
}

const log = console.log.bind(window)

const e = selector => document.querySelector(selector)

const es = selector => document.querySelectorAll(selector)

const appendHTML = (element, content) => element.insertAdjacentHTML('beforeend', content)

const __main = () => {
    let g = new Game()
    g.start()
}

__main()