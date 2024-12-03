import { v4 as uuidv4 } from 'uuid';

import { Colors } from './Colors';
import { Figure } from './figures/Figure';

export class Square {
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    figure: Figure | null;
    id: string;
    available: boolean;

    constructor(x: number, y: number, color: Colors, figure: Figure | null) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.id = uuidv4();
        this.available = false;
    }

    isEmpty(): boolean {
        return this.figure === null;
    }

    isNotDiagonal(target: Square): boolean {
        return Math.abs(target.x - this.x) === Math.abs(target.y - this.y);
    }
};