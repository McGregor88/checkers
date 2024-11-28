import { Cell } from './Cell';
import { Colors } from './Colors';

export class Board {
    cells: Cell[][] = [];

    public initCells() {
        // TODO: Подумать над другим вариантом решения, т.к. образуется кольцевая зависимость
        // Доска будет знать про ячейки и ячейки будут знать про доску в которой находятся
        for (let i = 0; i < 8; i++) {
            const row: Cell[] = [];

            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 !== 0) {
                    // Черные ячейки
                    row.push(new Cell(this, j, i, Colors.BLACK, null));
                } else {
                    // Белые ячейки
                    row.push(new Cell(this, j, i, Colors.WHITE, null));
                }
            }
            this.cells.push(row);
        }
    }
} 