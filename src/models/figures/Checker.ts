import blackFigure from '../../assets/checker_black.png';
import whiteFigure from '../../assets/checker_white.png';

import { Figure, FigureNames } from './Figure';
import { Board } from '../Board';
import { Colors } from '../Colors';
import { Square } from '../Square';

export class Checker extends Figure {
    constructor(board: Board, color: Colors, square: Square) {
        super(board, color, square);
        this.board = board;
        this.logo = color === Colors.WHITE ? whiteFigure : blackFigure;
        this.name = FigureNames.CHECKER;
    }

    canMove(target: Square): boolean {
        if (!super.canMove(target) || !this.square.isNotDiagonal(target)) return false;
        return this.isDame ? this.canMoveAsDame(target) : this.canMoveAsChecker(target);
    }

    mustJump(target: Square): boolean {
        // TODO: Задел на будущее
        return false;
    }

    canMoveAsDame(target: Square): boolean {
        const nearestSquares = [];
        const absX = Math.abs(target.x - this.square.x);

        if (absX > 0) {
            for (let i = 1; i <= absX; i++) {
                const x: number = target.x < this.square.x ? this.square.x - (i) : this.square.x + (i);
                const y: number = target.y < this.square.y ? this.square.y - (i) : this.square.y + (i);
                nearestSquares.push(this.board?.getSquare(x, y));
            }
        }

        return nearestSquares.findIndex(square => square?.figure?.color === this.color) === -1;
    }

    canMoveAsChecker(target: Square): boolean {
        const { y: currentY } = this.square;
        const maxStep: number = 2;
        // Ограничиваем длину шага фигуры
        if (target.y + maxStep < currentY || target.y - maxStep > currentY) return false;
        // Если клетка в двух шагах, 
        if (target.y + maxStep === currentY || target.y - maxStep === currentY) {
            // получаем клетку, которая находится в шаге от фигуры
            const nearestSquare = this.board?.getNearestSquare(this.square, target);
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