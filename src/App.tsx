import { useState, useEffect } from 'react';

import './App.css';
import { Colors } from './types/colors';
import { Move } from './models/Move';
import { Board } from './models/Board';
import { Player } from './models/Player';
import PlayerSection from './components/core/Section/PlayerSection';
import CheckersBoard from './components/shared/boards/CheckersBoard/CheckersBoard';

const whitePlayer = new Player(Colors.WHITE);
const blackPlayer = new Player(Colors.BLACK);

function App() {
    const [board, setBoard] = useState(new Board());
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [moves, setMoves] = useState<Move[] | []>([]);

    useEffect(() => {
        restart();
    }, []);

    function switchPlayer() {
        setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
    }

    function restart() {
        const newBoard = new Board();
        newBoard.initSquares();
        newBoard.setUpPieces();
        newBoard.highlightPieces(Colors.WHITE);
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
    }

    return (
        <div className="app">
            <PlayerSection
                title="Белые фигуры"
                color={Colors.BLACK}
                figures={board.lostWhiteFigures}  
            />
            <CheckersBoard
                board={board}
                setBoard={setBoard}
                moves={moves}
                setMoves={setMoves}
                currentPlayer={currentPlayer}
                switchPlayer={switchPlayer}
                restart={restart}
            />
            <PlayerSection
                title="Черные фигуры"
                color={Colors.WHITE}
                figures={board.lostBlackFigures}  
            />
        </div>
    );
}

export default App;
