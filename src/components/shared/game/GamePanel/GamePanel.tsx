import { FC } from 'react';

import './GamePanel.scss';
import { Player } from '../../../../models/Player';
//import Timer from './timer/Timer';

interface BoardProps {
    currentPlayer: Player | null;
}

const GamePanel: FC<BoardProps> = ({ currentPlayer }) => (
    <div className="game-panel">
        <div className="game-panel-info">
            {/*<Timer currentPlayer={currentPlayer} />*/}
            <span className="game-panel-info__caption">Текущий игрок: </span>
            <b className="game-panel-info__curr-player">{currentPlayer?.color}</b>
        </div>
    </div>
);

export default GamePanel;
