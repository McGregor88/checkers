import { FC } from 'react';

import './GameBoard.css';
import { Player } from '../../../../models/Player';

interface BoardProps {
    currentPlayer: Player | null;
}

const GameBoard: FC<BoardProps> = ({ currentPlayer }) => (
    <div className="game-board">
        <div className="game-board-info">
            <span className="game-board-info__caption">Текущий игрок: </span>
            <b className="game-board-info__curr-player">{currentPlayer?.color}</b>
        </div>
    </div>
);

export default GameBoard;
