import { Colors } from './Colors';
import { Figure } from './Figure';
import { Board } from './Board';

export class Cell {
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    board: Board;
    figure: Figure | null;
    available: boolean;
    id: number;

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.available = false;
        /*this.id = board.cells.reduce((acc, row, rowIndex) => {
            const cellIndex = row.findIndex((cell) => cell.x === x && cell.y === y);
            return acc + rowIndex * row.length + cellIndex;
        }, 0);*/
        this.id = Math.random();
    }
};