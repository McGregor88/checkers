import logo from '../../assets/checker_black.png';
import { Colors } from '../Colors';
import { Cell } from '../Cell';

export enum FigureNames {
    FIGURE = "Фигура",
    CHECKER = "Шашка"
}

export class Figure {
    color: Colors;
    logo: typeof logo | null;
    cell: Cell;
    name: FigureNames;
    id: number;

    constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.cell = cell;
        this.cell.figure = this;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        //this.id = Date.now();
        this.id = Math.random();
    }

    canMove(target: Cell): boolean {
        if (target.color === Colors.WHITE || target.figure) {
            return false;
        }
        return true;
    }

    moveFigure(target: Cell) {}
};
