import { useState, useEffect } from 'react';

import './App.css';
import { Board } from './models/Board';
import { Player } from './models/Player';
import { Colors } from './models/Colors';
import PlayersBoard from './components/shared/boards/PlayersBoard/PlayersBoard';
import CheckersBoard from './components/shared/boards/CheckersBoard/CheckersBoard';
import Button from './components/core/Button/Button';

const whitePlayer = new Player(Colors.WHITE);
const blackPlayer = new Player(Colors.BLACK);

function App() {
    const [board, setBoard] = useState(new Board());
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

    useEffect(() => {
        restart();
    }, []);

    function restart() {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
    }

    function switchPlayer() {
        setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
    }

    return (
        <div className="app">
            <PlayersBoard currentPlayer={currentPlayer} />
            <CheckersBoard
                board={board}
                setBoard={setBoard}
                currentPlayer={currentPlayer}
                switchPlayer={switchPlayer}
            />
            <Button
                text="Начать сначала"
                className="reload-btn black" 
                onClicked={restart}
            />
        </div>
    );
}

export default App;
