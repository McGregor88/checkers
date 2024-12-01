import { FC } from 'react';

import './PlayersBoard.css';
import { Player } from '../../../../models/Player';

interface BoardProps {
    currentPlayer: Player | null;
}

const PlayersBoard: FC<BoardProps> = ({
    currentPlayer,
}) => {
    return (
        <div className="players-board">
            <div className="app-header">
                <h3>Текущий игрок: {currentPlayer?.color}</h3>
            </div>
        </div>
    );
}

export default PlayersBoard;
