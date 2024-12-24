import { useState, useEffect } from 'react';

import './App.css';
import selectTick from './assets/sounds/select-tick.wav';
import switchSound from './assets/sounds/switch-sound.wav';
import jump from './assets/sounds/jump.wav';
import victory from './assets/sounds/jingle-win.wav';

import { Colors } from './types/colors';
import { SoundNames } from './types/soundNames';
import { AudioPlayer } from './models/AudioPlayer';
import { Move } from './models/Move';
import { Board } from './models/Board';
import { Player } from './models/Player';

import PlayerSection from './components/core/Section/PlayerSection';
import CheckersBoard from './components/shared/boards/CheckersBoard/CheckersBoard';

const sounds: object = {
    [SoundNames.SELECT_TICK]: selectTick,
    [SoundNames.SWITCH]: switchSound,
    [SoundNames.JUMP]: jump,
    [SoundNames.VICTORY]: victory,
};

const audioPlayer = new AudioPlayer(sounds);
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
                currentPlayer={currentPlayer}
                title="Белые фигуры"
                color={Colors.BLACK}
                figures={board.lostWhiteFigures}  
            />
            <CheckersBoard
                audioPlayer={audioPlayer}
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
                figures={board.lostBlackFigures}  
            />
        </div>
    );
}

export default App;
