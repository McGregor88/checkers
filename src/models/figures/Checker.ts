import blackFigure from '../../assets/checker_black.png';
import whiteFigure from '../../assets/checker_white.png';

import { toABS } from '../../lib/utils';
import { Colors } from '../../types/colors';
import { Figure, FigureNames } from './Figure';
import { Board } from '../Board';
import { Square } from '../Square';

export class Checker extends Figure {
    maxStep: number;

    constructor(board: Board, color: Colors, square: Square) {
        super(board, color, square);
        this.board = board;
        this.logo = color === Colors.WHITE ? whiteFigure : blackFigure;
        this.name = FigureNames.CHECKER;
        this.maxStep = 2;
    }

    canMove(target: Square): boolean {
        if (!super.canMove(target) || !this.square.isTheSameDiagonal(target)) return false;
        return this.isDame ? this.canMoveAsDame(target) : this.canMoveAsChecker(target);
    }

    mustJump(target: Square): boolean {
        if (!super.mustJump(target)) return false;

        if (this.isDame) {
            return true;
        } else {
            // Ограничиваем длину шага фигуры
            if (this.square.isTooFar(target, this.maxStep)) return false;
            // Получаем клетку, которая находится в шаге от фигуры
            const nearestSquare: Square | undefined = this.board?.getNearestSquares(this.square, target, 1)[0];

            if (nearestSquare && nearestSquare.x !== target.x && nearestSquare.y !== target.y && nearestSquare.hasEnemyPiece(this.color)) {
                return true;
            }

            return false;
        }
    }

    canMoveAsDame(target: Square): boolean {
        const nearestSquares: Square[] = this.board?.getNearestSquares(this.square, target, toABS(target.x, this.square.x)) || [];
        const enemyPieces: Square[] = nearestSquares.filter(square => square?.figure && square.figure.color !== this.color);
        const index = nearestSquares.findIndex(square => square?.figure && square.figure.color === this.color);

        if (index !== -1 || enemyPieces.length > 1) {
            return false;
        }

        return true;
    }

    canMoveAsChecker(target: Square): boolean {
        const { y: currentY } = this.square;
        // Ограничиваем длину шага фигуры
        if (this.square.isTooFar(target, this.maxStep)) return false;
        // Если клетка в двух шагах, 
        if (target.y + this.maxStep === currentY || target.y - this.maxStep === currentY) {
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