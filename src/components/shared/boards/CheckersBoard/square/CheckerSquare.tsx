import { FC } from 'react';
import { Square } from '../../../../../models/Square';
import { Colors } from '../../../../../models/Colors';

interface SquareProps {
    square: Square;
    selected: boolean;
    tap: (square: Square) => void;
}

const CheckerSquare: FC<SquareProps> = ({ square, selected, tap }) =>  {
    return (
        <div 
            className={[
                'checkers-board__square', square.color, 
                selected ? 'selected' : '',
                square.available && square.color !== Colors.WHITE && !square.figure ? 'available' : ''
            ].join(' ')}
            onClick={() => tap(square)}
        >
            {square.figure?.logo && <img src={square.figure.logo} alt={square.figure.name} className="checkers-board__figure" />}
        </div>
    );
}

export default CheckerSquare;
