import { v4 as uuidv4 } from 'uuid';

import logo from '../../assets/figures/checker_black.png';
import { Colors } from '../../types/colors';
import { FigureNames } from '../../types/pieces';
import { Board } from '../Board';
import { Square } from '../Square';

export class Figure {
    readonly id: string;
    readonly color: Colors;
    board: Board | null;
    square: Square;
    logo: typeof logo | null;
    name: FigureNames;
    isDame: boolean;

    constructor(board: Board, color: Colors, square: Square) {
        this.id = uuidv4();
        this.board = board;
        this.color = color;
        this.square = square;
        this.square.figure = this;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        this.isDame = false;
    }

    /**
     * Determines if the figure must perform a jump move to the target square.
     * 
     * @param target - The square to which the figure is attempting to jump.
     * @returns A boolean indicating whether the figure must jump (true) or not (false).
     *          Returns false if the figure cannot move to the target square.
     */
    public mustJump(target: Square): boolean {
        if (!this.canMove(target)) return false;
        return true;
    }

    /**
     * Determines if the figure can move to the target square.
     * 
     * @param target - The square to which the figure is attempting to move.
     * @returns A boolean indicating whether the move is valid (true) or not (false).
     */
    public canMove(target: Square): boolean {
        if (
            target.color === Colors.WHITE || 
            !target.isEmpty() || 
            !this.square.isTheSameDiagonal(target)
        ) {
            return false;
        }

        return true;
    }
};
