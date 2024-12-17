import { FC, Fragment, useState, useEffect } from 'react';

import './CheckersBoard.css';
import { Board } from '../../../../models/Board';
import { Square } from '../../../../models/Square';
import { Player } from '../../../../models/Player';
import { Colors } from '../../../../models/Colors';
import CheckerSquare from './square/CheckerSquare';
import GameBoard from '../GameBoard/GameBoard';
import Button from '../../../core/Button/Button';

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player | null;
    switchPlayer: () => void;
    restart: () => void;
}

const CheckersBoard: FC<BoardProps> = ({
    board,
    setBoard,
    currentPlayer,
    switchPlayer,
    restart,
}) => {
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);

    useEffect(() => {
        highlightFigures();
    }, [currentPlayer]);

    useEffect(() => {
        highlightSquares();
    }, [selectedSquare]);

    function highlightSquares() {
        board.highlightSquares(selectedSquare);
        updateBoard();
    }

    function highlightFigures() {
        board.highlightFigures(currentPlayer?.color || null);
        updateBoard();
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    const onSquareTapped = (square: Square) => {
        if (selectedSquare && selectedSquare !== square && selectedSquare.figure?.canMove(square)) {
            const enemyColor: Colors = currentPlayer?.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
            const enemyPieces: Square[] = board.getSquaresWithFigureByColor(enemyColor);
            const sfdsdf = currentPlayer?.color === Colors.WHITE ? board?.lostBlackFigures : board?.lostWhiteFigures;
            //console.log(sfdsdf.length);

            board?.moveFigureFromSelectedSquare(selectedSquare, square);
            //console.log(enemyPieces.length);
            //debugger;
            if (sfdsdf.length > 2) {
                setIsGameOver(true);
            } else {
                switchPlayer();
                setSelectedSquare(null);
                updateBoard();
            }

        } else {
            if (square.figure?.color === currentPlayer?.color && square.availableForMoving) {
                setSelectedSquare(square);
            }
        }
    }

    const onReloadBtnClicked = () => {
        setSelectedSquare(null);
        setIsGameOver(false);
        restart();
    }

    return (
        <div className="checkers-board-outer">
            
            {!isGameOver && <GameBoard currentPlayer={currentPlayer} />}

            <div className="checkers-board-wrap">
                <div className="checkers-board">
                    {isGameOver ? 
                        <div className="checkers-board-result">
                            <span className="checkers-board-result__caption">Победитель: </span>
                            <b className="checkers-board-result__winner">{currentPlayer?.color}</b>
                        </div>
                            : 
                        <>
                            {board.squares.map((row, index) =>
                                <Fragment key={index}>
                                    {row.map(square =>
                                        <CheckerSquare 
                                            key={square.id} 
                                            square={square}
                                            selected={square.x === selectedSquare?.x && square.y === selectedSquare?.y}
                                            onSquareTapped={onSquareTapped}
                                        />
                                    )}
                                </Fragment>
                            )}
                        </>
                    }
                </div>
            </div>

            <Button
                text="Начать сначала"
                className="reload-btn black" 
                onClicked={onReloadBtnClicked}
            />
        </div>
    );
}

export default CheckersBoard;
