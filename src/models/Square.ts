import { v4 as uuidv4 } from 'uuid';

import { toABS } from '../lib/utils';
import { Colors } from './Colors';
import { Figure } from './figures/Figure';

export class Square {
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    figure: Figure | null;
    id: string;
    availableForSelection: boolean;
    availableForMoving: boolean;

    constructor(x: number, y: number, color: Colors, figure: Figure | null) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.id = uuidv4();
        this.availableForSelection = false;
        this.availableForMoving = false;
    }

    isEmpty(): boolean {
        return this.figure === null;
    }

    isNotDiagonal(target: Square): boolean {
        return toABS(target.x, this.x) === toABS(target.y, this.y);
    }
};