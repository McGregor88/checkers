import { FC } from 'react';
import { Player } from '../../../../../models/Player';

interface TimerProps {
    currentPlayer: Player | null;
}

const Timer: FC<TimerProps> = ({ currentPlayer }) => {
    return (
        <div>Timer</div>
    );
};

export default Timer;
