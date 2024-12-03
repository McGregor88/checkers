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
        const { x: currentX, y: currentY } = this.cell;

        if (this.isDame) {
            //pass
        } else {
            const maxStepLength = 2;
            // Ограничиваем длину шага пешки
            if (target.y + maxStepLength < currentY || target.y - maxStepLength > currentY) return false;

            // Если ячейка в двух шагах, 
            if (target.y + maxStepLength === currentY || target.y - maxStepLength === currentY) {
                // то нужно будет получить ячейку которая находится в шаге от фигуры
                let x = target.y > currentY ? currentX - 1 : currentX + 1;
                let y = target.y > currentY ? currentY + 1 : currentY - 1 ;
                const interimCell = this.board?.getCell(x, y);
                // Проверить есть ли у этой ячейки фигура и ее цвет отличается от фигуры текущей ячейки
                if (interimCell?.isEmpty() || interimCell?.figure?.color === this.color) {
                    return false;
                }
                // Если это фигура вражеская, то двигаться можно
            }
            
        }
    
        return true;
    }
}