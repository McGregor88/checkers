import blackFigure from '../../assets/figures/checker_black.png';
import whiteFigure from '../../assets/figures/checker_white.png';

import { toABS } from '../../lib/utils';
import { Colors } from '../../types/colors';
import { FigureNames } from '../../types/figureNames';
import { Figure } from './Figure';
import { Board } from '../Board';
import { Square } from '../Square';

export class Checker extends Figure {
    private readonly _maxStep: number;

    constructor(board: Board, color: Colors, square: Square) {
        super(board, color, square);
        this.board = board;
        this.logo = color === Colors.WHITE ? whiteFigure : blackFigure;
        this.name = FigureNames.CHECKER;
        this._maxStep = 2;
    }

    public canMove(target: Square): boolean {
        if (!super.canMove(target) || !this.square.isTheSameDiagonal(target)) return false;
        return this.isDame ? this._canMoveAsDame(target) : this._canMoveAsChecker(target);
    }

    public mustJump(target: Square): boolean {
        if (!super.mustJump(target)) return false;

        const nearestSquares: Square[] = this.board?.getNearestSquares(
            this.square, 
            target, 
            this.isDame ? toABS(target.x, this.square.x) : 1
        ) || [];

        if (this.isDame) {
            const enemyPieces: Square[] = nearestSquares.filter(
                square => square?.figure && square.figure.color !== this.color
            );
            const friendlyPiecesIndex = nearestSquares.findIndex(
                square => square?.figure && square.figure.color === this.color
            );
    
            if (enemyPieces.length === 1 && friendlyPiecesIndex === -1) return true;
            return false;
        } else {
            if (this.square.isTooFar(target, this._maxStep)) return false;

            const nearestSquare: Square | undefined = nearestSquares[0];
            if (
                nearestSquare && 
                nearestSquare.x !== target.x && 
                nearestSquare.y !== target.y && 
                nearestSquare.hasEnemyPiece(this.color)
            ) {
                return true;
            }
            return false;
        }
    }

    private _canMoveAsDame(target: Square): boolean {
        const nearestSquares: Square[] = this.board?.getNearestSquares(
            this.square, 
            target, 
            toABS(target.x, this.square.x)
        ) || [];
        const enemyPieces: Square[] = nearestSquares.filter(
            square => square?.figure && square.figure.color !== this.color
        );
        const friendlyPiecesIndex = nearestSquares.findIndex(
            square => square?.figure && square.figure.color === this.color
        );

        if (friendlyPiecesIndex !== -1 || enemyPieces.length > 1) return false;
        return true;
    }

    private _canMoveAsChecker(target: Square): boolean {
        const { y: currentY } = this.square;
        // Ограничиваем длину шага фигуры
        if (this.square.isTooFar(target, this._maxStep)) return false;
        // Если клетка в двух шагах, 
        if (target.y + this._maxStep === currentY || target.y - this._maxStep === currentY) {
            // получаем клетку, которая находится в шаге от фигуры
            const nearestSquare: Square | undefined = this.board?.getNearestSquares(this.square, target, 1)[0];
            // Проверяем клетку на пустоту или наличие дружеской фигуры
            if (nearestSquare?.isEmpty() || nearestSquare?.figure?.color === this.color) {
                return false;
            }
        }
        // Если клетка в одном шаге 
        if (target.y + 1 === currentY || target.y - 1 === currentY) {
            // Сделаем, чтобы они ходили только вперед исходя из цвета
            if (
                (this.color === Colors.WHITE && target.y > currentY) || 
                (this.color === Colors.BLACK && target.y < currentY)
            ) {
                return false;
            }
        }

        return true;
    }
}