import { useState, useEffect } from 'react';

import './App.css';
import { Board } from './models/Board';
import { Player } from './models/Player';
import { Colors } from './models/Colors';
import PlayersBoard from './components/shared/boards/PlayersBoard/PlayersBoard';
import CheckersBoard from './components/shared/boards/CheckersBoard/CheckersBoard';

const whitePlayer = new Player(Colors.WHITE);
const blackPlayer = new Player(Colors.BLACK);

function App() {
    const [board, setBoard] = useState(new Board());
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

    useEffect(() => {
        restart();
    }, []);

    function switchPlayer() {
        setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
    }

    function restart() {
        const newBoard = new Board();
        newBoard.initSquares();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
    }

    return (
        <div className="app">
            <PlayersBoard currentPlayer={currentPlayer} />
            <CheckersBoard
                board={board}
                setBoard={setBoard}
                currentPlayer={currentPlayer}
                switchPlayer={switchPlayer}
                restart={restart}
            />
        </div>
    );
}

export default App;
