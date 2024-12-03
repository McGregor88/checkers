import blackFigure from '../../assets/checker_black.png';
import whiteFigure from '../../assets/checker_white.png';

import { Figure, FigureNames } from './Figure';
import { Colors } from '../Colors';
import { Cell } from '../Cell';

export class Checker extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.WHITE ? whiteFigure : blackFigure;
        this.name = FigureNames.CHECKER;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target) || !this.cell.isNotDiagonal(target)) return false;
        return true;
    }
}