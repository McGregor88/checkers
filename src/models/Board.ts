import { Cell } from './Cell';
import { Colors } from './Colors';
import { Checker } from './figures/Checker';

export class Board {
    cells: Cell[][] = [];
    maxCellsInRow: number = 8;

    public initCells() {
        // TODO: Подумать над другим вариантом решения, т.к. образуется кольцевая зависимость
        // Доска будет знать про ячейки и ячейки будут знать про доску в которой находятся
        for (let i = 0; i < this.maxCellsInRow; i++) {
            const row: Cell[] = [];

            for (let j = 0; j < this.maxCellsInRow; j++) {
                row.push(new Cell(this, j, i, (i + j) % 2 !== 0 ? Colors.BLACK : Colors.WHITE, null));
            }

            this.cells.push(row);
        }
    }

    public getCell(x: number, y: number) {
        return this.cells[y][x];
    }

    private addCheckers() {
        const TOTAL_CHECKERS: number = 24;
        const getX = (i: number, y: number, offset: number): number => (i * 2) - (this.maxCellsInRow * y) + offset;
        const getXOffset = (y: number): number => Number(y % 2 === 0);
        let yTop: number = 0;
        let yBottom: number = 5;

        for (let i = 0; i < TOTAL_CHECKERS / 2; i++) {
            if (i && i % (this.maxCellsInRow / 2) === 0) {
                yTop += 1;
                yBottom += 1;
            }

            new Checker(Colors.BLACK, this.getCell(getX(i, yTop, getXOffset(yTop)), yTop));
            new Checker(Colors.WHITE, this.getCell(getX(i, yTop, getXOffset(yBottom)), yBottom));
        }
    }

    public addFigures() {
        this.addCheckers();
    }
}