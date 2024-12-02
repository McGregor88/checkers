import { FC } from 'react';
import { Cell } from '../../../../../models/Cell';
import { Colors } from '../../../../../models/Colors';

interface CellProps {
    cell: Cell;
    selected: boolean;
    click: (cell: Cell) => void;
}

const CheckerCell: FC<CellProps> = ({ cell, selected, click }) =>  {
    return (
        <div 
            className={[
                'cell', cell.color, 
                selected ? 'selected' : '',
                cell.available && cell.color !== Colors.WHITE && !cell.figure ? 'available' : ''
            ].join(' ')}
            onClick={() => click(cell)}
        >
            {cell.figure?.logo && <img src={cell.figure.logo} alt="" className="cell__figure" />}
        </div>
    );
}

export default CheckerCell;
