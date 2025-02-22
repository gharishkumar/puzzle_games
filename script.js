document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('puzzle-board');
    const shuffleButton = document.getElementById('shuffle-button');
    const message = document.getElementById('message');
    let tiles = [];
    let emptyTileIndex = 15;

    // Initialize the board
    function initializeBoard() {
        for (let i = 0; i < 16; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (i === 15) {
                tile.classList.add('empty');
            } else {
                tile.textContent = i + 1;
            }
            tile.addEventListener('click', () => moveTile(i));
            board.appendChild(tile);
            tiles.push(tile);
        }
    }

    // Shuffle the tiles
    function shuffleTiles() {
        let shuffleMoves = 1000;
        for (let i = 0; i < shuffleMoves; i++) {
            const possibleMoves = getPossibleMoves(emptyTileIndex);
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            swapTiles(randomMove, emptyTileIndex);
            emptyTileIndex = randomMove;
        }
        message.textContent = '';
    }

    // Move a tile
    function moveTile(index) {
        if (isAdjacent(index, emptyTileIndex)) {
            swapTiles(index, emptyTileIndex);
            emptyTileIndex = index;
            if (isSolved()) {
                message.textContent = 'Congratulations! You solved the puzzle!';
            }
        }
    }

    // Swap two tiles
    function swapTiles(index1, index2) {
        const temp = tiles[index1].textContent;
        tiles[index1].textContent = tiles[index2].textContent;
        tiles[index2].textContent = temp;

        tiles[index1].classList.toggle('empty', tiles[index1].textContent === '');
        tiles[index2].classList.toggle('empty', tiles[index2].textContent === '');
    }

    // Check if two tiles are adjacent
    function isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / 4);
        const col1 = index1 % 4;
        const row2 = Math.floor(index2 / 4);
        const col2 = index2 % 4;
        return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
    }

    // Get possible moves for the empty tile
    function getPossibleMoves(emptyIndex) {
        const possibleMoves = [];
        const row = Math.floor(emptyIndex / 4);
        const col = emptyIndex % 4;

        if (row > 0) possibleMoves.push(emptyIndex - 4);
        if (row < 3) possibleMoves.push(emptyIndex + 4);
        if (col > 0) possibleMoves.push(emptyIndex - 1);
        if (col < 3) possibleMoves.push(emptyIndex + 1);

        return possibleMoves;
    }

    // Check if the puzzle is solved
    function isSolved() {
        for (let i = 0; i < 15; i++) {
            if (tiles[i].textContent !== (i + 1).toString()) {
                return false;
            }
        }
        return true;
    }

    // Event listener for the shuffle button
    shuffleButton.addEventListener('click', shuffleTiles);

    // Initialize the game
    initializeBoard();
    shuffleTiles();
});