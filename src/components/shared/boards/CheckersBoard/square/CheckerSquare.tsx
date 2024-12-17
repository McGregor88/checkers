import { FC } from 'react';
import { Square } from '../../../../../models/Square';
import { Colors } from '../../../../../models/Colors';
import './CheckerSquare.css';

interface SquareProps {
    square: Square;
    selected: boolean;
    onSquareTapped: (square: Square) => void;
}

const CheckerSquare: FC<SquareProps> = ({ square, selected, onSquareTapped }) =>  {
    const { color, figure, availableForSelection, availableForMoving } = square;
    const isAvailableSquare: boolean = color !== Colors.WHITE && !figure;

    return (
        <div 
            className={[
                'checkers-board__square', 
                color === Colors.WHITE ? 'light' : 'dark', 
                selected ? 'selected' : '',
                isAvailableSquare && availableForSelection ? 'available-for-selection' : '',
                availableForMoving ? 'available-for-moving' : ''
            ].join(' ').trim()}
            onClick={() => onSquareTapped(square)}
        >
            {square.figure?.logo && <img src={square.figure.logo} alt={square.figure.name} className="checkers-board__figure" />}
        </div>
    );
}

export default CheckerSquare;
