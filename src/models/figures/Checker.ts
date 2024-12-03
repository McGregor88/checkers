import blackFigure from '../../assets/checker_black.png';
import whiteFigure from '../../assets/checker_white.png';

import { Figure, FigureNames } from './Figure';
import { Board } from '../Board';
import { Colors } from '../Colors';
import { Cell } from '../Cell';

export class Checker extends Figure {
    constructor(board: Board, color: Colors, cell: Cell) {
        super(board, color, cell);
        this.logo = color === Colors.WHITE ? whiteFigure : blackFigure;
        this.name = FigureNames.CHECKER;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target) || !this.cell.isNotDiagonal(target)) return false;

        // Пока так, ограничиваем длину шага пешки
        if (target.y + 2 < this.cell.y || target.y - 2 > this.cell.y) {
            return false;
        }

        return true;
    }
}