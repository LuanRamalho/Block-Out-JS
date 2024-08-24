document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');
    const levelDisplay = document.getElementById('level');
    
    let score = 0;
    let level = 1;
    let highScore = localStorage.getItem('highScore') || 0;
    highScoreDisplay.textContent = highScore;

    const colors = ['blue', 'navy', 'cyan', 'yellow', 'green', 'red', 'magenta', 'pink', 'orange'];

    // Function to create the game board
    function createBoard() {
        for (let i = 0; i < 100; i++) {
            const block = document.createElement('div');
            block.classList.add('block');
            block.setAttribute('draggable', true);
            let randomColor = colors[Math.floor(Math.random() * colors.length)];
            block.dataset.color = randomColor;
            block.style.backgroundColor = randomColor;
            board.appendChild(block);

            block.addEventListener('dragstart', dragStart);
            block.addEventListener('dragend', dragEnd);
            block.addEventListener('dragover', dragOver);
            block.addEventListener('drop', dragDrop);
        }
    }

    // Drag and drop functions
    let colorBeingDragged, blockBeingDragged, blockBeingReplaced;

    function dragStart() {
        colorBeingDragged = this.dataset.color;
        blockBeingDragged = this;
    }

    function dragEnd() {
        blockBeingDragged = null;
        blockBeingReplaced = null;
        checkForMatches();
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragDrop() {
        blockBeingReplaced = this;
        if (blockBeingReplaced.dataset.color !== colorBeingDragged) {
            let tempColor = blockBeingReplaced.dataset.color;
            blockBeingReplaced.dataset.color = colorBeingDragged;
            blockBeingReplaced.style.backgroundColor = colorBeingDragged;
            blockBeingDragged.dataset.color = tempColor;
            blockBeingDragged.style.backgroundColor = tempColor;
        }
    }

    // Function to check for matches and eliminate blocks
    function checkForMatches() {
        let matches = [];
        // Check rows
        for (let i = 0; i < 100; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = board.children[i].dataset.color;
            const isBlank = board.children[i].dataset.color === '';

            if (rowOfThree.every(index => board.children[index] && board.children[index].dataset.color === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.textContent = score;
                rowOfThree.forEach(index => {
                    board.children[index].dataset.color = '';
                    board.children[index].style.backgroundColor = '';
                });
                matches.push(...rowOfThree);
            }
        }

        // Check columns
        for (let i = 0; i < 70; i++) {
            let columnOfThree = [i, i + 10, i + 20];
            let decidedColor = board.children[i].dataset.color;
            const isBlank = board.children[i].dataset.color === '';

            if (columnOfThree.every(index => board.children[index] && board.children[index].dataset.color === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.textContent = score;
                columnOfThree.forEach(index => {
                    board.children[index].dataset.color = '';
                    board.children[index].style.backgroundColor = '';
                });
                matches.push(...columnOfThree);
            }
        }

        // Update High Score
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('highScore', highScore);
        }

        // Advance to next level when all blocks are eliminated
        if (matches.length > 0) {
            setTimeout(() => {
                level++;
                levelDisplay.textContent = level;
                board.innerHTML = '';
                createBoard();
            }, 500);
        }
    }

    createBoard();
});
