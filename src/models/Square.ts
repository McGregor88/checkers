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
    availableWithFigure: boolean;
    availableForMovement: boolean;
    highlighted: boolean;

    constructor(x: number, y: number, color: Colors, figure: Figure | null) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.id = uuidv4();
        this.availableWithFigure = false;
        this.availableForMovement = false;
        this.highlighted = false;
    }

    /**
     * Checks if the square is empty (i.e., does not contain a figure).
     * 
     * @returns A boolean value indicating whether the square is empty.
     *          Returns true if the square does not contain a figure, false otherwise.
     */
    public isEmpty(): boolean {
        return this.figure === null;
    }

    /**
     * Checks if the square contains an enemy piece of a different color.
     * 
     * @param color - The color to compare against (representing the current player's color).
     * @returns A boolean indicating whether an enemy piece is present (true) or not (false).
     */
    public hasEnemyPiece(color: Colors): boolean {
        return this.figure && this.figure?.color !== color ? true: false;
    }

    /**
     * Determines if the target square is on the same diagonal as this square.
     * 
     * @param target - The square to compare against this square.
     * @returns A boolean indicating whether the target square is on the same diagonal (true) or not (false).
     */
    public isTheSameDiagonal(target: Square): boolean {
        return toABS(target.x, this.x) === toABS(target.y, this.y);
    }

    /**
     * Checks if the target square is too far away from this square based on the maximum allowed steps.
     *
     * @param target - The square to compare against this square.
     * @param maxStep - The maximum number of steps allowed between this square and the target square.
     * @returns A boolean indicating whether the target square is too far away (true) or not (false).
     *          Returns true if the target square is more than `maxStep` away from this square in 
     *          either the vertical or horizontal direction, false otherwise.
     */
    public isTooFar(target: Square, maxStep: number): boolean {
        return (target.y + maxStep < this.y || target.y - maxStep > this.y);
    }

    /**
     * Checks if this square is equal to another square.
     * 
     * @param target - The square to compare against this square.
     * @returns A boolean indicating whether the squares are equal (true) or not (false).
     *          Returns true if both squares have the same x and y coordinates, false otherwise.
     */
    public isEqualTo(target: Square): boolean {
        return this.x === target.x && this.y === target.y;
    }
};
