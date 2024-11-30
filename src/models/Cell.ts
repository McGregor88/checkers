import { v4 as uuidv4 } from 'uuid';

import { Colors } from './Colors';
import { Figure } from './figures/Figure';
import { Board } from './Board';

export class Cell {
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    board: Board;
    figure: Figure | null;
    available: boolean;
    id: string;

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.available = false;
        this.id = uuidv4();
    }

    isEmpty() {
        return this.figure === null;
    }
    
    isEmptyDiagonal(target: Cell): boolean {
        const absX = Math.abs(target.x - this.x);
        const absY = Math.abs(target.y - this.y);
        if (absY !== absX) return false;

        const dy = this.y < target.y ? 1 : -1;
        const dx = this.x < target.x ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) {
                return false;
            }
        }
        return true;
    }

    setFigure(figure: Figure) {
        this.figure = figure;
        this.figure.cell = this;
    }

    moveFigure(target: Cell) {
        if (this.figure && this.figure?.canMove(target)) {
            this.figure.moveFigure(target);
            target.setFigure(this.figure);
            this.figure = null;
        }
    }
};