import blackFigure from '../../assets/checker_black.png';
import whiteFigure from '../../assets/checker_white.png';

import { Figure, FigureNames } from './Figure';
import { Board } from '../Board';
import { Colors } from '../Colors';
import { Square } from '../Square';

export class Checker extends Figure {
    isDame: boolean;

    constructor(board: Board, color: Colors, square: Square) {
        super(board, color, square);
        this.board = board;
        this.logo = color === Colors.WHITE ? whiteFigure : blackFigure;
        this.name = FigureNames.CHECKER;
        this.isDame = false;
    }

    canMove(target: Square): boolean {
        if (!super.canMove(target) || !this.square.isNotDiagonal(target)) return false;
        const { y: currentY } = this.square;

        if (this.isDame) {
            //pass
        } else {
            const maxStep: number = 2;
            // Ограничиваем длину шага пешки
            if (target.y + maxStep < currentY || target.y - maxStep > currentY) return false;
            // Если клетка в двух шагах, 
            if (target.y + maxStep === currentY || target.y - maxStep === currentY) {
                // получаем клетку, которая находится в шаге от фигуры
                const nearestSquare = this.board?.getNearestSquare(this.square, target);
                // Проверяем клетку на пустоту или наличие дружеской пешки
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
        }
    
        return true;
    }
}