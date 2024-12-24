import { FC } from 'react';
import _ from 'lodash';

import './CheckerSquare.css';
import { Colors } from '../../../../../types/colors';
import { Square } from '../../../../../models/Square';

interface SquareProps {
    square: Square;
    selected: boolean;
    onSquareTapped: (square: Square) => void;
}

const CheckerSquare: FC<SquareProps> = ({ square, selected, onSquareTapped }) =>  {
    const { color, figure, availableForSelection, availableForMoving, highlighted } = square;
    const isAvailableSquare: boolean = color !== Colors.WHITE && !figure;

    return (
        <div 
            className={_.trim([
                'checkers-board__square', 
                color === Colors.WHITE ? 'light' : 'dark', 
                availableForMoving ? 'available-for-moving' : '',
                selected ? 'selected' : '',
                isAvailableSquare && availableForSelection ? 'available-for-selection' : '',
                highlighted ? 'highlighted' : ''
            ].join(' '))}
            onClick={() => onSquareTapped(square)}
        >
            {square.figure?.logo && 
                <div className={`checkers-board__figure figure ${square.figure?.isDame ? 'is-dame' : ''}`}>
                    <img 
                        src={square.figure.logo} 
                        alt={square.figure.name} 
                        className={`figure__icon`} 
                    />
                </div>
            }
        </div>
    );
}

export default CheckerSquare;
