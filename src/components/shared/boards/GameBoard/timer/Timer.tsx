import { FC, useState, useEffect, useRef } from 'react';
import { Player } from '../../../../../models/Player';
import { Colors } from '../../../../../models/Colors';

interface TimerProps {
    currentPlayer: Player | null;
}

const TIME: number = 300;

const Timer: FC<TimerProps> = ({ currentPlayer }) => {
    const [blackTime, setBlackTime] = useState<number>(TIME);
    const [whiteTime, setWhiteTime] = useState<number>(TIME);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);

    useEffect(() => {
        startTimer();
    }, [currentPlayer]);

    function startTimer() {
        if (timer.current) {
            clearInterval(timer.current);
        }

        const callback = currentPlayer?.color === Colors.WHITE ? decrementWhiteTime : decrementBlackTime;

        timer.current = setInterval(callback, 1000);
    }

    function decrementBlackTime() {
        setBlackTime(prevTime => prevTime - 1);
    }

    function decrementWhiteTime() {
        setWhiteTime(prevTime => prevTime - 1);
    }

    // TODO: при рестарте обнулить счетчик
    const handleRestart = () => {
        setBlackTime(TIME);
        setWhiteTime(TIME);
    }

    return (
        <div>
            <h2>Черные - {blackTime}</h2>
            <h2>Белые - {whiteTime}</h2>
        </div>
    );
};

export default Timer;
