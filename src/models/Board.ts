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

    public getCell(x: number, y: number) {
        return this.cells[y][x];
    }

    private addCheckers() {
        const checkersCount: number = 12;
        let xTop: number = 1;
        let xBottom: number = 0;
        let yTop: number = 0;
        let yBottom: number = 5;

        const getOffset = (y: number): number => Number(y % 2 === 0);
        const getX = (i: number, y: number, offset: number): number => (i * 2) - (this.maxCellsInRow * y) + offset;

        for (let i = 0; i < checkersCount; i++) {
            if (i && i % (this.maxCellsInRow / 2) === 0) {
                yTop += 1;
                yBottom += 1;
            }
            xTop = getX(i, yTop, getOffset(yTop));
            xBottom = getX(i, yTop, getOffset(yBottom));

            new Checker(Colors.BLACK, this.getCell(xTop, yTop));
            new Checker(Colors.WHITE, this.getCell(xBottom, yBottom));
        }
    }

    public addFigures() {
        this.addCheckers();
    }
}