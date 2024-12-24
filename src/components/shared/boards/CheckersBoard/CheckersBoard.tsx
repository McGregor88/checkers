import { FC, Fragment, useState, useEffect } from 'react';
import './CheckersBoard.css';

import { toABS } from '../../../../lib/utils';
import { Colors } from '../../../../types/colors';
import { SoundNames } from '../../../../types/sounds';
import { AudioPlayer } from '../../../../models/AudioPlayer';
import { Move } from '../../../../models/Move';
import { Board } from '../../../../models/Board';
import { Square } from '../../../../models/Square';
import { Player } from '../../../../models/Player';

import CheckerSquare from './square/CheckerSquare';
import GameBoard from '../GameBoard/GameBoard';
import Button from '../../../core/Button/Button';

const audioPlayer = new AudioPlayer();

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
            board.highlightPieces(currentPlayer?.color);
            updateBoard();
        }
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    function moveFigureFromSelectedSquare(selectedSquare: Square, target: Square) {
        const figure = selectedSquare.figure;
        if (!currentPlayer || !figure || !figure?.canMove(target)) return;

        let figureJumped: boolean = false;
        const nearestSquares: Square[] = board.getNearestSquares(
            selectedSquare, 
            target, 
            figure.isDame ? toABS(target.x, selectedSquare.x) : 1
        );
        const attackedTarget: Square | undefined = nearestSquares.find(square => square?.figure);
        const move: Move = new Move(
            currentPlayer, 
            { x: selectedSquare.x, y: selectedSquare.y }, 
            { x: target.x, y: target.y}
        );

        target.figure = figure;
        target.figure.square = target;
        board.removeFigureFromSquare(selectedSquare);
        // Если перепрыгиваем вражескую фигуру, то забираем ее
        if (
            attackedTarget && 
            attackedTarget.x !== target.x && 
            attackedTarget.y !== target.y && 
            attackedTarget.figure
        ) {
            audioPlayer.play(SoundNames.JUMP);
            board.captureEnemyPiece(attackedTarget.figure);
            figureJumped = true;
        }
        
        board.checkFigureForDame(figure);
        setSelectedSquare(null);
        updateBoard();
        setMoves([ ...moves, move ]);
        doNextMove(target, figureJumped);
    }

    function doNextMove(target: Square, figureJumped: boolean) {
        const lostEnemyPieces = currentPlayer?.color === Colors.WHITE ? board.lostBlackFigures : board.lostWhiteFigures;

        if (lostEnemyPieces.length > 11) {
            audioPlayer.play(SoundNames.VICTORY);
            setGameIsOver(true);
            return;
        }

        if (figureJumped && board.hasRequiredSquares(board.getEmptySquares(), target)) {
            setSelectedSquare(target);
        } else {
            audioPlayer.play(SoundNames.SWITCH);
            switchPlayer();
        }
    }

    const onSquareTapped = (target: Square) => {
        if (selectedSquare && selectedSquare !== target && selectedSquare.figure?.canMove(target)) {
            moveFigureFromSelectedSquare(selectedSquare, target);
        } else {
            if (target.figure?.color === currentPlayer?.color && target.availableForMoving) {
                audioPlayer.play(SoundNames.SELECT_TICK);
                setSelectedSquare(target);
            }
        }
    }

    const onReloadBtnClicked = () => {
        audioPlayer.play(SoundNames.SWITCH);
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
