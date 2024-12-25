import { useState, useEffect } from 'react';
import './App.css';

import { Colors } from './types/colors';
import { Move } from './models/Move';
import { Board } from './models/Board';
import { Player } from './models/Player';

import PlayerSection from './components/core/Section/PlayerSection';
import CheckersBoard from './components/shared/boards/CheckersBoard/CheckersBoard';

const whitePlayer: Player = new Player(Colors.WHITE);
const blackPlayer: Player = new Player(Colors.BLACK);

function App() {
    const [board, setBoard] = useState<Board>(new Board());
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [moves, setMoves] = useState<Move[] | []>([]);

    useEffect(() => {
        restart();
    }, []);

    function switchPlayer() {
        setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
    }

    function restart() {
        const newBoard: Board = new Board();
        newBoard.initSquares();
        newBoard.setUpPieces();
        newBoard.highlightPieces(Colors.WHITE);
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
    }

    return (
        <div className="app">
            <PlayerSection
                currentPlayer={currentPlayer}
                title="Белые фигуры"
                color={Colors.BLACK}
                figures={board.getLostEnemyPieces(Colors.BLACK)}  
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
                currentPlayer={currentPlayer}
                title="Черные фигуры"
                color={Colors.WHITE}
                figures={board.getLostEnemyPieces(Colors.WHITE)}  
            />
        </div>
    );
}

export default App;
