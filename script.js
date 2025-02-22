document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('puzzle-board');
    const shuffleButton = document.getElementById('shuffle-button');
    const message = document.getElementById('message');
    const imageUpload = document.getElementById('image-upload');
    let tiles = [];
    let emptyTileIndex = 15;

    // Initialize the board
    function initializeBoard() {
        board.innerHTML = '';
        tiles = [];
        for (let i = 0; i < 16; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (i === 15) {
                tile.classList.add('empty');
            }
            tile.addEventListener('click', () => moveTile(i));
            board.appendChild(tile);
            tiles.push(tile);
        }
    }

    // Shuffle the tiles
    function shuffleTiles() {
        let shuffleMoves = 500; // Reduced from 1000 for performance
        const shuffleInterval = setInterval(() => {
            if (shuffleMoves <= 0) {
                clearInterval(shuffleInterval);
                message.textContent = '';
                return;
            }
            const possibleMoves = getPossibleMoves(emptyTileIndex);
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            swapTiles(randomMove, emptyTileIndex);
            emptyTileIndex = randomMove;
            shuffleMoves--;
        }, 0); // Allows UI to update between moves
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
        const tempBackground = tiles[index1].style.backgroundPosition;
        tiles[index1].style.backgroundPosition = tiles[index2].style.backgroundPosition;
        tiles[index2].style.backgroundPosition = tempBackground;

        const tempText = tiles[index1].textContent;
        tiles[index1].textContent = tiles[index2].textContent;
        tiles[index2].textContent = tempText;

        tiles[index1].classList.toggle('empty', tiles[index1].textContent === '');
        tiles[index2].classList.toggle('empty', tiles[index2].textContent === '');
    }

    // Check adjacency
    function isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / 4), col1 = index1 % 4;
        const row2 = Math.floor(index2 / 4), col2 = index2 % 4;
        return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
    }

    // Get possible moves
    function getPossibleMoves(emptyIndex) {
        const moves = [];
        const row = Math.floor(emptyIndex / 4), col = emptyIndex % 4;
        if (row > 0) moves.push(emptyIndex - 4);
        if (row < 3) moves.push(emptyIndex + 4);
        if (col > 0) moves.push(emptyIndex - 1);
        if (col < 3) moves.push(emptyIndex + 1);
        return moves;
    }

    // Check if solved
    function isSolved() {
        for (let i = 0; i < 15; i++) {
            if (tiles[i].textContent !== (i + 1).toString()) return false;
        }
        return true;
    }

    // Handle image upload
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const image = new Image();
            image.onload = () => {
                initializeBoard();
                processImage(image);
                shuffleTiles();
            };
            image.onerror = () => alert('Error loading image');
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Process and split the image
    function processImage(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Step 1: Crop to square
        const cropSize = Math.min(image.width, image.height);
        canvas.width = cropSize;
        canvas.height = cropSize;
        ctx.drawImage(
            image,
            (image.width - cropSize) / 2,
            (image.height - cropSize) / 2,
            cropSize,
            cropSize,
            0,
            0,
            cropSize,
            cropSize
        );

        // Step 2: Resize to 400x400 for optimization
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = 400;
        resizedCanvas.height = 400;
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCtx.drawImage(canvas, 0, 0, 400, 400);

        // Step 3: Split into tiles
        const imageURL = resizedCanvas.toDataURL();
        tiles.forEach((tile, index) => {
            const row = Math.floor(index / 4);
            const col = index % 4;
            tile.style.backgroundImage = `url(${imageURL})`;
            tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
            tile.textContent = index + 1;
        });

        tiles[15].textContent = '';
        tiles[15].classList.add('empty');
    }

    // Initialize
    initializeBoard();
    shuffleButton.addEventListener('click', shuffleTiles);
});