import { FC } from 'react';

import './PlayersBoard.css';
import { Player } from '../../../../models/Player';

interface BoardProps {
    currentPlayer: Player | null;
}

const PlayersBoard: FC<BoardProps> = ({ currentPlayer }) => (
    <div className="players-board">
        <div className="players-board-info">
            <span className="players-board-info__caption">Текущий игрок: </span>
            <b className="players-board-info__curr-player">{currentPlayer?.color}</b>
        </div>
    </div>
);

export default PlayersBoard;
