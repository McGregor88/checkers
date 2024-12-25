import { v4 as uuidv4 } from 'uuid';

import logo from '../../assets/figures/checker_black.png';
import { Colors } from '../../types/colors';
import { FigureNames } from '../../types/figureNames';
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

    public mustJump(target: Square): boolean {
        if (!this.canMove(target)) return false;
        return true;
    }

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
