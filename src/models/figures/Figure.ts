import { v4 as uuidv4 } from 'uuid';

import logo from '../../assets/checker_black.png';
import { Board } from '../Board';
import { Colors } from '../Colors';
import { Square } from '../Square';

export enum FigureNames {
    FIGURE = "Фигура",
    CHECKER = "Шашка"
}

export class Figure {
    board: Board | null;
    color: Colors;
    logo: typeof logo | null;
    square: Square;
    name: FigureNames;
    id: string;

    constructor(board: Board, color: Colors, square: Square) {
        this.board = board;
        this.color = color;
        this.square = square;
        this.square.figure = this;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        this.id = uuidv4();
    }

    canMove(target: Square): boolean {
        if (target.color === Colors.WHITE || target.figure) return false;
        return true;
    }
};
