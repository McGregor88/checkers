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
                const color: Colors = (i + j) % 2 !== 0 ? Colors.BLACK : Colors.WHITE;
                row.push(new Cell(this, j, i, color, null));
            }
            this.cells.push(row);
        }
    }

    public getCopyBoard(): Board {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        return newBoard;
    }

    public highlightCells(selectedCell: Cell | null) {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                target.available = !!selectedCell?.figure?.canMove(target);
            }
        } 
    }

    public getCell(x: number, y: number) {
        return this.cells[y][x];
    }

    private addCheckers() {
        const MAX_CHECKERS_IN_ROW: number = this.maxCellsInRow / 2;
        let offset: number = 1;
        let x: number = 1;
        let y: number = 0;

        for (let i = 0; i < MAX_CHECKERS_IN_ROW * 3; i++) {
            if (i && i % MAX_CHECKERS_IN_ROW === 0) { 
                y += 1; 
                offset = Number(y % 2 === 0);
            }
            x = (i * 2) - (this.maxCellsInRow * y) + offset;

            new Checker(Colors.BLACK, this.getCell(x, y));
            new Checker(Colors.WHITE, this.getCell(this.maxCellsInRow - (x + 1), this.maxCellsInRow - (y + 1)));
        }
    }

    public addFigures() {
        this.addCheckers();
    }
}