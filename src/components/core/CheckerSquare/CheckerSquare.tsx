import { FC } from 'react';
import _ from 'lodash';

import './CheckerSquare.scss';
import { Colors } from '../../../types/colors';
import { Square } from '../../../models/Square';

interface SquareProps {
    square: Square;
    selected: boolean;
    onSquareTapped: (square: Square) => void;
}

const CheckerSquare: FC<SquareProps> = ({ square, selected, onSquareTapped }) =>  {
    const { 
        color, 
        figure, 
        availableForMovement, 
        availableWithFigure, 
        highlighted 
    } = square;
    const isAvailableSquare: boolean = color !== Colors.WHITE && !figure;

    return (
        <div 
            className={_.trim([
                'game-board__square', 
                color === Colors.WHITE ? 'light' : 'dark', 
                availableWithFigure ? 'available-with-figure' : '',
                selected ? 'selected' : '',
                isAvailableSquare && availableForMovement ? 'available-for-movement' : '',
                highlighted ? 'highlighted' : ''
            ].join(' '))}
            onClick={() => onSquareTapped(square)}
        >
            {square.figure?.logo && 
                <div 
                    className={
                        `game-board__figure figure ${square.figure?.isDame ? 'is-dame' : ''}`
                    }
                >
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
