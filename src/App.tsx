import { useState } from 'react';
import './App.css';

import { Colors } from './types/colors';
import { Move } from './models/Move';
import { Board } from './models/Board';
import { Player } from './models/Player';

import MainNavigation from './components/shared/navigations/MainNavigation/MainNavigation';
import PlayerSection from './components/core/PlayerSection/PlayerSection';
import GameBoard from './components/shared/game/GameBoard/GameBoard';

const whitePlayer: Player = new Player(Colors.WHITE);
const blackPlayer: Player = new Player(Colors.BLACK);

function App() {
    const [board, setBoard] = useState<Board>(new Board());
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [moves, setMoves] = useState<Move[] | []>([]);
    const [menuIsShown, setMenuIsShown] = useState<boolean>(true);

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
        setMenuIsShown(false);
    }

    return (
        <div className="app">
            <MainNavigation
                show={menuIsShown} 
                restart={restart}
            />

            {!menuIsShown && 
                <div className="game">
                    <PlayerSection
                        currentPlayer={currentPlayer}
                        title="Белые фигуры"
                        color={Colors.BLACK}
                        figures={board.getLostEnemyPieces(Colors.BLACK)}  
                    />
                    <GameBoard
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
            }
        </div>
    );
}

export default App;
