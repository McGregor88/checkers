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
    const [gameIsOver, setGameIsOver] = useState<boolean>(false);

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

            board?.moveFigureFromSelectedSquare(selectedSquare, square);
            setSelectedSquare(null);
            updateBoard();

            if (board.getSquaresWithFigureByColor(enemyColor).length < 1) {
                setGameIsOver(true);
            } else {
                switchPlayer();
            }
        } else {
            if (square.figure?.color === currentPlayer?.color && square.availableForMoving) {
                setSelectedSquare(square);
            }
        }
    }

    const onReloadBtnClicked = () => {
        setSelectedSquare(null);
        setGameIsOver(false);
        restart();
    }

    return (
        <div className="checkers-board-outer">
            {!gameIsOver && <GameBoard currentPlayer={currentPlayer} />}
            <div className="checkers-board-wrap">
                <div className="checkers-board">
                    {gameIsOver ? 
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
                className="reload-btn dark" 
                onClicked={onReloadBtnClicked}
            />
        </div>
    );
}

export default CheckersBoard;
