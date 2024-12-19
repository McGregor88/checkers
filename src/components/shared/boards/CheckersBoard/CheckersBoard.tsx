import { FC, Fragment, useState, useEffect } from 'react';
import './CheckersBoard.css';

import { Colors } from '../../../../types/colors';
import { Move } from '../../../../models/Move';
import { Board } from '../../../../models/Board';
import { Square } from '../../../../models/Square';
import { Player } from '../../../../models/Player';

import CheckerSquare from './square/CheckerSquare';
import GameBoard from '../GameBoard/GameBoard';
import Button from '../../../core/Button/Button';

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    moves: Move[] | [];
    setMoves: (moves: Move[]) => void;
    currentPlayer: Player | null;
    switchPlayer: () => void;
    restart: () => void;
}

const CheckersBoard: FC<BoardProps> = ({
    board,
    setBoard,
    moves,
    setMoves,
    currentPlayer,
    switchPlayer,
    restart,
}) => {
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [gameIsOver, setGameIsOver] = useState<boolean>(false);

    useEffect(() => {
        highlightFigures();
    }, [moves]);

    useEffect(() => {
        highlightSquares();
    }, [selectedSquare]);

    function highlightSquares() {
        board.highlightSquares(selectedSquare);
        updateBoard();
    }

    function highlightFigures() {
        if (currentPlayer) {
            board.highlightFigures(currentPlayer?.color);
            updateBoard();
        }
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    function moveFigure(selectedSquare: Square, target: Square) {
        if (!currentPlayer) return;

        const move = new Move(
            currentPlayer, 
            { x: selectedSquare.x, y: selectedSquare.y }, 
            { x: target.x, y: target.y}
        );

        board?.moveFigureFromSelectedSquare(selectedSquare, target);
        setSelectedSquare(null);
        updateBoard();
        setMoves([ ...moves, move ]);
        nextMove();
    }

    function nextMove() {
        const lostEnemyPieces = currentPlayer?.color === Colors.WHITE ? board.lostBlackFigures : board.lostWhiteFigures;
        const shouldJump: boolean = false;

        if (lostEnemyPieces.length > 11) {
            setGameIsOver(true);
            return;
        }

        if (!shouldJump) {
            switchPlayer();
        }
    }

    const onSquareTapped = (target: Square) => {
        if (selectedSquare && selectedSquare !== target && selectedSquare.figure?.canMove(target)) {
            moveFigure(selectedSquare, target);
        } else {
            if (target.figure?.color === currentPlayer?.color && target.availableForMoving) {
                setSelectedSquare(target);
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
