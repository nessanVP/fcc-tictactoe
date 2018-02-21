$(document).ready(function () {
    var origBoard, huPlayer, aiPlayer;
    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ];

    $('.box').off('click');

    $('#player-x').click(function () {
        huPlayer = 'X';
        aiPlayer = 'O';
        startGame();
    })
    $('#player-o').click(function () {
        huPlayer = 'O';
        aiPlayer = 'X';
        startGame();
    })

    $('#restart').click(function () {
        $('.box').text('');
        origBoard = [];
        huPlayer = null;
        $('#player-x, #player-o').show();
        $('.box').css('background-color', 'black');
        $('.box').off('click');
        $('#results').hide();
    })

    function startGame() {
        origBoard = Array.from(Array(9).keys());
        $('#player-x, #player-o').hide();
        $('.box').on('click', turnClick)
    }

    function turnClick(box) {
        if (typeof origBoard[box.target.id] == 'number') {
            turn(box.target.id, huPlayer);
            if (!checkTie()) turn(bestSpot(), aiPlayer);
        }
    }

    function turn(boxId, player) {
        origBoard[boxId] = player;
        $('#' + boxId).text(player);
        let gameWon = checkWin(origBoard, player);
        if (gameWon) gameOver(gameWon);
    }

    function checkWin(board, player) {
        let plays = board.reduce((a, e, i) =>
            (e === player) ? a.concat(i) : a, []);
        let gameWon = null;
        for (let [index, win] of winCombos.entries()) {
            if (win.every(elem => plays.indexOf(elem) > -1)) {
                gameWon = { index: index, player: player };
                break;
            }
        }
        return gameWon;
    }

    function gameOver(gameWon) {
        for (let index of winCombos[gameWon.index]) {
            document.getElementById(index).style.backgroundColor =
                gameWon.player == huPlayer ? "blue" : "red";
        }
        $('.box').off('click');
        declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!");
    }

    function declareWinner(who) {
        $('#results').show();
        $('#results').text(who);
    }

    function emptySquares() {
        return origBoard.filter(s => typeof s == 'number')
    }

    function bestSpot() {
        return minimax(origBoard, aiPlayer).index;
    }

    function checkTie() {
        if (emptySquares().length == 0) {
            $('.box').css('background-color', 'green');
            $('.box').off('click');
            declareWinner('Tie Game!');
            return true;
        }
        return false;
    }

    function minimax(newBoard, player) {
        var availSpots = emptySquares();

        if (checkWin(newBoard, huPlayer)) {
            return {score: -10};
        } else if (checkWin(newBoard, aiPlayer)) {
            return {score: 10};
        } else if (availSpots.length === 0) {
            return {score: 0};
        }
        var moves = [];
        for (var i = 0; i < availSpots.length; i++) {
            var move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;

            if (player == aiPlayer) {
                var result = minimax(newBoard, huPlayer);
                move.score = result.score;
            } else {
                var result = minimax(newBoard, aiPlayer);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = move.index;

            moves.push(move);
        }

        var bestMove;
        if(player === aiPlayer) {
            var bestScore = -10000;
            for(var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 10000;
            for(var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }
})

