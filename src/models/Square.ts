import { v4 as uuidv4 } from 'uuid';

import { toABS } from '../lib/utils';
import { Colors } from '../types/colors';
import { Figure } from './figures/Figure';

export class Square {
    readonly id: string;
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    figure: Figure | null;
    availableForSelection: boolean;
    availableForMoving: boolean;
    highlighted: boolean;

    constructor(x: number, y: number, color: Colors, figure: Figure | null) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.id = uuidv4();
        this.availableForSelection = false;
        this.availableForMoving = false;
        this.highlighted = false;
    }

    public isEmpty(): boolean {
        return this.figure === null;
    }

    public hasEnemyPiece(color: Colors): boolean {
        return this.figure && this.figure?.color !== color ? true: false;
    }

    public isTheSameDiagonal(target: Square): boolean {
        return toABS(target.x, this.x) === toABS(target.y, this.y);
    }

    public isTooFar(target: Square, maxStep: number): boolean {
        return (target.y + maxStep < this.y || target.y - maxStep > this.y);
    }
};