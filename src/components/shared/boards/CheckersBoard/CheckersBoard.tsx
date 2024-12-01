import { FC, Fragment, useState, useEffect } from 'react';

import './CheckersBoard.css';
import { Board } from '../../../../models/Board';
import { Cell } from '../../../../models/Cell';
import { Player } from '../../../../models/Player';
import CheckerCell from './cell/CheckerCell';

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player | null;
    switchPlayer: () => void;
}

const CheckersBoard: FC<BoardProps> = ({
    board,
    setBoard,
    currentPlayer,
    switchPlayer
}) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

    useEffect(() => {
        highlightCells();
    }, [selectedCell]);

    function click(cell: Cell) {
        if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
            currentPlayer?.moveFigure(selectedCell, cell);
            switchPlayer();
            setSelectedCell(null);
            updateBoard();
        } else {
            if (cell.figure?.color === currentPlayer?.color) {
                setSelectedCell(cell);
            }
        }
    }

    function highlightCells() {
        board.highlightCells(selectedCell);
        updateBoard();
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    return (
        <div className="checkers-board-outer">
            <div className="checkers-board">
                {board.cells.map((row, index) =>
                    <Fragment key={index}>
                        {row.map(cell =>
                            <CheckerCell 
                                key={cell.id} 
                                cell={cell}
                                selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                                click={click}
                            />
                        )}
                    </Fragment>
                )}
            </div>
        </div>
    );
}

export default CheckersBoard;
