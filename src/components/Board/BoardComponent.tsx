import { FC, Fragment } from 'react';

import './BoardComponent.css';
import { Board } from '../../models/Board';
import CellComponent from '../Cell/CellComponent';

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
}

const BoardComponent: FC<BoardProps> = ({
    board,
    setBoard
}) => {
    return (
        <div className="board-wrap">
            <div className="board">
                {board.cells.map((row, index) =>
                    <Fragment key={index}>
                        {row.map(cell =>
                            <CellComponent 
                                key={cell.id} 
                                cell={cell}
                            />
                        )}
                    </Fragment>
                )}
            </div>
        </div>
    );
}

export default BoardComponent;
