import blackFigure from '../../assets/checker_black.png';
import whiteFigure from '../../assets/checker_white.png';

import { Figure, FigureNames } from './Figure';
import { Board } from '../Board';
import { Colors } from '../Colors';
import { Cell } from '../Cell';

export class Checker extends Figure {
    isDame: boolean;

    constructor(board: Board, color: Colors, cell: Cell) {
        super(board, color, cell);
        this.board = board;
        this.logo = color === Colors.WHITE ? whiteFigure : blackFigure;
        this.name = FigureNames.CHECKER;
        this.isDame = false;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target) || !this.cell.isNotDiagonal(target)) return false;
        const { y: currentY } = this.cell;

        if (this.isDame) {
            //pass
        } else {
            const maxStep = 2;
            // Ограничиваем длину шага пешки
            if (target.y + maxStep < currentY || target.y - maxStep > currentY) return false;
            // Если ячейка в двух шагах, 
            if (target.y + maxStep === currentY || target.y - maxStep === currentY) {
                // получаем ячейку, которая находится в шаге от фигуры
                const nearestCell = this.board?.getNearestCell(this.cell, target);
                // Проверяем ячейку на пустоту или наличие дружеской пешки
                if (nearestCell?.isEmpty() || nearestCell?.figure?.color === this.color) {
                    return false;
                }
            }
            // Если ячейка в одном шаге 
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