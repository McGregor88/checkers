import { Colors } from './Colors';
import { Cell } from './Cell';

export class Player {
    color: Colors;

    constructor(color: Colors) {
        this.color = color;
    }

    moveFigureFromSelectedCell(selectedCell: Cell, target: Cell) {
        const figure = selectedCell.figure;
        if (figure && figure?.canMove(target)) {
            target.figure = figure
            target.figure.cell = target
            selectedCell.figure = null;
        }
    }
};