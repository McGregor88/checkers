import { FC, Fragment, useState, useEffect } from 'react';
import './GameBoard.scss';
import { sounds } from '../../../../types/sounds';

import { toABS } from '../../../../lib/utils';
import { SoundNames } from '../../../../types/sounds';
import { AudioPlayer } from '../../../../models/AudioPlayer';
import { Move } from '../../../../models/Move';
import { Board } from '../../../../models/Board';
import { Square } from '../../../../models/Square';
import { Figure } from '../../../../models/figures/Figure';
import { Player } from '../../../../models/Player';

import GamePanel from '../../game/GamePanel/GamePanel';
import CheckerSquare from '../../../core/CheckerSquare/CheckerSquare';
import Button from '../../../core/Button/Button';

const audioPlayer: AudioPlayer = new AudioPlayer(sounds);

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    moves: Move[] | [];
    setMoves: (moves: Move[]) => void;
    currentPlayer: Player | null;
    switchPlayer: () => void;
    restart: () => void;
}

const GameBoard: FC<BoardProps> = ({
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
        const highlightPieces = () => {
            if (!currentPlayer) return;
            board.highlightPieces(currentPlayer.color);
            updateBoard();
        };
        highlightPieces();
    }, [moves]);

    useEffect(() => {
        const highlightSquares = () => {
            board.highlightSquares(selectedSquare);
            updateBoard();
        };
        highlightSquares();
    }, [selectedSquare]);

    function updateBoard() {
        setBoard(board.getCopyBoard());
    }

    function moveFigureFromSelectedSquare(selectedSquare: Square, target: Square) {
        const figure: Figure | null = selectedSquare.figure;
        if (!currentPlayer || !figure || !figure?.canMove(target)) return;

        let figureHasJumped: boolean = false;
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

        if (attackedTarget && !attackedTarget.isEqualTo(target) && !attackedTarget.isEmpty()) {
            audioPlayer.play(SoundNames.JUMP);
            board.captureEnemyPiece(attackedTarget.figure);
            figureHasJumped = true;
        }

        figure.updateStatus();
        setSelectedSquare(null);
        updateBoard();
        setMoves([ ...moves, move ]);
        doNextMove(target, figureHasJumped);
    }

    function doNextMove(target: Square, figureHasJumped: boolean) {
        const lostEnemyPieces: Figure[] | [] = board.getLostEnemyPieces(currentPlayer?.color);

        if (lostEnemyPieces.length > 11) {
            audioPlayer.play(SoundNames.VICTORY);
            setGameIsOver(true);
            return;
        }

        if (figureHasJumped && board.hasRequiredSquares(board.getEmptySquares(), target)) {
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
            if (target.figure?.color === currentPlayer?.color && target.availableWithFigure) {
                audioPlayer.play(SoundNames.SELECT);
                setSelectedSquare(target);
            }
        }
    }

    const onRestartBtnClicked = () => {
        audioPlayer.play(SoundNames.SELECT);
        setSelectedSquare(null);
        setGameIsOver(false);
        restart();
    }

    return (
        <div className="game-board-outer">
            {!gameIsOver && <GamePanel currentPlayer={currentPlayer} />}
            <div className="game-board-wrap">
                <div className="game-board">
                    {gameIsOver ? 
                        <div className="game-board-result">
                            <span className="game-board-result__caption">Победитель: </span>
                            <b className="game-board-result__winner">{currentPlayer?.color}</b>
                        </div>
                            : 
                        <>
                            {board.squares.map((row, index) =>
                                <Fragment key={index}>
                                    {row.map((square: Square) =>
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
                className="restart-btn dark" 
                onClicked={onRestartBtnClicked}
            />
        </div>
    );
}

export default GameBoard;
